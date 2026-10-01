import type { MoodType } from './moods';

export type ExerciseTier = 'quick' | 'standard' | 'deep' | 'long' | 'sleep';

export interface DurationTierConfig {
  id: ExerciseTier;
  label: string; // Persian label
  emoji: string;
  durationSeconds: number;
  xpReward: number;
  description: string;
}

export interface BreathingPattern {
  inhale: number; // seconds
  holdIn?: number; // seconds
  exhale: number; // seconds
  holdOut?: number; // seconds
}

export interface ExerciseItem {
  id: string;
  emotion: MoodType;
  title: string;
  description: string;
  tier: ExerciseTier;
  durationSeconds: number;
  xpReward: number;
  instructions: string[];
  breathingPattern?: BreathingPattern;
}
