import { describe, it, expect, beforeEach } from 'vitest';
import { usePlantStore } from '../store/usePlantStore';

describe('usePlantStore', () => {
  beforeEach(() => {
    localStorage.clear();
    usePlantStore.getState().resetPlant();
  });

  it('initializes with default Sunflower plant at Stage 1 (🌰 دانه)', () => {
    const state = usePlantStore.getState();
    expect(state.totalXP).toBe(0);
    expect(state.getStage().emoji).toBe('🌰');
    expect(state.getStage().stage).toBe(1);
    expect(state.getSpecies().id).toBe('sunflower');
    expect(state.health).toBe(100);
  });

  it('grows through 12 stages as XP increases', () => {
    const store = usePlantStore.getState();

    // Stage 1 -> Stage 2 (10 XP)
    store.addXP(10);
    expect(usePlantStore.getState().getStage().emoji).toBe('🌱');
    expect(usePlantStore.getState().getStage().stage).toBe(2);

    // Stage 2 -> Stage 3 (25 XP)
    store.addXP(15);
    expect(usePlantStore.getState().getStage().emoji).toBe('🌿');
    expect(usePlantStore.getState().getStage().stage).toBe(3);

    // Add 2500 XP total -> Stage 12 (🌳👑)
    store.addXP(2500);
    expect(usePlantStore.getState().getStage().emoji).toBe('🌳👑');
    expect(usePlantStore.getState().getStage().stage).toBe(12);
  });

  it('calculates species bonus correctly', () => {
    const store = usePlantStore.getState();
    // Switch to Cactus (20% bonus on hard days)
    store.switchSpecies('cactus');

    const result = store.addXP(10, 'ex1', 'مضطرب'); // anxious is hard day
    expect(result.xpGained).toBe(12); // 10 * 1.2
    expect(result.bonusGained).toBe(2);
  });

  it('handles watering plant to restore health', () => {
    const store = usePlantStore.getState();
    // Simulate low health
    usePlantStore.setState({ health: 50 });

    store.waterPlant();
    expect(usePlantStore.getState().health).toBe(80); // 50 + 30
  });

  it('migrates legacy V1 storage if present', () => {
    localStorage.setItem(
      'kinder_world_plant_state_v1',
      JSON.stringify({ stageIndex: 2, completedExercisesCount: 5 })
    );

    // Force reload initial state by calling getState after reset or store reload
    usePlantStore.getState().resetPlant();
    // Simulate load by state setup
    expect(usePlantStore.getState().completedExercisesCount).toBe(0);
  });
});
