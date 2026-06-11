import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/layouts';
import { ChatWindow, ChatHeader } from '@/features/chat';
import { ConversationList, useConversations } from '@/features/conversations';
import { fetchProject } from '@/features/projects/services/projects.service';
import type { Project } from '@/features/projects';

export function ChatPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  // Stable key for "new conversation" slots — a new UUID is generated each time the user
  // starts a fresh chat, so each new-chat slot gets its own session in the store.
  const [newChatKey, setNewChatKey] = useState(() => crypto.randomUUID());

  const sessionKey = activeConversationId ?? newChatKey;

  const { conversations, load: loadConversations, remove: removeConversation } = useConversations(projectId!);

  useEffect(() => {
    if (!projectId) return;
    fetchProject(projectId)
      .then(setProject)
      .catch(() => navigate('/dashboard'));
    loadConversations();
  }, [projectId, navigate, loadConversations]);

  const handleConversationCreated = useCallback((id: string) => {
    setActiveConversationId(id);
    loadConversations();
  }, [loadConversations]);

  function handleNewConversation() {
    setActiveConversationId(null);
    setNewChatKey(crypto.randomUUID());
  }

  function handleSelectConversation(id: string) {
    setActiveConversationId(id);
  }

  const handleDeleteConversation = useCallback(async (id: string) => {
    await removeConversation(id);
    if (activeConversationId === id) {
      setActiveConversationId(null);
      setNewChatKey(crypto.randomUUID());
    }
  }, [removeConversation, activeConversationId]);

  if (!projectId) return null;

  return (
    <AppLayout
      sidebar={
        <ConversationList
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={handleSelectConversation}
          onNew={handleNewConversation}
          onDelete={handleDeleteConversation}
        />
      }
    >
      <ChatHeader
        projectName={project?.name ?? '…'}
        projectId={projectId}
      />
      <ChatWindow
        sessionKey={sessionKey}
        projectId={projectId}
        conversationId={activeConversationId}
        onConversationCreated={handleConversationCreated}
      />
    </AppLayout>
  );
}
