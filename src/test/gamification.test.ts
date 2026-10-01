import { describe, it, expect, beforeEach } from 'vitest';
import { useGamificationStore } from '../store/useGamificationStore';

describe('Gamification Store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should add and deduct coins correctly', () => {
    const store = useGamificationStore.getState();
    const initialCoins = store.coins;

    store.addCoins(100);
    expect(useGamificationStore.getState().coins).toBe(initialCoins + 100);

    const deducted = store.deductCoins(50);
    expect(deducted).toBe(true);
    expect(useGamificationStore.getState().coins).toBe(initialCoins + 50);
  });

  it('should level up when total XP crosses threshold', () => {
    const store = useGamificationStore.getState();
    // XP for level 2 is 100 * 2^1.5 = 282
    const res = store.checkAndLevelUp(300);

    expect(res.leveledUp).toBe(true);
    expect(res.newLevel).toBe(2);
  });

  it('should buy streak freeze if user has enough coins', () => {
    const store = useGamificationStore.getState();
    store.addCoins(200);

    const initialFreeze = store.streakFreezeCount;
    const bought = store.buyStreakFreeze();

    expect(bought).toBe(true);
    expect(useGamificationStore.getState().streakFreezeCount).toBe(initialFreeze + 1);
  });
});
