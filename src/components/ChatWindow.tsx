import React, { useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';
import type { Contact, Message } from '../types';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  contact: Contact;
  messages: Message[];
  draftMessage: string;
  replyTo: Message | null;
  onSendMessage: (content: string) => void;
  onDeleteMessage: (id: number) => void;
  onUpdateDraft: (draft: string) => void;
  onSetReplyTo: (message: Message | null) => void;
  onReactToMessage: (messageId: number, emoji: string) => void;
}

export default function ChatWindow({
  contact,
  messages,
  draftMessage = '',
  replyTo,
  onSendMessage,
  onDeleteMessage,
  onUpdateDraft,
  onSetReplyTo,
  onReactToMessage
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = (draftMessage || '').trim();
    if (trimmedMessage) {
      const finalMessage = replyTo
        ? `Replying to "${replyTo.content}": ${trimmedMessage}`
        : trimmedMessage;
      onSendMessage(finalMessage);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold text-gray-800">{contact.name}</h2>
              <span className="text-sm text-green-500">{contact.online ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Phone className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
            <Video className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
            <MoreVertical className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender === 'me'}
            onDelete={onDeleteMessage}
            onReply={onSetReplyTo}
            onReact={onReactToMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-gray-200 p-4">
        {replyTo && (
          <div className="mb-2 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex-1">
              <span className="text-xs text-gray-500">Replying to</span>
              <p className="text-sm text-gray-700 truncate">{replyTo.content}</p>
            </div>
            <button
              type="button"
              onClick={() => onSetReplyTo(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={draftMessage || ''}
            onChange={(e) => onUpdateDraft(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
          >
            <Smile className="w-5 h-5" />
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-150"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}