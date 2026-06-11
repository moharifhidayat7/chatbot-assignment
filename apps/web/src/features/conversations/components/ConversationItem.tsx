import { Trash2, MessageSquare } from 'lucide-react';
import type { ConversationSummary } from '../types/conversations.types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ConversationItemProps {
  conversation: ConversationSummary;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationItem({ conversation, isActive, onSelect, onDelete }: ConversationItemProps) {
  return (
    <div
      className={cn(
        'group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-accent text-accent-foreground font-medium'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      )}
    >
      <button
        className="flex flex-1 items-center gap-2 text-left min-w-0"
        onClick={() => onSelect(conversation.id)}
      >
        <MessageSquare className="size-3.5 shrink-0 opacity-60" />
        <span className="truncate">{conversation.title || 'New conversation'}</span>
      </button>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(conversation.id);
        }}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}
