import React, { useState, useEffect } from 'react';
import { Search, Plus, Settings, MessageCircle, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { Conversation, Contact } from '../../types/message';
import ContactList from './ContactList';
import ConversationList from './ConversationList';
import ChatRoom from './ChatRoom';
import AddContactModal from './AddContactModal';
import ProfileSettings from '../profile/ProfileSettings';

const ChatDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'conversations' | 'contacts'>('conversations');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { user, logout, token } = useAuth();
  const { isConnected, sendMessage, onNewMessage, offNewMessage, onUserStatusChanged, offUserStatusChanged } = useSocket();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  useEffect(() => {
    if (user && token) {
      fetchConversations();
      fetchContacts();
    }
  }, [user, token]);

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      // Update conversations with new message
      setConversations(prev => {
        const updated = [...prev];
        const conversationIndex = updated.findIndex(
          conv => conv.participant.id === message.sender_id || conv.participant.id === message.receiver_id
        );
        
        if (conversationIndex >= 0) {
          updated[conversationIndex].last_message = message;
          updated[conversationIndex].updated_at = message.created_at;
          if (message.sender_id !== user?.id) {
            updated[conversationIndex].unread_count += 1;
          }
          // Move to top
          const conversation = updated.splice(conversationIndex, 1)[0];
          updated.unshift(conversation);
        }
        
        return updated;
      });
    };

    const handleUserStatusChanged = (data: any) => {
      // Update user status in conversations and contacts
      setConversations(prev => 
        prev.map(conv => 
          conv.participant.id === data.userId 
            ? { ...conv, participant: { ...conv.participant, status: data.status } }
            : conv
        )
      );
      
      setContacts(prev => 
        prev.map(contact => 
          contact.contact_user.id === data.userId 
            ? { ...contact, contact_user: { ...contact.contact_user, status: data.status } }
            : contact
        )
      );
    };

    onNewMessage(handleNewMessage);
    onUserStatusChanged(handleUserStatusChanged);

    return () => {
      offNewMessage(handleNewMessage);
      offUserStatusChanged(handleUserStatusChanged);
    };
  }, [user]);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages/contacts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    // Mark conversation as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unread_count: 0 }
          : conv
      )
    );
  };

  const handleContactAdded = () => {
    fetchContacts();
    setShowAddContact(false);
  };

  const filteredConversations = conversations.filter(conv => 
    conv.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact => 
    contact.contact_user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showSettings) {
    return <ProfileSettings onClose={() => setShowSettings(false)} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-xs text-gray-500">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddContact(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Add Contact"
              >
                <Plus className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('conversations')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'conversations'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Chats</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'contacts'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Contacts</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : activeTab === 'conversations' ? (
            <ConversationList
              conversations={filteredConversations}
              selectedConversation={selectedConversation}
              onConversationSelect={handleConversationSelect}
            />
          ) : (
            <ContactList
              contacts={filteredContacts}
              onContactSelect={(contactId) => {
                const contact = contacts.find(c => c.id === contactId);
                if (contact) {
                  // Find or create conversation with this contact
                  const existingConv = conversations.find(
                    conv => conv.participant.id === contact.contact_user.id
                  );
                  if (existingConv) {
                    setSelectedConversation(existingConv.id);
                  } else {
                    // Create new conversation
                    setSelectedConversation(contact.contact_user.id);
                  }
                  setActiveTab('conversations');
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          (() => {
            const conversation = conversations.find(conv => conv.id === selectedConversation);
            return (
              <ChatRoom
                conversationId={selectedConversation}
                participantName={conversation?.participant.username || 'Unknown'}
                participantStatus={conversation?.participant.status || 'offline'}
                messages={[]}
                onSendMessage={(content) => {
                  if (sendMessage) {
                    sendMessage(conversation?.participant.id || selectedConversation, content);
                  }
                }}
                onBack={() => setSelectedConversation(null)}
              />
            );
          })()
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Messages</h3>
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddContactModal
        isOpen={showAddContact}
        onClose={() => setShowAddContact(false)}
        onAddContact={(contact) => {
          // Handle adding contact logic here
          console.log('Contact added:', contact);
        }}
        onContactAdded={handleContactAdded}
      />
    </div>
  );
};

export default ChatDashboard;