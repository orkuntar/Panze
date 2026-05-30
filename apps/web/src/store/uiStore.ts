import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';
export type Accent = 'blue' | 'violet' | 'emerald' | 'rose' | 'amber';
export type Language = 'tr' | 'en';

interface UiState {
  theme: ThemeMode;
  accent: Accent;
  language: Language;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setAccent: (accent: Accent) => void;
  setLanguage: (language: Language) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'light',
      accent: 'blue',
      language: 'tr',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setAccent: (accent) => set({ accent }),
      setLanguage: (language) => set({ language })
    }),
    { name: 'panze-ui' }
  )
);
