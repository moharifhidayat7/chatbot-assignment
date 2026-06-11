export interface Project {
  id: string;
  userId: string;
  name: string;
  systemPrompt: string;
  scopeEnforced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  systemPrompt: string;
  scopeEnforced?: boolean;
}

export interface UpdateProjectDto {
  name?: string;
  systemPrompt?: string;
  scopeEnforced?: boolean;
}
