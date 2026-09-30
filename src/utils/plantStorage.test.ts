import { describe, it, expect, beforeEach } from 'vitest';
import { loadPlantState, savePlantState, getPlantStage } from '../utils/plantStorage';

describe('plantStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default state when storage is empty', () => {
    const state = loadPlantState();
    expect(state).toEqual({ stageIndex: 0, completedExercisesCount: 0 });
  });

  it('saves and loads plant state correctly', () => {
    savePlantState({ stageIndex: 1, completedExercisesCount: 1 });
    const loaded = loadPlantState();
    expect(loaded).toEqual({ stageIndex: 1, completedExercisesCount: 1 });
  });

  it('gets correct plant stage object', () => {
    expect(getPlantStage(0).emoji).toBe('🌱');
    expect(getPlantStage(1).emoji).toBe('🌿');
    expect(getPlantStage(2).emoji).toBe('🌳');
    expect(getPlantStage(5).emoji).toBe('🌳'); // bounded
  });
});
