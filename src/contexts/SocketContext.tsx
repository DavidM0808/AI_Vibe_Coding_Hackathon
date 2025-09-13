import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { Message, TypingIndicator, UserStatusUpdate } from '../types/message';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  typingUsers: string[];
  sendMessage: (receiverId: string, content: string, messageType?: string) => void;
  sendTyping: (receiverId: string, isTyping: boolean) => void;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  startTyping: (receiverId: string) => void;
  stopTyping: (receiverId: string) => void;
  onNewMessage: (callback: (message: Message) => void) => void;
  onMessageSent: (callback: (message: Message) => void) => void;
  onUserTyping: (callback: (data: TypingIndicator) => void) => void;
  onUserStatusChanged: (callback: (data: UserStatusUpdate) => void) => void;
  offNewMessage: (callback: (message: Message) => void) => void;
  offMessageSent: (callback: (message: Message) => void) => void;
  offUserTyping: (callback: (data: TypingIndicator) => void) => void;
  offUserStatusChanged: (callback: (data: UserStatusUpdate) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { user, token } = useAuth();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  useEffect(() => {
    if (user && token) {
      // Initialize socket connection
      const newSocket = io(API_BASE_URL, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      // Clean up socket when user logs out
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user, token]);

  const sendMessage = (receiverId: string, content: string, messageType: string = 'text') => {
    if (socket && isConnected) {
      socket.emit('send_message', {
        receiverId,
        content,
        messageType
      });
    }
  };

  const sendTyping = (receiverId: string, isTyping: boolean) => {
    if (socket && isConnected) {
      if (isTyping) {
        socket.emit('typing_start', { receiverId });
      } else {
        socket.emit('typing_stop', { receiverId });
      }
    }
  };

  const joinChat = (chatId: string) => {
    if (socket && isConnected) {
      socket.emit('join_chat', { chatId });
    }
  };

  const leaveChat = (chatId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_chat', { chatId });
    }
  };

  const startTyping = (receiverId: string) => {
    if (socket && isConnected) {
      socket.emit('typing_start', { receiverId });
    }
  };

  const stopTyping = (receiverId: string) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', { receiverId });
    }
  };

  const onNewMessage = (callback: (message: Message) => void) => {
    if (socket) {
      socket.on('new_message', callback);
    }
  };

  const onMessageSent = (callback: (message: Message) => void) => {
    if (socket) {
      socket.on('message_sent', callback);
    }
  };

  const onUserTyping = (callback: (data: TypingIndicator) => void) => {
    if (socket) {
      socket.on('user_typing', callback);
    }
  };

  const onUserStatusChanged = (callback: (data: UserStatusUpdate) => void) => {
    if (socket) {
      socket.on('user_status_changed', callback);
    }
  };

  const offNewMessage = (callback: (message: Message) => void) => {
    if (socket) {
      socket.off('new_message', callback);
    }
  };

  const offMessageSent = (callback: (message: Message) => void) => {
    if (socket) {
      socket.off('message_sent', callback);
    }
  };

  const offUserTyping = (callback: (data: TypingIndicator) => void) => {
    if (socket) {
      socket.off('user_typing', callback);
    }
  };

  const offUserStatusChanged = (callback: (data: UserStatusUpdate) => void) => {
    if (socket) {
      socket.off('user_status_changed', callback);
    }
  };

  const value = {
    socket,
    isConnected,
    typingUsers,
    sendMessage,
    sendTyping,
    joinChat,
    leaveChat,
    startTyping,
    stopTyping,
    onNewMessage,
    onMessageSent,
    onUserTyping,
    onUserStatusChanged,
    offNewMessage,
    offMessageSent,
    offUserTyping,
    offUserStatusChanged
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};