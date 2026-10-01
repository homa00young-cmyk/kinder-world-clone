export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  gradient: string;
}

export interface Theme {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  colors: ThemeColors;
  isDark: boolean;
  premium: boolean;
  priceCoins?: number;
  priceGems?: number;
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
}

export type ThemeMode = 'system' | 'light' | 'dark' | 'emotion_aware' | 'time_aware';
