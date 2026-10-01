import React from 'react';
import { usePlantStore } from '../../store/usePlantStore';
import { useGamificationStore } from '../../store/useGamificationStore';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { toPersianDigits } from '../../utils/dateHelpers';

export const StatsSummary: React.FC = () => {
  const totalXP = usePlantStore((s) => s.totalXP);
  const coins = useGamificationStore((s) => s.coins);
  const gems = useGamificationStore((s) => s.gems);
  const streak = useGamificationStore((s) => s.currentStreak);
  const logs = useAnalyticsStore((s) => s.logs);

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const thisWeekExercises = logs.filter((l) => l.date >= sevenDaysAgo).length;

  const moodScoreMap: Record<string, number> = {
    'آرام': 9,
    'سپاسگزار': 10,
    'خسته': 5,
    'مضطرب': 3,
    'عصبانی': 2,
  };
  const recentLogs = logs.slice(0, 30);
  const avgMoodNum =
    recentLogs.length > 0
      ? (recentLogs.reduce((acc, l) => acc + (moodScoreMap[l.mood] || 5), 0) / recentLogs.length).toFixed(1)
      : '۷.۰';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
        <div className="text-3xl p-2 bg-amber-100/80 rounded-xl">🔥</div>
        <div>
          <div className="text-xs text-stone-500 font-medium">استریک فعلی</div>
          <div className="text-lg font-bold text-amber-900">{toPersianDigits(streak)} روز</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
        <div className="text-3xl p-2 bg-emerald-100/80 rounded-xl">⭐</div>
        <div>
          <div className="text-xs text-stone-500 font-medium">امتیاز کل</div>
          <div className="text-lg font-bold text-emerald-900">{toPersianDigits(totalXP)} XP</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200/60 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
        <div className="text-3xl p-2 bg-sky-100/80 rounded-xl">📊</div>
        <div>
          <div className="text-xs text-stone-500 font-medium">تمرین‌های این هفته</div>
          <div className="text-lg font-bold text-sky-900">{toPersianDigits(thisWeekExercises)} تمرین</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200/60 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
        <div className="text-3xl p-2 bg-rose-100/80 rounded-xl">🏆</div>
        <div>
          <div className="text-xs text-stone-500 font-medium">میانگین حال</div>
          <div className="text-lg font-bold text-rose-900">{toPersianDigits(avgMoodNum)} / ۱۰</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200/60 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
        <div className="text-3xl p-2 bg-yellow-100/80 rounded-xl">🪙</div>
        <div>
          <div className="text-xs text-stone-500 font-medium">سکه‌های شما</div>
          <div className="text-lg font-bold text-amber-800">{toPersianDigits(coins)}</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/60 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
        <div className="text-3xl p-2 bg-purple-100/80 rounded-xl">💎</div>
        <div>
          <div className="text-xs text-stone-500 font-medium">الماس‌های شما</div>
          <div className="text-lg font-bold text-purple-900">{toPersianDigits(gems)}</div>
        </div>
      </div>
    </div>
  );
};
