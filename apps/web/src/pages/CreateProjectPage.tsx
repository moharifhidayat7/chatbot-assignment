import { DashboardLayout } from '@/layouts';
import { CreateProjectForm } from '@/features/projects';
import { Separator } from '@/components/ui/separator';

export function CreateProjectPage() {
  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">New project</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Define your AI agent's name and how it should behave.
          </p>
        </div>
        <Separator />
        <CreateProjectForm />
      </div>
    </DashboardLayout>
  );
}
