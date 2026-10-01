import { describe, it, expect } from 'vitest';
import { EXERCISES, getExercisesByEmotion, getExerciseById, EXERCISE_TIERS } from '../data/exercises';
import type { MoodType } from '../types/moods';

describe('Exercises Library', () => {
  it('contains at least 40 total exercises', () => {
    expect(EXERCISES.length).toBeGreaterThanOrEqual(40);
  });

  it('contains at least 8 exercises for each of the 5 emotions', () => {
    const emotions: MoodType[] = ['آرام', 'خسته', 'مضطرب', 'سپاسگزار', 'عصبانی'];
    emotions.forEach((emotion) => {
      const list = getExercisesByEmotion(emotion);
      expect(list.length).toBeGreaterThanOrEqual(8);
    });
  });

  it('has valid structure for all exercises', () => {
    EXERCISES.forEach((ex) => {
      expect(ex.id).toBeTruthy();
      expect(ex.title).toBeTruthy();
      expect(ex.description).toBeTruthy();
      expect(ex.durationSeconds).toBeGreaterThan(0);
      expect(ex.xpReward).toBeGreaterThan(0);
      expect(ex.instructions.length).toBeGreaterThan(0);
      expect(EXERCISE_TIERS[ex.tier]).toBeDefined();
    });
  });

  it('retrieves exercise by ID', () => {
    const ex = getExerciseById('anxious-478');
    expect(ex).toBeDefined();
    expect(ex?.title).toBe('تنفس ۴-۷-۸');
  });
});
