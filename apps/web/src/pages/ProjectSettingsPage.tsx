import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '@/layouts';
import { ProjectSettingsForm } from '@/features/projects';
import { fetchProject } from '@/features/projects/services/projects.service';
import type { Project } from '@/features/projects';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function ProjectSettingsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    fetchProject(projectId)
      .then(setProject)
      .catch(() => navigate('/dashboard'))
      .finally(() => setIsLoading(false));
  }, [projectId, navigate]);

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link to={`/projects/${projectId}`}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Project settings</h1>
            {project && (
              <p className="text-sm text-muted-foreground">{project.name}</p>
            )}
          </div>
        </div>
        <Separator />
        {isLoading && (
          <div className="flex flex-col gap-4">
            <div className="h-10 rounded-lg bg-muted animate-pulse" />
            <div className="h-32 rounded-lg bg-muted animate-pulse" />
          </div>
        )}
        {project && <ProjectSettingsForm project={project} />}
      </div>
    </DashboardLayout>
  );
}
