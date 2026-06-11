import { apiClient } from '@/services';
import type { ConversationSummary } from '../types/conversations.types';

export function fetchConversations(projectId: string): Promise<ConversationSummary[]> {
  return apiClient<ConversationSummary[]>(`/projects/${projectId}/conversations`);
}

export function createConversation(projectId: string): Promise<ConversationSummary> {
  return apiClient<ConversationSummary>(`/projects/${projectId}/conversations`, {
    method: 'POST',
  });
}

export function deleteConversation(id: string): Promise<void> {
  return apiClient<void>(`/conversations/${id}`, { method: 'DELETE' });
}
