import { create } from 'zustand';
import type { User, LoginPayload, RegisterPayload } from '@/features/auth/types/auth.types';
import { login as loginService, register as registerService, logoutFromServer } from '@/features/auth/services/auth.service';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: (() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  })(),
  isLoading: false,

  login: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await loginService(payload);
      localStorage.setItem(TOKEN_KEY, res.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      set({ user: res.user });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await registerService(payload);
      localStorage.setItem(TOKEN_KEY, res.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      set({ user: res.user });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) logoutFromServer(refreshToken).catch(() => {});
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null });
  },
}));
