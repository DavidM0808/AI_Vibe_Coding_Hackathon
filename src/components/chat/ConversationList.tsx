import React from 'react';
import { Conversation } from '../../types/message';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onConversationSelect: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  onConversationSelect
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-sm">No conversations yet</p>
          <p className="text-xs mt-1">Start a new conversation with your contacts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conversation) => {
        const isSelected = selectedConversation === conversation.id;
        const hasUnread = conversation.unread_count > 0;
        
        return (
          <div
            key={conversation.id}
            onClick={() => onConversationSelect(conversation.id)}
            className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
              isSelected ? 'bg-blue-50 border-r-2 border-blue-600' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {conversation.participant.avatar_url ? (
                  <img
                    src={conversation.participant.avatar_url}
                    alt={conversation.participant.username}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {conversation.participant.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {/* Status indicator */}
                <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                  getStatusColor(conversation.participant.status)
                }`}></div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-medium truncate ${
                    hasUnread ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {conversation.participant.username}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {conversation.last_message && (
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                      </span>
                    )}
                    {hasUnread && (
                      <div className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                      </div>
                    )}
                  </div>
                </div>
                
                {conversation.last_message ? (
                  <p className={`text-sm mt-1 truncate ${
                    hasUnread ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}>
                    {conversation.last_message.message_type === 'image' ? (
                      <span className="flex items-center">
                        <span className="mr-1">📷</span>
                        Photo
                      </span>
                    ) : conversation.last_message.message_type === 'file' ? (
                      <span className="flex items-center">
                        <span className="mr-1">📎</span>
                        File
                      </span>
                    ) : (
                      truncateMessage(conversation.last_message.content)
                    )}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 mt-1">No messages yet</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;