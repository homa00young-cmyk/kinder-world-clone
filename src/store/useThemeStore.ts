import { create } from 'zustand';
import { getThemeById } from '../data/themes';
import type { Theme, ThemeMode } from '../types/theme';
import type { MoodType } from '../types/moods';

const THEME_STORAGE_KEY = 'kinder_world_theme_v1';

export interface ThemeStoreState {
  currentThemeId: string;
  mode: ThemeMode;
  unlockedThemeIds: string[];

  setTheme: (themeId: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  unlockTheme: (themeId: string) => void;
  getEffectiveTheme: (currentMood?: MoodType | null) => Theme;
  applyThemeToDocument: (theme: Theme) => void;
}

function loadInitialThemeState() {
  const defaultState = {
    currentThemeId: 'spring',
    mode: 'system' as ThemeMode,
    unlockedThemeIds: ['spring', 'summer', 'autumn', 'winter', 'night', 'rainbow'],
  };

  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultState, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load theme store', e);
  }

  return defaultState;
}

function persistThemeState(state: unknown) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to persist theme store', e);
  }
}

export const useThemeStore = create<ThemeStoreState>((set, get) => {
  const initial = loadInitialThemeState();

  return {
    ...initial,

    setTheme: (themeId: string) => {
      const theme = getThemeById(themeId);
      set((state) => {
        const newState = { ...state, currentThemeId: themeId };
        persistThemeState(newState);
        return newState;
      });
      get().applyThemeToDocument(theme);
    },

    setThemeMode: (mode: ThemeMode) => {
      set((state) => {
        const newState = { ...state, mode };
        persistThemeState(newState);
        return newState;
      });
      const theme = get().getEffectiveTheme();
      get().applyThemeToDocument(theme);
    },

    unlockTheme: (themeId: string) => {
      set((state) => {
        if (state.unlockedThemeIds.includes(themeId)) return state;
        const nextUnlocked = [...state.unlockedThemeIds, themeId];
        const newState = { ...state, unlockedThemeIds: nextUnlocked };
        persistThemeState(newState);
        return newState;
      });
    },

    getEffectiveTheme: (currentMood?: MoodType | null) => {
      const { currentThemeId, mode } = get();
      const current = getThemeById(currentThemeId);

      if (mode === 'emotion_aware' && currentMood) {
        if (currentMood === 'مضطرب') return getThemeById('ocean');
        if (currentMood === 'عصبانی') return getThemeById('winter');
        if (currentMood === 'خسته') return getThemeById('night');
        if (currentMood === 'سپاسگزار') return getThemeById('blossom');
        if (currentMood === 'آرام') return getThemeById('spring');
      }

      if (mode === 'time_aware') {
        const hour = new Date().getHours();
        if (hour >= 20 || hour < 6) return getThemeById('night');
        if (hour >= 17) return getThemeById('autumn');
      }

      if (mode === 'dark') {
        return current.isDark ? current : getThemeById('night');
      }

      if (mode === 'light') {
        return current.isDark ? getThemeById('spring') : current;
      }

      return current;
    },

    applyThemeToDocument: (theme: Theme) => {
      if (typeof document === 'undefined') return;
      const root = document.documentElement;

      root.style.setProperty('--color-primary', theme.colors.primary);
      root.style.setProperty('--color-primary-light', theme.colors.primaryLight);
      root.style.setProperty('--color-primary-dark', theme.colors.primaryDark);
      root.style.setProperty('--color-secondary', theme.colors.secondary);
      root.style.setProperty('--color-accent', theme.colors.accent);
      root.style.setProperty('--color-bg', theme.colors.background);
      root.style.setProperty('--color-surface', theme.colors.surface);
      root.style.setProperty('--color-text', theme.colors.text);
      root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
      root.style.setProperty('--color-border', theme.colors.border);

      if (theme.isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    },
  };
});
