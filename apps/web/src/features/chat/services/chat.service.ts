import { apiClient, apiStream } from '@/services';
import type { Message, SendPayload } from '../types/chat.types';

export interface HistoryMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export function fetchHistory(conversationId: string): Promise<HistoryMessage[]> {
  return apiClient<HistoryMessage[]>(`/conversations/${conversationId}/messages`);
}

export async function streamChat(
  payload: SendPayload,
  onDelta: (delta: string, conversationId: string) => void,
  onDone: (conversationId: string) => void,
): Promise<void> {
  const response = await apiStream('/chat', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let conversationId = payload.conversationId ?? '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') {
        onDone(conversationId);
        return;
      }
      try {
        const parsed = JSON.parse(data) as { delta?: string; conversationId?: string };
        if (parsed.conversationId) conversationId = parsed.conversationId;
        if (parsed.delta) onDelta(parsed.delta, conversationId);
      } catch {
        // malformed chunk — skip
      }
    }
  }

  onDone(conversationId);
}

export function historyToMessages(raw: HistoryMessage[]): Message[] {
  return raw.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    createdAt: new Date(m.createdAt),
  }));
}
