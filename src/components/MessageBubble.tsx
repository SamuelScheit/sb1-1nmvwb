import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Copy, Reply, Trash2, Smile } from 'lucide-react';
import type { Message, Reaction } from '../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onDelete: (id: number) => void;
  onReply: (message: Message) => void;
  onReact: (messageId: number, emoji: string) => void;
}

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export default function MessageBubble({ message, isOwn, onDelete, onReply, onReact }: MessageBubbleProps) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContextMenu(true);
    setShowReactionPicker(false);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(message.content);
    setShowContextMenu(false);
  };

  const handleSwipeComplete = (event: any, info: any) => {
    const offset = info.offset.x;
    if (Math.abs(offset) > 100) {
      onReply(message);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
      setShowContextMenu(false);
      setShowReactionPicker(false);
    }
  };

  const handleReaction = (emoji: string) => {
    onReact(message.id, emoji);
    setShowReactionPicker(false);
    setShowContextMenu(false);
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderReactions = () => {
    if (!message.reactions || Object.keys(message.reactions).length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {Object.entries(message.reactions).map(([emoji, reaction]) => (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            className={`inline-flex items-center space-x-1 text-xs rounded-full px-2 py-1 
              ${isOwn ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <span>{emoji}</span>
            <span>{reaction.count}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="relative">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, opacity }}
        onDragEnd={handleSwipeComplete}
        className={`touch-none flex ${isOwn ? 'justify-end' : 'justify-start'}`}
      >
        <div
          onContextMenu={handleContextMenu}
          className={`max-w-[70%] rounded-lg p-3 cursor-pointer
            ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
        >
          <p>{message.content}</p>
          <span className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'} block mt-1`}>
            {message.time}
          </span>
          {renderReactions()}
        </div>
      </motion.div>

      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="absolute z-10 bg-white rounded-lg shadow-lg py-2 mt-2"
          style={{
            [isOwn ? 'right' : 'left']: '0',
            top: '100%',
          }}
        >
          <button
            onClick={() => setShowReactionPicker(true)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Smile className="w-4 h-4 mr-2" />
            React
          </button>
          <button
            onClick={() => {
              onReply(message);
              setShowContextMenu(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </button>
          <button
            onClick={handleCopyText}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Text
          </button>
          <button
            onClick={() => {
              onDelete(message.id);
              setShowContextMenu(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>

          {showReactionPicker && (
            <div className="absolute w-max top-0 left-full ml-2 bg-white rounded-lg shadow-lg p-2">
              <div className="grid grid-cols-3 gap-2">
                {REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="text-xl w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}