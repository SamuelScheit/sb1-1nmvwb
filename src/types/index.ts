export interface Contact {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export interface Reaction {
  emoji: string;
  count: number;
  reactedBy: number[]; // user IDs who reacted
}

export interface Message {
  id: number;
  sender: 'me' | 'them';
  content: string;
  time: string;
  reactions: Record<string, Reaction>;
}

export interface ChatData {
  contactId: number;
  messages: Message[];
  draftMessage: string;
  replyTo: Message | null;
}