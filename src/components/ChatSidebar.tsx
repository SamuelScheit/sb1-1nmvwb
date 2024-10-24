import React, { useState, useMemo } from 'react';
import { Search, Settings, MessageSquare } from 'lucide-react';
import type { Contact } from '../types';

interface ChatSidebarProps {
  contacts: Contact[];
  selectedChat: number;
  onSelectChat: (id: number) => void;
}

export default function ChatSidebar({ contacts, selectedChat, onSelectChat }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return contacts;
    
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(query) ||
      contact.lastMessage.toLowerCase().includes(query)
    );
  }, [contacts, searchQuery]);

  return (
    <div className="w-80 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
          <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No matches found
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onSelectChat(contact.id)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ease-in-out border-b border-gray-100
                ${selectedChat === contact.id ? 'bg-gray-50' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                    <span className="text-xs text-gray-500">{contact.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">{contact.unread}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-150">
          <MessageSquare className="w-5 h-5" />
          <span>New Message</span>
        </button>
      </div>
    </div>
  );
}