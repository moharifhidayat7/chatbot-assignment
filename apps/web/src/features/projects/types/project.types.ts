export interface Project {
  id: string;
  name: string;
  systemPrompt: string;
  scopeEnforced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  systemPrompt: string;
  scopeEnforced?: boolean;
}

export interface UpdateProjectPayload {
  name?: string;
  systemPrompt?: string;
  scopeEnforced?: boolean;
}
