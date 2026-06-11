import { useCallback, useEffect } from 'react';
import type { Message } from '../types/chat.types';
import { streamChat, fetchHistory, historyToMessages } from '../services/chat.service';
import { useChatSessionStore, defaultSession, type ChatSession } from '../stores/chatSessionStore';

const EMPTY_SESSION: ChatSession = defaultSession();

interface UseChatOptions {
  sessionKey: string;
  projectId: string;
  initialConversationId?: string | null;
  onConversationCreated?: (id: string) => void;
}

export function useChat({
  sessionKey,
  projectId,
  initialConversationId,
  onConversationCreated,
}: UseChatOptions) {
  const session = useChatSessionStore((s) => s.sessions[sessionKey] ?? EMPTY_SESSION);
  const update = useChatSessionStore((s) => s.update);

  // Load history when switching to an existing conversation with an empty session
  useEffect(() => {
    if (!initialConversationId) return;
    const current = useChatSessionStore.getState().sessions[sessionKey] ?? defaultSession();
    if (current.messages.length > 0 || current.status !== 'idle') return;

    update(sessionKey, (prev) => ({
      ...prev,
      status: 'loading',
      conversationId: initialConversationId,
    }));

    fetchHistory(initialConversationId)
      .then((raw) => {
        update(sessionKey, (prev) => ({
          ...prev,
          messages: historyToMessages(raw),
          status: 'idle',
        }));
      })
      .catch(() => {
        update(sessionKey, (prev) => ({ ...prev, status: 'idle' }));
      });
  }, [sessionKey, initialConversationId, update]);

  const send = useCallback(
    async (content: string) => {
      const current = useChatSessionStore.getState().sessions[sessionKey] ?? defaultSession();

      const userMsgId = crypto.randomUUID();
      const assistantId = crypto.randomUUID();
      const userMsg: Message = {
        id: userMsgId,
        role: 'user',
        content,
        createdAt: new Date(),
      };

      update(sessionKey, (prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          userMsg,
          { id: assistantId, role: 'assistant', content: '', createdAt: new Date() },
        ],
        status: 'streaming',
        lastUserMsgId: userMsgId,
        lastUserContent: content,
        assistantMsgId: assistantId,
      }));

      try {
        await streamChat(
          {
            projectId,
            conversationId: current.conversationId,
            messages: [...current.messages, userMsg].map(({ role, content: c }) => ({
              role,
              content: c,
            })),
          },
          (delta) => {
            update(sessionKey, (prev) => ({
              ...prev,
              messages: prev.messages.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + delta } : m,
              ),
            }));
          },
          (finalConvId) => {
            update(sessionKey, (prev) => ({
              ...prev,
              status: 'idle',
              conversationId: finalConvId || prev.conversationId,
            }));
            if (finalConvId && finalConvId !== current.conversationId) {
              onConversationCreated?.(finalConvId);
            }
          },
        );
      } catch {
        update(sessionKey, (prev) => ({
          ...prev,
          status: 'error',
          messages: prev.messages.map((m) =>
            m.id === assistantId
              ? { ...m, content: 'Something went wrong. Please try again.' }
              : m,
          ),
        }));
      }
    },
    [sessionKey, projectId, onConversationCreated, update],
  );

  const retry = useCallback(() => {
    const s = useChatSessionStore.getState().sessions[sessionKey] ?? defaultSession();
    if (!s.lastUserContent) return;
    update(sessionKey, (prev) => ({
      ...prev,
      status: 'idle',
      messages: prev.messages.filter(
        (m) => m.id !== prev.assistantMsgId && m.id !== prev.lastUserMsgId,
      ),
    }));
    send(s.lastUserContent);
  }, [sessionKey, send, update]);

  return {
    messages: session.messages,
    status: session.status,
    conversationId: session.conversationId,
    send,
    retry,
  };
}
