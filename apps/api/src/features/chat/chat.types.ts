export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SendMessageDto {
  projectId: string;
  conversationId: string | null;
  messages: ChatMessage[];
}

export interface StreamChunk {
  delta?: string;
  conversationId?: string;
}
