import type { Challenge } from '../types/challenge';

export const DAILY_CHALLENGES: Challenge[] = [
  {
    id: 'daily-3-calm',
    title: '۳ تمرین آرامش',
    description: 'انجام ۳ تمرین در حالت آرامش یا تمرین‌های تنفسی',
    type: 'daily',
    requiredCount: 3,
    reward: { xp: 50, coins: 50 },
    icon: '😌',
    conditionType: 'exercises_count',
  },
  {
    id: 'daily-2-anxious',
    title: '۲ تمرین مهار اضطراب',
    description: 'انجام ۲ تمرین ویژه آرام‌سازی اضطراب',
    type: 'daily',
    requiredCount: 2,
    reward: { xp: 60, coins: 60 },
    icon: '😰',
    conditionType: 'anxious_count',
  },
  {
    id: 'daily-5-quick',
    title: '۵ تمرین سریع',
    description: 'انجام ۵ تمرین ۱ دقیقه‌ای برای تمرکز داغ',
    type: 'daily',
    requiredCount: 5,
    reward: { xp: 70, coins: 70 },
    icon: '⚡',
    conditionType: 'quick_count',
  },
  {
    id: 'daily-1-deep',
    title: '۱ تمرین عمیق',
    description: 'انجام یک تمرین ۵ دقیقه‌ای یا بیشتر',
    type: 'daily',
    requiredCount: 1,
    reward: { xp: 80, coins: 80 },
    icon: '🌊',
    conditionType: 'deep_count',
  },
];

export const WEEKLY_CHALLENGES: Challenge[] = [
  {
    id: 'weekly-7-streak',
    title: '۷ روز متوالی پایبندی',
    description: 'تمرین در تمامی ۷ روز این هفته بدون وقفه',
    type: 'weekly',
    requiredCount: 7,
    reward: { xp: 500, coins: 200, gems: 5 },
    icon: '🔥',
    conditionType: 'streak_days',
  },
];

export const MONTHLY_CHALLENGES: Challenge[] = [
  {
    id: 'monthly-30-streak',
    title: '۳۰ روز متوالی پایبندی',
    description: 'حفظ استریک به مدت ۳۰ روز کامل در این ماه',
    type: 'monthly',
    requiredCount: 30,
    reward: { xp: 2000, coins: 1000, gems: 50, luckyBoxType: 'gold' },
    icon: '👑',
    conditionType: 'streak_days',
  },
];
