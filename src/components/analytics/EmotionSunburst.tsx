import React, { useState, useMemo } from 'react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import type { MoodType } from '../../types/moods';
import { toPersianDigits } from '../../utils/dateHelpers';

const moodColorMap: Record<MoodType, { bg: string; text: string; ring: string }> = {
  'آرام': { bg: 'bg-emerald-500', text: 'text-emerald-800', ring: '#10b981' },
  'سپاسگزار': { bg: 'bg-rose-500', text: 'text-rose-800', ring: '#f43f5e' },
  'خسته': { bg: 'bg-amber-500', text: 'text-amber-800', ring: '#f59e0b' },
  'مضطرب': { bg: 'bg-sky-500', text: 'text-sky-800', ring: '#0284c7' },
  'عصبانی': { bg: 'bg-orange-500', text: 'text-orange-800', ring: '#ea580c' },
};

export const EmotionSunburst: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const logs = useAnalyticsStore((s) => s.logs);

  const moodBreakdown = useMemo(() => {
    const counts: Record<MoodType, { count: number; exercises: Record<string, number> }> = {
      'آرام': { count: 0, exercises: {} },
      'سپاسگزار': { count: 0, exercises: {} },
      'خسته': { count: 0, exercises: {} },
      'مضطرب': { count: 0, exercises: {} },
      'عصبانی': { count: 0, exercises: {} },
    };

    logs.forEach((log) => {
      if (log.mood in counts) {
        counts[log.mood].count += 1;
        const exTitle = log.exerciseTitle || 'تمرین عمومی';
        counts[log.mood].exercises[exTitle] = (counts[log.mood].exercises[exTitle] || 0) + 1;
      }
    });

    const totalLogs = logs.length || 1;
    const moodList = (Object.keys(counts) as MoodType[]).map((m) => {
      const item = counts[m];
      const pct = Math.round((item.count / totalLogs) * 100);
      return {
        mood: m,
        count: item.count,
        pct,
        exercises: Object.entries(item.exercises).map(([title, cnt]) => ({ title, count: cnt })),
      };
    });

    return moodList;
  }, [logs]);

  const totalExercises = logs.length;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100 flex flex-col gap-4 w-full">
      <div>
        <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
          <span>🎯</span> توزیع احساسات و تمرین‌ها
        </h3>
        <p className="text-xs text-stone-500">تفکیک درصد احساسات ثبت شده و تمرین‌های انجام شده</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-around gap-6">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {(() => {
              let cumulativePct = 0;
              return moodBreakdown.map((item) => {
                const strokeDasharray = `${item.pct} ${100 - item.pct}`;
                const strokeDashoffset = -cumulativePct;
                cumulativePct += item.pct;
                const colors = moodColorMap[item.mood];

                return (
                  <circle
                    key={item.mood}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={colors.ring}
                    strokeWidth="12"
                    pathLength="100"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="cursor-pointer transition-all hover:opacity-80"
                    onClick={() => setSelectedMood(selectedMood === item.mood ? null : item.mood)}
                  />
                );
              });
            })()}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 rounded-full pointer-events-none">
            <div className="text-xs text-stone-400 font-medium">مجموع</div>
            <div className="text-xl font-black text-stone-800">{toPersianDigits(totalExercises)}</div>
            <div className="text-[10px] text-stone-500 font-semibold">تمرین</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-xs">
          {moodBreakdown.map((item) => {
            const colors = moodColorMap[item.mood];
            const isSelected = selectedMood === item.mood;

            return (
              <div key={item.mood} className="flex flex-col gap-1">
                <button
                  onClick={() => setSelectedMood(isSelected ? null : item.mood)}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected ? 'bg-stone-100 border-stone-300 shadow-xs' : 'bg-stone-50/50 border-stone-100 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${colors.bg}`}></span>
                    <span className="text-stone-800">{item.mood}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-stone-500">{toPersianDigits(item.count)} تمرین</span>
                    <span className="font-bold text-stone-900">{toPersianDigits(item.pct)}٪</span>
                  </div>
                </button>

                {isSelected && item.exercises.length > 0 && (
                  <div className="mr-5 pr-2 border-r-2 border-stone-200 text-[11px] text-stone-600 space-y-1 my-1">
                    {item.exercises.map((ex, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>• {ex.title}</span>
                        <span className="font-bold">{toPersianDigits(ex.count)} بار</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
