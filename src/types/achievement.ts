export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';

export type AchievementCategory = 'streak' | 'volume' | 'variety' | 'mastery' | 'growth' | 'time' | 'social' | 'hidden';

export interface TierConfig {
  tier: AchievementTier;
  label: string;
  emoji: string;
  color: string;
  borderColor: string;
  bgGradient: string;
  minXP: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  xpReward: number;
  coinReward: number;
  gemReward: number;
  icon: string;
  secret?: boolean;
  requiredCount: number;
  exclusiveItem?: string;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: string | null;
  progress: number;
  isPinned?: boolean;
  isNew?: boolean;
}
