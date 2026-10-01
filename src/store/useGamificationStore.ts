import { create } from 'zustand';

const GAMIFICATION_STORAGE_KEY = 'kinder_world_gamification_v1';

export interface GamificationState {
  coins: number;
  gems: number;
  level: number;
  prestigeLevel: number;
  currentStreak: number;
  bestStreak: number;
  streakFrozen: boolean;
  streakFreezeCount: number;
  lastActiveDate: string | null;

  addCoins: (amount: number) => void;
  deductCoins: (amount: number) => boolean;
  addGems: (amount: number) => void;
  deductGems: (amount: number) => boolean;
  checkAndLevelUp: (totalXP: number) => { leveledUp: boolean; newLevel: number; rewards?: { coins: number; gems: number } };
  updateStreak: () => { streakUpdated: boolean; newStreak: number; bonusCoins: number };
  useStreakFreeze: () => boolean;
  buyStreakFreeze: () => boolean;
  activatePrestige: () => void;
}

function calculateLevelFromXP(xp: number): number {
  let level = 1;
  while (level < 100) {
    const requiredForNext = Math.floor(100 * Math.pow(level + 1, 1.5));
    if (xp >= requiredForNext) {
      level++;
    } else {
      break;
    }
  }
  return level;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

function calculateDaysDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function loadInitialGamificationState() {
  const today = getTodayString();
  const defaultState = {
    coins: 250,
    gems: 20,
    level: 1,
    prestigeLevel: 0,
    currentStreak: 1,
    bestStreak: 1,
    streakFrozen: false,
    streakFreezeCount: 1,
    lastActiveDate: today,
  };

  try {
    const saved = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultState, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load gamification state', e);
  }

  return defaultState;
}

function persistGamificationState(state: unknown) {
  try {
    localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to persist gamification state', e);
  }
}

export const useGamificationStore = create<GamificationState>((set, get) => {
  const initial = loadInitialGamificationState();

  return {
    ...initial,

    addCoins: (amount: number) => {
      set((state) => {
        const newState = { ...state, coins: state.coins + amount };
        persistGamificationState(newState);
        return newState;
      });
    },

    deductCoins: (amount: number) => {
      const { coins } = get();
      if (coins < amount) return false;
      set((state) => {
        const newState = { ...state, coins: state.coins - amount };
        persistGamificationState(newState);
        return newState;
      });
      return true;
    },

    addGems: (amount: number) => {
      set((state) => {
        const newState = { ...state, gems: state.gems + amount };
        persistGamificationState(newState);
        return newState;
      });
    },

    deductGems: (amount: number) => {
      const { gems } = get();
      if (gems < amount) return false;
      set((state) => {
        const newState = { ...state, gems: state.gems - amount };
        persistGamificationState(newState);
        return newState;
      });
      return true;
    },

    checkAndLevelUp: (totalXP: number) => {
      const { level } = get();
      const calculated = calculateLevelFromXP(totalXP);

      if (calculated > level) {
        const levelDiff = calculated - level;
        const rewardCoins = levelDiff * 100;
        const rewardGems = levelDiff * 10;

        set((state) => {
          const newState = {
            ...state,
            level: calculated,
            coins: state.coins + rewardCoins,
            gems: state.gems + rewardGems,
          };
          persistGamificationState(newState);
          return newState;
        });

        return {
          leveledUp: true,
          newLevel: calculated,
          rewards: { coins: rewardCoins, gems: rewardGems },
        };
      }

      return { leveledUp: false, newLevel: level };
    },

    updateStreak: () => {
      const today = getTodayString();
      const { lastActiveDate, currentStreak, bestStreak, streakFrozen, streakFreezeCount } = get();

      if (lastActiveDate === today) {
        return { streakUpdated: false, newStreak: currentStreak, bonusCoins: 0 };
      }

      let newStreak = currentStreak;
      let bonusCoins = 0;
      let freezeUsed = false;

      if (lastActiveDate) {
        const daysDiff = calculateDaysDifference(lastActiveDate, today);

        if (daysDiff === 1) {
          newStreak += 1;
        } else if (daysDiff > 1) {
          if (streakFrozen || streakFreezeCount > 0) {
            freezeUsed = true;
          } else {
            newStreak = 1;
          }
        }
      } else {
        newStreak = 1;
      }

      if (newStreak === 7) bonusCoins = 50;
      else if (newStreak === 14) bonusCoins = 100;
      else if (newStreak === 30) bonusCoins = 250;
      else if (newStreak === 60) bonusCoins = 500;
      else if (newStreak === 100) bonusCoins = 1000;

      const newBest = Math.max(bestStreak, newStreak);

      set((state) => {
        const newState = {
          ...state,
          currentStreak: newStreak,
          bestStreak: newBest,
          coins: state.coins + bonusCoins + 10,
          lastActiveDate: today,
          streakFrozen: false,
          streakFreezeCount: freezeUsed ? Math.max(0, state.streakFreezeCount - 1) : state.streakFreezeCount,
        };
        persistGamificationState(newState);
        return newState;
      });

      return { streakUpdated: true, newStreak, bonusCoins };
    },

    useStreakFreeze: () => {
      const { streakFreezeCount } = get();
      if (streakFreezeCount <= 0) return false;

      set((state) => {
        const newState = {
          ...state,
          streakFrozen: true,
          streakFreezeCount: state.streakFreezeCount - 1,
        };
        persistGamificationState(newState);
        return newState;
      });
      return true;
    },

    buyStreakFreeze: () => {
      const { coins } = get();
      if (coins < 200) return false;

      set((state) => {
        const newState = {
          ...state,
          coins: state.coins - 200,
          streakFreezeCount: state.streakFreezeCount + 1,
        };
        persistGamificationState(newState);
        return newState;
      });
      return true;
    },

    activatePrestige: () => {
      const { level, prestigeLevel } = get();
      if (level < 100) return;

      set((state) => {
        const newState = {
          ...state,
          level: 1,
          prestigeLevel: prestigeLevel + 1,
          coins: state.coins + 5000,
          gems: state.gems + 200,
        };
        persistGamificationState(newState);
        return newState;
      });
    },
  };
});
