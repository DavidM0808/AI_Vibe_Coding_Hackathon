import React from 'react';
import { Contact } from '../../types/message';
import { MessageCircle, UserPlus } from 'lucide-react';

interface ContactListProps {
  contacts: Contact[];
  onStartConversation?: (userId: string) => void;
  onContactSelect?: (contactId: string) => void;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onStartConversation,
  onContactSelect
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      default:
        return 'Offline';
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <UserPlus className="h-12 w-12 mb-4 text-gray-300" />
        <div className="text-center">
          <p className="text-sm">No contacts yet</p>
          <p className="text-xs mt-1">Search for users to add as contacts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {contacts.map((contact) => {
        return (
          <div
            key={contact.id}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {contact.contact_user.avatar_url ? (
                    <img
                      src={contact.contact_user.avatar_url}
                      alt={contact.contact_user.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {contact.contact_user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {/* Status indicator */}
                  <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                    getStatusColor(contact.contact_user.status)
                  }`}></div>
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {contact.contact_user.username}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {getStatusText(contact.contact_user.status)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (onStartConversation) {
                      onStartConversation(contact.contact_user.id);
                    }
                    if (onContactSelect) {
                      onContactSelect(contact.contact_user.id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Start conversation"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;