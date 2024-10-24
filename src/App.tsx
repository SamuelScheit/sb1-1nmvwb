import React, { useState, useEffect } from 'react';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import type { Contact, Message, ChatData } from './types';

const initialContacts: Contact[] = [
  {
    id: 1,
    name: 'Sarah Wilson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    lastMessage: 'Hey, are we still meeting today?',
    time: '2m ago',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'James Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lastMessage: 'The project looks great! 🚀',
    time: '1h ago',
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    lastMessage: 'Thanks for your help yesterday',
    time: '2h ago',
    unread: 0,
    online: false,
  },
];

const initialChats: ChatData[] = [
  {
    contactId: 1,
    messages: [
      {
        id: 1,
        sender: 'them',
        content: 'Hey! How are you doing?',
        time: '10:00 AM',
        reactions: {},
      },
      {
        id: 2,
        sender: 'me',
        content: "I'm doing great! Just finished the new feature we discussed.",
        time: '10:02 AM',
        reactions: {},
      },
    ],
    draftMessage: '',
    replyTo: null,
  },
  {
    contactId: 2,
    messages: [
      {
        id: 1,
        sender: 'them',
        content: 'The project looks amazing!',
        time: '9:30 AM',
        reactions: {},
      },
      {
        id: 2,
        sender: 'me',
        content: 'Thanks! Really happy with how it turned out.',
        time: '9:35 AM',
        reactions: {},
      },
    ],
    draftMessage: '',
    replyTo: null,
  },
  {
    contactId: 3,
    messages: [
      {
        id: 1,
        sender: 'them',
        content: 'Thanks for your help yesterday',
        time: '8:00 AM',
        reactions: {},
      },
      {
        id: 2,
        sender: 'me',
        content: 'Anytime! Let me know if you need anything else.',
        time: '8:05 AM',
        reactions: {},
      },
    ],
    draftMessage: '',
    replyTo: null,
  },
];

function App() {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('messenger-contacts');
    return saved ? JSON.parse(saved) : initialContacts;
  });

  const [chats, setChats] = useState<ChatData[]>(() => {
    const saved = localStorage.getItem('messenger-chats');
    return saved ? JSON.parse(saved) : initialChats;
  });

  const [selectedChat, setSelectedChat] = useState(() => {
    const saved = localStorage.getItem('messenger-selected-chat');
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem('messenger-contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('messenger-chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('messenger-selected-chat', selectedChat.toString());
  }, [selectedChat]);

  const handleSelectChat = (contactId: number) => {
    setSelectedChat(contactId);
    setContacts(contacts.map(contact => 
      contact.id === contactId ? { ...contact, unread: 0 } : contact
    ));
  };

  const handleSendMessage = (content: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMessage: Message = {
      id: Date.now(),
      sender: 'me',
      content,
      time: timeString,
      reactions: {},
    };

    setChats(chats.map(chat => 
      chat.contactId === selectedChat
        ? {
            ...chat,
            messages: [...chat.messages, newMessage],
            draftMessage: '',
            replyTo: null,
          }
        : chat
    ));

    setContacts(contacts.map(contact => 
      contact.id === selectedChat
        ? { ...contact, lastMessage: content, time: 'Just now' }
        : contact
    ));
  };

  const handleDeleteMessage = (messageId: number) => {
    setChats(chats.map(chat => 
      chat.contactId === selectedChat
        ? { ...chat, messages: chat.messages.filter(msg => msg.id !== messageId) }
        : chat
    ));
  };

  const handleUpdateDraft = (draft: string) => {
    setChats(chats.map(chat =>
      chat.contactId === selectedChat
        ? { ...chat, draftMessage: draft }
        : chat
    ));
  };

  const handleSetReplyTo = (message: Message | null) => {
    setChats(chats.map(chat =>
      chat.contactId === selectedChat
        ? { ...chat, replyTo: message }
        : chat
    ));
  };

  const handleReactToMessage = (messageId: number, emoji: string) => {
    setChats(chats.map(chat => {
      if (chat.contactId !== selectedChat) return chat;

      return {
        ...chat,
        messages: chat.messages.map(msg => {
          if (msg.id !== messageId) return msg;

          const currentReaction = msg.reactions[emoji];
          const hasReacted = currentReaction?.reactedBy.includes(1); // Using 1 as current user ID

          const updatedReactions = {
            ...msg.reactions,
            [emoji]: hasReacted
              ? {
                  emoji,
                  count: currentReaction.count - 1,
                  reactedBy: currentReaction.reactedBy.filter(id => id !== 1),
                }
              : {
                  emoji,
                  count: (currentReaction?.count || 0) + 1,
                  reactedBy: [...(currentReaction?.reactedBy || []), 1],
                },
          };

          // Remove reaction if count becomes 0
          if (updatedReactions[emoji].count === 0) {
            delete updatedReactions[emoji];
          }

          return {
            ...msg,
            reactions: updatedReactions,
          };
        }),
      };
    }));
  };

  const selectedContact = contacts.find(contact => contact.id === selectedChat);
  const selectedChatData = chats.find(chat => chat.contactId === selectedChat);

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <ChatSidebar 
        contacts={contacts}
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
      />
      {selectedContact && selectedChatData && (
        <ChatWindow
          contact={selectedContact}
          messages={selectedChatData.messages}
          draftMessage={selectedChatData.draftMessage}
          replyTo={selectedChatData.replyTo}
          onSendMessage={handleSendMessage}
          onDeleteMessage={handleDeleteMessage}
          onUpdateDraft={handleUpdateDraft}
          onSetReplyTo={handleSetReplyTo}
          onReactToMessage={handleReactToMessage}
        />
      )}
    </div>
  );
}

export default App;