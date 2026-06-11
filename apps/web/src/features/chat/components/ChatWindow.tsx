import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from '@/components/ai-elements/prompt-input';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';
import { RefreshCw } from 'lucide-react';
import { useChat } from '../hooks/useChat';

const SUGGESTIONS = [
  'Tell me about yourself',
  'What can you help me with?',
  'Summarize your capabilities',
];

interface ChatWindowProps {
  sessionKey: string;
  projectId: string;
  conversationId: string | null;
  onConversationCreated: (id: string) => void;
}

export function ChatWindow({ sessionKey, projectId, conversationId, onConversationCreated }: ChatWindowProps) {
  const { messages, status, send, retry } = useChat({
    sessionKey,
    projectId,
    initialConversationId: conversationId,
    onConversationCreated,
  });

  const isEmpty = messages.length === 0;

  function handleSubmit({ text }: { text: string }) {
    const trimmed = text.trim();
    if (!trimmed || status === 'streaming' || status === 'loading') return;
    send(trimmed);
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Conversation className="flex-1">
        <ConversationContent>
          {isEmpty ? (
            <ConversationEmptyState
              title="Start a conversation"
              description="Type a message below or pick a suggestion to begin."
            />
          ) : (
            messages.map((msg, i) => {
              const isFailedMessage =
                status === 'error' && i === messages.length - 1 && msg.role === 'assistant';
              return (
                <Message key={msg.id} from={msg.role}>
                  <MessageContent>
                    {msg.content ? (
                      <MessageResponse>{msg.content}</MessageResponse>
                    ) : (
                      <span className="animate-pulse text-muted-foreground">●&nbsp;●&nbsp;●</span>
                    )}
                  </MessageContent>
                  {isFailedMessage && (
                    <MessageActions>
                      <MessageAction
                        tooltip="Retry"
                        onClick={retry}
                        className="text-destructive hover:text-destructive"
                      >
                        <RefreshCw className="size-3.5" />
                      </MessageAction>
                    </MessageActions>
                  )}
                </Message>
              );
            })
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="shrink-0 border-t p-3 space-y-2">
        {isEmpty && (
          <Suggestions>
            {SUGGESTIONS.map((s) => (
              <Suggestion key={s} suggestion={s} onClick={send} />
            ))}
          </Suggestions>
        )}
        <PromptInput key={sessionKey} onSubmit={handleSubmit}>
          <PromptInputTextarea
            placeholder="Message the agent…  (Shift+Enter for new line)"
            disabled={status === 'streaming' || status === 'loading'}
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit
              status={status === 'streaming' ? 'streaming' : status === 'loading' ? 'submitted' : 'ready'}
              disabled={status === 'streaming' || status === 'loading'}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
