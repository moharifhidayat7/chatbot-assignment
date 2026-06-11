import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings, Theme } from '../types/settings.types';

interface SettingsState {
  settings: UserSettings;
  setTheme: (theme: Theme) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: { theme: 'system' },
      setTheme: (theme) => set((s) => ({ settings: { ...s.settings, theme } })),
    }),
    { name: 'user-settings' },
  ),
);
