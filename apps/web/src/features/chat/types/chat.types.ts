export type Role = 'user' | 'assistant';

export type ChatStatus = 'idle' | 'loading' | 'streaming' | 'error';

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: Date;
}

export interface SendPayload {
  projectId: string;
  conversationId: string | null;
  messages: Array<{ role: Role; content: string }>;
}

export interface SendResponse {
  conversationId: string;
}
