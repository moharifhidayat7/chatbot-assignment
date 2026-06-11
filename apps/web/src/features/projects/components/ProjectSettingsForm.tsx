import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../types/project.types';
import { updateProject, deleteProject } from '../services/projects.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ProjectSettingsFormProps {
  project: Project;
}

export function ProjectSettingsForm({ project }: ProjectSettingsFormProps) {
  const navigate = useNavigate();
  const [name, setName] = useState(project.name);
  const [systemPrompt, setSystemPrompt] = useState(project.systemPrompt);
  const [scopeEnforced, setScopeEnforced] = useState(project.scopeEnforced ?? false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSaved(false);
    setIsSaving(true);
    try {
      await updateProject(project.id, { name, systemPrompt, scopeEnforced });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteProject(project.id);
      navigate('/dashboard');
    } catch {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Agent name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="systemPrompt">System prompt</Label>
          <Textarea
            id="systemPrompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={8}
            required
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="scopeEnforced" className="text-sm font-medium">Enforce scope</Label>
            <p className="text-xs text-muted-foreground">
              When on, the agent will decline questions outside its defined purpose.
            </p>
          </div>
          <Switch
            id="scopeEnforced"
            checked={scopeEnforced}
            onCheckedChange={setScopeEnforced}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {saved && <p className="text-sm text-green-600">Changes saved.</p>}
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </form>

      <Separator />

      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-destructive">Danger zone</p>
        <p className="text-sm text-muted-foreground">
          Deleting a project removes all its conversations permanently.
        </p>
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-fit">
              Delete project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete "{project.name}"?</DialogTitle>
              <DialogDescription>
                All conversations for this agent will be permanently deleted. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
