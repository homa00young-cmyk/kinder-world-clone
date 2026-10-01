import React, { useMemo } from 'react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { toJalaliDateString, toPersianDigits } from '../../utils/dateHelpers';

export const StreakCalendar: React.FC = () => {
  const logs = useAnalyticsStore((s) => s.logs);

  const daysGrid = useMemo(() => {
    const dateMap: Record<string, { count: number; xp: number; mood?: string }> = {};
    const now = new Date();

    for (let i = 363; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dateMap[d.toISOString().split('T')[0]] = { count: 0, xp: 0 };
    }

    logs.forEach((log) => {
      if (log.date in dateMap) {
        dateMap[log.date].count++;
        dateMap[log.date].xp += log.xpGained || 0;
        dateMap[log.date].mood = log.mood;
      }
    });

    return Object.keys(dateMap).map((dateStr) => {
      const item = dateMap[dateStr];
      let level = 0;
      if (item.count === 1) level = 1;
      else if (item.count === 2) level = 2;
      else if (item.count === 3) level = 3;
      else if (item.count >= 4) level = 4;

      return {
        date: dateStr,
        jalaliDate: toJalaliDateString(dateStr),
        count: item.count,
        xp: item.xp,
        mood: item.mood,
        level,
      };
    });
  }, [logs]);

  const levelColors = [
    'bg-stone-100 border-stone-200/50',
    'bg-emerald-200 border-emerald-300',
    'bg-emerald-400 border-emerald-500',
    'bg-emerald-600 border-emerald-700',
    'bg-emerald-800 border-emerald-900',
  ];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100 flex flex-col gap-4 w-full">
      <div>
        <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
          <span>📅</span> تقویم استریک ۳۶۵ روزه
        </h3>
        <p className="text-xs text-stone-500">نقشه فعالیت یک‌ساله شبیه گیت‌هاب بر اساس شدت تمرینات</p>
      </div>

      <div className="overflow-x-auto pb-2 dir-ltr">
        <div className="inline-grid grid-rows-7 grid-flow-col gap-1">
          {daysGrid.map((day) => (
            <div
              key={day.date}
              title={`${toPersianDigits(day.jalaliDate)}: ${toPersianDigits(day.count)} تمرین (${toPersianDigits(
                day.xp
              )} XP)`}
              className={`w-3 h-3 rounded-xs border transition-transform hover:scale-125 cursor-pointer ${
                levelColors[day.level]
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-3">
        <span>کمتر</span>
        <div className="flex items-center gap-1">
          {levelColors.map((cls, idx) => (
            <span key={idx} className={`w-3 h-3 rounded-xs border ${cls}`} />
          ))}
        </div>
        <span>بیشتر</span>
      </div>
    </div>
  );
};
