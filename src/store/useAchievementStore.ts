import { create } from 'zustand';
import { ACHIEVEMENTS } from '../data/achievements';
import type { Achievement, UserAchievement } from '../types/achievement';

const ACHIEVEMENT_STORAGE_KEY = 'kinder_world_achievements_v1';

export interface AchievementStoreState {
  userAchievements: Record<string, UserAchievement>;
  recentlyUnlocked: Achievement | null;

  unlockAchievement: (achievementId: string) => { unlocked: boolean; achievement: Achievement | null };
  updateProgress: (achievementId: string, progress: number) => { unlocked: boolean; achievement: Achievement | null };
  togglePin: (achievementId: string) => void;
  clearRecentlyUnlocked: () => void;
  getAchievementProgress: (achievementId: string) => { current: number; required: number; unlocked: boolean };
}

function loadInitialAchievements(): Record<string, UserAchievement> {
  const initial: Record<string, UserAchievement> = {};

  ACHIEVEMENTS.forEach((a) => {
    initial[a.id] = {
      achievementId: a.id,
      unlockedAt: null,
      progress: 0,
      isPinned: false,
      isNew: false,
    };
  });

  initial['streak-1'] = {
    achievementId: 'streak-1',
    unlockedAt: new Date().toISOString(),
    progress: 1,
    isPinned: false,
    isNew: false,
  };
  initial['growth-stage-1'] = {
    achievementId: 'growth-stage-1',
    unlockedAt: new Date().toISOString(),
    progress: 1,
    isPinned: false,
    isNew: false,
  };

  try {
    const saved = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...initial, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load user achievements', e);
  }

  return initial;
}

function persistAchievements(achievements: Record<string, UserAchievement>) {
  try {
    localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(achievements));
  } catch (e) {
    console.error('Failed to persist user achievements', e);
  }
}

export const useAchievementStore = create<AchievementStoreState>((set, get) => {
  const initial = loadInitialAchievements();

  return {
    userAchievements: initial,
    recentlyUnlocked: null,

    unlockAchievement: (achievementId: string) => {
      const { userAchievements } = get();
      const userAch = userAchievements[achievementId];
      const achConfig = ACHIEVEMENTS.find((a) => a.id === achievementId);

      if (!achConfig || (userAch && userAch.unlockedAt)) {
        return { unlocked: false, achievement: null };
      }

      const updatedUserAch: UserAchievement = {
        achievementId,
        unlockedAt: new Date().toISOString(),
        progress: achConfig.requiredCount,
        isPinned: userAch?.isPinned || false,
        isNew: true,
      };

      set((state) => {
        const nextMap = { ...state.userAchievements, [achievementId]: updatedUserAch };
        persistAchievements(nextMap);
        return { userAchievements: nextMap, recentlyUnlocked: achConfig };
      });

      return { unlocked: true, achievement: achConfig };
    },

    updateProgress: (achievementId: string, newProgress: number) => {
      const { userAchievements } = get();
      const userAch = userAchievements[achievementId];
      const achConfig = ACHIEVEMENTS.find((a) => a.id === achievementId);

      if (!achConfig) return { unlocked: false, achievement: null };

      if (userAch?.unlockedAt) {
        return { unlocked: false, achievement: null };
      }

      const currentProg = Math.min(achConfig.requiredCount, newProgress);

      if (userAch && userAch.progress === currentProg) {
        return { unlocked: false, achievement: null };
      }

      if (currentProg >= achConfig.requiredCount) {
        return get().unlockAchievement(achievementId);
      }

      set((state) => {
        const nextMap = {
          ...state.userAchievements,
          [achievementId]: {
            achievementId,
            unlockedAt: null,
            progress: currentProg,
            isPinned: userAch?.isPinned || false,
            isNew: false,
          },
        };
        persistAchievements(nextMap);
        return { userAchievements: nextMap };
      });

      return { unlocked: false, achievement: null };
    },

    togglePin: (achievementId: string) => {
      set((state) => {
        const userAch = state.userAchievements[achievementId];
        if (!userAch) return state;

        const nextMap = {
          ...state.userAchievements,
          [achievementId]: { ...userAch, isPinned: !userAch.isPinned },
        };
        persistAchievements(nextMap);
        return { userAchievements: nextMap };
      });
    },

    clearRecentlyUnlocked: () => {
      set({ recentlyUnlocked: null });
    },

    getAchievementProgress: (achievementId: string) => {
      const { userAchievements } = get();
      const achConfig = ACHIEVEMENTS.find((a) => a.id === achievementId);
      const userAch = userAchievements[achievementId];

      const required = achConfig?.requiredCount || 1;
      const current = userAch?.progress || 0;
      const unlocked = !!userAch?.unlockedAt;

      return { current, required, unlocked };
    },
  };
});
