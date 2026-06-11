import { useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyProjects() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <Bot className="size-8 text-muted-foreground" />
      </div>
      <div>
        <p className="font-semibold text-lg">No projects yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first AI agent to get started.
        </p>
      </div>
      <Button onClick={() => navigate('/projects/new')}>Create project</Button>
    </div>
  );
}
