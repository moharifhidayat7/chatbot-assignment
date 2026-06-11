import { Plus } from 'lucide-react';
import type { ConversationSummary } from '../types/conversations.types';
import { ConversationItem } from './ConversationItem';
import { Button } from '@/components/ui/button';

interface ConversationListProps {
  conversations: ConversationSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export function ConversationList({ conversations, activeId, onSelect, onNew, onDelete }: ConversationListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={onNew}>
          <Plus className="size-3.5" />
          New conversation
        </Button>
      </div>
      <nav className="flex flex-col gap-0.5 overflow-y-auto p-2 flex-1">
        {conversations.map((c) => (
          <ConversationItem
            key={c.id}
            conversation={c}
            isActive={activeId === c.id}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
        {conversations.length === 0 && (
          <p className="px-3 py-4 text-xs text-muted-foreground text-center">
            No conversations yet
          </p>
        )}
      </nav>
    </div>
  );
}
