import { describe, it, expect } from 'vitest';
import { useThemeStore } from '../store/useThemeStore';
import { THEMES } from '../data/themes';

describe('Theme System', () => {
  it('should switch theme correctly', () => {
    const store = useThemeStore.getState();
    store.setTheme('night');

    expect(useThemeStore.getState().currentThemeId).toBe('night');
  });

  it('should return 12 themes', () => {
    expect(THEMES.length).toBe(12);
  });

  it('should get effective theme for emotion_aware mode', () => {
    const store = useThemeStore.getState();
    store.setThemeMode('emotion_aware');

    const theme = store.getEffectiveTheme('مضطرب');
    expect(theme.id).toBe('ocean');
  });
});
