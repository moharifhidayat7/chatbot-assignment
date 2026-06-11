import { create } from 'zustand';
import type { Project, CreateProjectPayload, UpdateProjectPayload } from '../types/project.types';
import {
  fetchProjects,
  createProject as createService,
  updateProject as updateService,
  deleteProject as deleteService,
} from '../services/projects.service';

interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
  create: (payload: CreateProjectPayload) => Promise<Project>;
  update: (id: string, payload: UpdateProjectPayload) => Promise<Project>;
  remove: (id: string) => Promise<void>;
}

export const useProjectsStore = create<ProjectsState>()((set) => ({
  projects: [],
  isLoading: false,
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchProjects();
      set({ projects: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load projects' });
    } finally {
      set({ isLoading: false });
    }
  },

  create: async (payload) => {
    const project = await createService(payload);
    set((s) => ({ projects: [project, ...s.projects] }));
    return project;
  },

  update: async (id, payload) => {
    const project = await updateService(id, payload);
    set((s) => ({ projects: s.projects.map((p) => (p.id === id ? project : p)) }));
    return project;
  },

  remove: async (id) => {
    await deleteService(id);
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
  },
}));
