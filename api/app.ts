import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import { supabase } from './config/supabase.js';
import './types/socket.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.CORS_ORIGIN || 'https://your-frontend-domain.vercel.app']
      : ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CORS_ORIGIN || 'https://your-frontend-domain.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Socket.io connection handling
const connectedUsers = new Map<string, string>(); // userId -> socketId

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    socket.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', async (socket) => {
  console.log(`User ${socket.userId} connected with socket ${socket.id}`);
  
  // Store user connection
  connectedUsers.set(socket.userId, socket.id);
  
  // Update user status to online
  await supabase
    .from('users')
    .update({ status: 'online', last_seen: new Date().toISOString() })
    .eq('id', socket.userId);

  // Store session in database
  await supabase
    .from('user_sessions')
    .insert({
      user_id: socket.userId,
      socket_id: socket.id,
      is_active: true
    });

  // Join user to their personal room
  socket.join(socket.userId);

  // Broadcast user online status to contacts
  socket.broadcast.emit('user_status_changed', {
    userId: socket.userId,
    status: 'online'
  });

  // Handle joining chat rooms
  socket.on('join_chat', (data) => {
    const { chatId } = data;
    socket.join(chatId);
    console.log(`User ${socket.userId} joined chat ${chatId}`);
  });

  // Handle leaving chat rooms
  socket.on('leave_chat', (data) => {
    const { chatId } = data;
    socket.leave(chatId);
    console.log(`User ${socket.userId} left chat ${chatId}`);
  });

  // Handle sending messages
  socket.on('send_message', async (data) => {
    try {
      const { receiverId, content, messageType = 'text' } = data;
      
      // Insert message into database
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          sender_id: socket.userId,
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

      if (error) {
        socket.emit('message_error', { error: 'Failed to send message' });
        return;
      }

      // Send message to receiver if online
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new_message', message);
      }

      // Confirm message sent to sender
      socket.emit('message_sent', message);
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const { receiverId } = data;
    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', {
        userId: socket.userId,
        isTyping: true
      });
    }
  });

  socket.on('typing_stop', (data) => {
    const { receiverId } = data;
    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', {
        userId: socket.userId,
        isTyping: false
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log(`User ${socket.userId} disconnected`);
    
    // Remove from connected users
    connectedUsers.delete(socket.userId);
    
    // Update user status to offline
    await supabase
      .from('users')
      .update({ status: 'offline', last_seen: new Date().toISOString() })
      .eq('id', socket.userId);

    // Deactivate session
    await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('socket_id', socket.id);

    // Broadcast user offline status
    socket.broadcast.emit('user_status_changed', {
      userId: socket.userId,
      status: 'offline'
    });
  });
});

// Make io available to routes
app.set('io', io);

export { app, server, io };
export default app;
