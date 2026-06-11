import { Link } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  projectName: string;
  projectId: string;
}

export function ChatHeader({ projectName, projectId }: ChatHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <span className="font-medium truncate">{projectName}</span>
      </div>
      <Button variant="ghost" size="icon-sm" asChild>
        <Link to={`/projects/${projectId}/settings`}>
          <Settings className="size-4" />
        </Link>
      </Button>
    </header>
  );
}
