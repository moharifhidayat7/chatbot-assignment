import { useProjectsStore } from '../stores/projects.store';

export function useProjects() {
  return useProjectsStore();
}
