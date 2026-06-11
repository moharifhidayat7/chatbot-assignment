import { create } from 'zustand';
import type { Message, ChatStatus } from '../types/chat.types';

export interface ChatSession {
  messages: Message[];
  status: ChatStatus;
  conversationId: string | null;
  lastUserMsgId: string | null;
  lastUserContent: string;
  assistantMsgId: string | null;
}

export const defaultSession = (): ChatSession => ({
  messages: [],
  status: 'idle',
  conversationId: null,
  lastUserMsgId: null,
  lastUserContent: '',
  assistantMsgId: null,
});

interface ChatSessionState {
  sessions: Record<string, ChatSession>;
  update: (key: string, updater: (s: ChatSession) => ChatSession) => void;
}

export const useChatSessionStore = create<ChatSessionState>()((set) => ({
  sessions: {},
  update: (key, updater) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [key]: updater(state.sessions[key] ?? defaultSession()),
      },
    })),
}));
