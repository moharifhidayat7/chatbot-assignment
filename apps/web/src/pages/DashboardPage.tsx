import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '@/layouts';
import { useProjects, ProjectCard, EmptyProjects } from '@/features/projects';
import { Button } from '@/components/ui/button';

export function DashboardPage() {
  const navigate = useNavigate();
  const { projects, isLoading, error, load } = useProjects();

  useEffect(() => { load(); }, [load]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Your projects</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Each project is an AI agent with its own personality.
            </p>
          </div>
          <Button onClick={() => navigate('/projects/new')} className="gap-1.5">
            <Plus className="size-4" />
            New project
          </Button>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl border bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {!isLoading && !error && projects.length === 0 && <EmptyProjects />}

        {!isLoading && projects.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
