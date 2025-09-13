import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Middleware to authenticate user
const authenticateUser = async (req: Request, res: Response, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Send a message
router.post('/send', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { receiverId, content, messageType = 'text' } = req.body;
    const senderId = (req as any).userId;

    if (!receiverId || !content) {
      return res.status(400).json({ error: 'Receiver ID and content are required' });
    }

    // Check if receiver exists
    const { data: receiver, error: receiverError } = await supabase
      .from('users')
      .select('id')
      .eq('id', receiverId)
      .single();

    if (receiverError || !receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    // Insert message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        message_type: messageType
      })
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, username, avatar_url),
        receiver:users!messages_receiver_id_fkey(id, username, avatar_url)
      `)
      .single();

    if (messageError) {
      return res.status(500).json({ error: 'Failed to send message' });
    }

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get conversation between two users
router.get('/conversation/:userId', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { userId: otherUserId } = req.params;
    const currentUserId = (req as any).userId;
    const { page = 1, limit = 50 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    // Get messages between current user and other user
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, username, avatar_url),
        receiver:users!messages_receiver_id_fkey(id, username, avatar_url)
      `)
      .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }

    // Mark messages as read
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', otherUserId)
      .eq('receiver_id', currentUserId)
      .eq('is_read', false);

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page: Number(page),
        limit: Number(limit),
        hasMore: messages.length === Number(limit)
      }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all conversations for current user
router.get('/conversations', authenticateUser, async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).userId;

    // Get latest message for each conversation
    const { data: conversations, error } = await supabase
      .rpc('get_user_conversations', { user_id: currentUserId });

    if (error) {
      // Fallback query if RPC function doesn't exist
      const { data: messages, error: fallbackError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, username, avatar_url, status),
          receiver:users!messages_receiver_id_fkey(id, username, avatar_url, status)
        `)
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false });

      if (fallbackError) {
        return res.status(500).json({ error: 'Failed to fetch conversations' });
      }

      // Group messages by conversation partner
      const conversationMap = new Map();
      messages?.forEach(message => {
        const partnerId = message.sender_id === currentUserId ? message.receiver_id : message.sender_id;
        const partner = message.sender_id === currentUserId ? message.receiver : message.sender;
        
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            partner,
            lastMessage: message,
            unreadCount: 0
          });
        }
        
        // Count unread messages
        if (!message.is_read && message.receiver_id === currentUserId) {
          conversationMap.get(partnerId).unreadCount++;
        }
      });

      const conversationsList = Array.from(conversationMap.values());
      return res.json({ conversations: conversationsList });
    }

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search users
router.get('/search-users', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const currentUserId = (req as any).userId;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, email, full_name, avatar_url, status')
      .neq('id', currentUserId)
      .or(`username.ilike.%${query}%,email.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(20);

    if (error) {
      return res.status(500).json({ error: 'Failed to search users' });
    }

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add contact
router.post('/contacts', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { contactId } = req.body;
    const userId = (req as any).userId;

    if (!contactId) {
      return res.status(400).json({ error: 'Contact ID is required' });
    }

    if (contactId === userId) {
      return res.status(400).json({ error: 'Cannot add yourself as contact' });
    }

    // Check if contact already exists
    const { data: existingContact } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .eq('contact_id', contactId)
      .single();

    if (existingContact) {
      return res.status(400).json({ error: 'Contact already exists' });
    }

    // Add contact
    const { data: contact, error } = await supabase
      .from('contacts')
      .insert({
        user_id: userId,
        contact_id: contactId,
        status: 'accepted' // Auto-accept for simplicity
      })
      .select(`
        *,
        contact:users!contacts_contact_id_fkey(id, username, email, full_name, avatar_url, status)
      `)
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to add contact' });
    }

    res.status(201).json({
      message: 'Contact added successfully',
      contact
    });
  } catch (error) {
    console.error('Add contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get contacts
router.get('/contacts', authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const { data: contacts, error } = await supabase
      .from('contacts')
      .select(`
        *,
        contact:users!contacts_contact_id_fkey(id, username, email, full_name, avatar_url, status, last_seen)
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch contacts' });
    }

    res.json({ contacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;