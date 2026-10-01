import { create } from 'zustand';
import type { MoodLog } from '../types/analytics';
import type { MoodType } from '../types/moods';

const ANALYTICS_STORAGE_KEY = 'kinder_world_analytics_v1';

export interface AnalyticsStoreState {
  logs: MoodLog[];
  addMoodLog: (log: Omit<MoodLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

function generateInitialMockLogs(): MoodLog[] {
  const mockLogs: MoodLog[] = [];
  const now = new Date();
  const moods: MoodType[] = ['آرام', 'سپاسگزار', 'خسته', 'مضطرب', 'عصبانی'];
  const exercises = [
    { id: 'anxious-478', title: 'تنفس ۴-۷-۸', duration: 120 },
    { id: 'anxious-box', title: 'تنفس مربعی', duration: 60 },
    { id: 'calm-self-compassion', title: 'مهربانی با خود', duration: 60 },
    { id: 'grateful-three-things', title: 'سه اتفاق خوب امروز', duration: 120 },
    { id: 'tired-belly-breath', title: 'تنفس عمیق شکمی', duration: 60 },
    { id: 'angry-fire-breath', title: 'تنفس تخلیه تنش', duration: 60 },
  ];

  for (let i = 89; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const numLogs = i % 7 === 0 ? 0 : (i % 3 === 0 ? 2 : 1);
    for (let j = 0; j < numLogs; j++) {
      const moodIdx = (i + j) % moods.length;
      const ex = exercises[(i + j) % exercises.length];
      const logHour = 8 + ((i * 3 + j * 5) % 12);
      const timestamp = new Date(date.setHours(logHour, 15, 0)).toISOString();

      mockLogs.push({
        id: `mock-${i}-${j}`,
        date: dateStr,
        timestamp,
        mood: moods[moodIdx],
        exerciseId: ex.id,
        exerciseTitle: ex.title,
        durationSeconds: ex.duration,
        xpGained: 15 + ((i + j) % 25),
        notes: i % 5 === 0 ? 'تمرین عالی و آرامش‌بخش روزانه' : undefined,
      });
    }
  }

  return mockLogs;
}

function loadInitialLogs(): MoodLog[] {
  try {
    const saved = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load analytics logs', e);
  }
  const initialMocks = generateInitialMockLogs();
  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(initialMocks));
  } catch (e) {
    console.error('Failed to persist mock logs', e);
  }
  return initialMocks;
}

function persistLogs(logs: MoodLog[]) {
  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to persist analytics logs', e);
  }
}

export const useAnalyticsStore = create<AnalyticsStoreState>((set) => ({
  logs: loadInitialLogs(),

  addMoodLog: (logData) => {
    const newLog: MoodLog = {
      ...logData,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    };

    set((state) => {
      const updatedLogs = [newLog, ...state.logs];
      persistLogs(updatedLogs);
      return { logs: updatedLogs };
    });
  },

  clearLogs: () => {
    set({ logs: [] });
    persistLogs([]);
  },
}));
