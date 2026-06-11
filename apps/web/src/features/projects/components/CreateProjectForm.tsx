import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { createProject } from '../services/projects.service';

export function CreateProjectForm() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [scopeEnforced, setScopeEnforced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const project = await createProject({ name, systemPrompt, scopeEnforced });
      navigate(`/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Agent name</Label>
        <Input
          id="name"
          placeholder="e.g. Travel Planner"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="systemPrompt">System prompt</Label>
        <Textarea
          id="systemPrompt"
          placeholder="e.g. You are a travel planning assistant. Help users plan trips by suggesting itineraries, hotels, and activities."
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={6}
          required
        />
        <p className="text-xs text-muted-foreground">
          Describes how the agent should behave and what it knows.
        </p>
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
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Creating…' : 'Create agent'}
        </Button>
      </div>
    </form>
  );
}
