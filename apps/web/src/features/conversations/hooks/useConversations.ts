import { useState, useCallback } from 'react';
import type { ConversationSummary } from '../types/conversations.types';
import { fetchConversations, createConversation, deleteConversation } from '../services/conversations.service';

export function useConversations(projectId: string) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);

  const load = useCallback(async () => {
    const data = await fetchConversations(projectId);
    setConversations(data);
  }, [projectId]);

  const create = useCallback(async (): Promise<ConversationSummary> => {
    const conv = await createConversation(projectId);
    setConversations((prev) => [conv, ...prev]);
    return conv;
  }, [projectId]);

  const remove = useCallback(async (id: string) => {
    await deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { conversations, load, create, remove };
}
