import { describe, it, expect, beforeEach } from 'vitest';
import { useAchievementStore } from '../store/useAchievementStore';
import { ACHIEVEMENTS } from '../data/achievements';

describe('Achievement System', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should load initial achievements correctly', () => {
    const store = useAchievementStore.getState();
    expect(Object.keys(store.userAchievements).length).toBe(ACHIEVEMENTS.length);
  });

  it('should unlock achievement and track progress', () => {
    const store = useAchievementStore.getState();
    const result = store.unlockAchievement('streak-3');

    expect(result.unlocked).toBe(true);
    expect(result.achievement?.title).toBe('سه‌گانه');

    const updatedUserAch = useAchievementStore.getState().userAchievements['streak-3'];
    expect(updatedUserAch.unlockedAt).not.toBeNull();
  });

  it('should toggle pin status on achievement', () => {
    const store = useAchievementStore.getState();
    store.togglePin('streak-1');

    const isPinned = useAchievementStore.getState().userAchievements['streak-1'].isPinned;
    expect(isPinned).toBe(true);
  });
});
