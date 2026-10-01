import type { MoodType } from './moods';

export interface MoodLog {
  id: string;
  date: string;
  timestamp: string;
  mood: MoodType;
  secondaryMood?: MoodType;
  exerciseId?: string;
  exerciseTitle?: string;
  durationSeconds?: number;
  xpGained: number;
  notes?: string;
}

export interface WellnessScorePoint {
  date: string;
  jalaliDate: string;
  score: number;
  movingAverage: number;
  baseline: number;
  mood: MoodType;
  exercisesCount: number;
  xp: number;
  notes?: string;
  achievementsUnlocked?: string[];
  isMilestone?: boolean;
}

export interface ExerciseTypeBreakdown {
  exerciseId: string;
  title: string;
  count: number;
  durationTier: string;
}

export interface EmotionDistributionPoint {
  emotion: MoodType;
  count: number;
  percentage: number;
  color: string;
  exercises: ExerciseTypeBreakdown[];
}

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';

export interface HeatmapSlot {
  dayOfWeek: number;
  dayName: string;
  timeSlot: TimeSlot;
  timeSlotLabel: string;
  count: number;
  exercises: string[];
}

export interface XPGrowthPoint {
  date: string;
  jalaliDate: string;
  cumulativeXP: number;
  dailyXP: number;
  levelUp?: number;
  milestoneName?: string;
  forecastXP?: number;
}

export interface RadarCategoryPoint {
  category: 'breathing' | 'writing' | 'meditation' | 'body' | 'compassion' | 'gratitude';
  categoryFa: string;
  currentMonth: number;
  previousMonth: number;
}

export interface StreakDayPoint {
  date: string;
  intensity: 0 | 1 | 2 | 3 | 4;
  count: number;
  xp: number;
  mood?: MoodType;
}

export type InsightType = 'pattern' | 'progress' | 'behavioral' | 'predictive' | 'recommendation';

export interface PersonalInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  icon: string;
  metric?: string;
  shareableText: string;
}
