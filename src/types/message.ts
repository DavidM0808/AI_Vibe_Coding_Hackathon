import { User } from './auth';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender?: User;
  receiver?: User;
}

export interface Conversation {
  id: string;
  participant: User;
  last_message?: Message;
  unread_count: number;
  updated_at: string;
}

export interface Contact {
  id: string;
  user_id: string;
  contact_user_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
  contact_user: User;
}

export interface TypingIndicator {
  userId: string;
  isTyping: boolean;
}

export interface UserStatusUpdate {
  userId: string;
  status: 'online' | 'offline' | 'away';
}