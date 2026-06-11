import { apiClient } from '@/services';
import type { Project, CreateProjectPayload, UpdateProjectPayload } from '../types/project.types';

export function fetchProjects(): Promise<Project[]> {
  return apiClient<Project[]>('/projects');
}

export function fetchProject(id: string): Promise<Project> {
  return apiClient<Project>(`/projects/${id}`);
}

export function createProject(payload: CreateProjectPayload): Promise<Project> {
  return apiClient<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateProject(id: string, payload: UpdateProjectPayload): Promise<Project> {
  return apiClient<Project>(`/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteProject(id: string): Promise<void> {
  return apiClient<void>(`/projects/${id}`, { method: 'DELETE' });
}
