export type ChallengeType = 'daily' | 'weekly' | 'monthly';

export interface ChallengeReward {
  xp: number;
  coins: number;
  gems?: number;
  luckyBoxType?: 'bronze' | 'silver' | 'gold';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  requiredCount: number;
  reward: ChallengeReward;
  icon: string;
  conditionType: 'exercises_count' | 'anxious_count' | 'quick_count' | 'deep_count' | 'gratitude_count' | 'sleep_count' | 'streak_days' | 'species_count' | 'emotions_count';
}

export interface UserChallengeState {
  challengeId: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
  updatedAt: string;
}
