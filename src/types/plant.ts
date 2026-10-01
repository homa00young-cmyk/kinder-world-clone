export type WeatherType = 'sunny' | 'rainy' | 'snowy' | 'windy';
export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter';

export interface PlantStageConfig {
  stage: number; // 1 to 12
  emoji: string;
  label: string; // Persian label
  description: string;
  requiredXP: number; // XP needed to unlock/reach this stage
}

export interface PlantSpeciesConfig {
  id: string;
  name: string; // Persian name
  title: string; // Persian mechanic description (e.g. "مقاوم")
  emoji: string;
  description: string;
  bonusText: string;
  unlockLevel: number; // User or plant level required to unlock
  mechanic: {
    type: 'hard_day_bonus' | 'grateful_day_bonus' | 'anxious_day_bonus' | 'streak_protection' | 'new_exercise_bonus' | 'lucky_drop';
    multiplier: number;
  };
}

export interface PlantStateData {
  speciesId: string;
  totalXP: number;
  currentStage: number; // 1 to 12
  completedExercisesCount: number;
  health: number; // 20 to 100%
  lastWateredDate: string | null; // ISO YYYY-MM-DD
  lastActiveDate: string | null; // ISO YYYY-MM-DD
  completedExerciseIds: string[];
}
