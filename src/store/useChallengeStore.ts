import { create } from 'zustand';
import { DAILY_CHALLENGES, WEEKLY_CHALLENGES, MONTHLY_CHALLENGES } from '../data/challenges';
import type { UserChallengeState } from '../types/challenge';

const CHALLENGE_STORAGE_KEY = 'kinder_world_challenges_v1';

export interface ChallengeStoreState {
  userChallenges: Record<string, UserChallengeState>;

  updateChallengeProgress: (conditionType: string, count?: number) => void;
  claimChallengeReward: (challengeId: string) => { claimed: boolean; rewardCoins: number; rewardXP: number; rewardGems: number };
  getChallengeState: (challengeId: string) => UserChallengeState;
}

function loadInitialChallenges(): Record<string, UserChallengeState> {
  const allChallenges = [...DAILY_CHALLENGES, ...WEEKLY_CHALLENGES, ...MONTHLY_CHALLENGES];
  const initialMap: Record<string, UserChallengeState> = {};
  const today = new Date().toISOString().split('T')[0];

  allChallenges.forEach((c) => {
    initialMap[c.id] = {
      challengeId: c.id,
      progress: 0,
      completed: false,
      claimed: false,
      updatedAt: today,
    };
  });

  try {
    const saved = localStorage.getItem(CHALLENGE_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...initialMap, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load challenges state', e);
  }

  return initialMap;
}

function persistChallenges(challenges: Record<string, UserChallengeState>) {
  try {
    localStorage.setItem(CHALLENGE_STORAGE_KEY, JSON.stringify(challenges));
  } catch (e) {
    console.error('Failed to persist challenges state', e);
  }
}

export const useChallengeStore = create<ChallengeStoreState>((set, get) => {
  const initial = loadInitialChallenges();

  return {
    userChallenges: initial,

    getChallengeState: (challengeId: string) => {
      const { userChallenges } = get();
      return (
        userChallenges[challengeId] || {
          challengeId,
          progress: 0,
          completed: false,
          claimed: false,
          updatedAt: new Date().toISOString().split('T')[0],
        }
      );
    },

    updateChallengeProgress: (conditionType: string, increment: number = 1) => {
      const allChallenges = [...DAILY_CHALLENGES, ...WEEKLY_CHALLENGES, ...MONTHLY_CHALLENGES];
      const { userChallenges } = get();
      const updatedMap = { ...userChallenges };
      const today = new Date().toISOString().split('T')[0];

      allChallenges.forEach((c) => {
        if (c.conditionType === conditionType) {
          const current = updatedMap[c.id] || {
            challengeId: c.id,
            progress: 0,
            completed: false,
            claimed: false,
            updatedAt: today,
          };

          if (!current.claimed) {
            const nextProgress = current.progress + increment;
            const completed = nextProgress >= c.requiredCount;

            updatedMap[c.id] = {
              ...current,
              progress: nextProgress,
              completed,
              updatedAt: today,
            };
          }
        }
      });

      set({ userChallenges: updatedMap });
      persistChallenges(updatedMap);
    },

    claimChallengeReward: (challengeId: string) => {
      const allChallenges = [...DAILY_CHALLENGES, ...WEEKLY_CHALLENGES, ...MONTHLY_CHALLENGES];
      const challenge = allChallenges.find((c) => c.id === challengeId);
      const { userChallenges } = get();
      const userState = userChallenges[challengeId];

      if (!challenge || !userState || !userState.completed || userState.claimed) {
        return { claimed: false, rewardCoins: 0, rewardXP: 0, rewardGems: 0 };
      }

      const updatedState: UserChallengeState = {
        ...userState,
        claimed: true,
      };

      const nextMap = { ...userChallenges, [challengeId]: updatedState };
      set({ userChallenges: nextMap });
      persistChallenges(nextMap);

      return {
        claimed: true,
        rewardCoins: challenge.reward.coins || 0,
        rewardXP: challenge.reward.xp || 0,
        rewardGems: challenge.reward.gems || 0,
      };
    },
  };
});
