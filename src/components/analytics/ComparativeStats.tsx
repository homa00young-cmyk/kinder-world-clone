import React, { useState, useMemo } from 'react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { toPersianDigits } from '../../utils/dateHelpers';

export const ComparativeStats: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const logs = useAnalyticsStore((s) => s.logs);

  const stats = useMemo(() => {
    const now = new Date();
    let currentLogs = [];
    let previousLogs = [];

    if (period === 'week') {
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      const currentStart = new Date(now.getTime() - sevenDays);
      const previousStart = new Date(now.getTime() - 2 * sevenDays);

      currentLogs = logs.filter((l) => new Date(l.date) >= currentStart);
      previousLogs = logs.filter((l) => {
        const d = new Date(l.date);
        return d >= previousStart && d < currentStart;
      });
    } else if (period === 'month') {
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      const currentStart = new Date(now.getTime() - thirtyDays);
      const previousStart = new Date(now.getTime() - 2 * thirtyDays);

      currentLogs = logs.filter((l) => new Date(l.date) >= currentStart);
      previousLogs = logs.filter((l) => {
        const d = new Date(l.date);
        return d >= previousStart && d < currentStart;
      });
    } else {
      const currentYear = now.getFullYear();
      currentLogs = logs.filter((l) => new Date(l.date).getFullYear() === currentYear);
      previousLogs = logs.filter((l) => new Date(l.date).getFullYear() === currentYear - 1);
    }

    const currentXP = currentLogs.reduce((acc, l) => acc + (l.xpGained || 0), 0);
    const previousXP = previousLogs.reduce((acc, l) => acc + (l.xpGained || 0), 0);

    const xpDelta = previousXP > 0 ? Math.round(((currentXP - previousXP) / previousXP) * 100) : 100;
    const countDelta =
      previousLogs.length > 0 ? Math.round(((currentLogs.length - previousLogs.length) / previousLogs.length) * 100) : 100;

    return {
      currentCount: currentLogs.length,
      previousCount: previousLogs.length,
      currentXP,
      previousXP,
      xpDelta,
      countDelta,
    };
  }, [logs, period]);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
            <span>⚖️</span> تحلیل مقایسه‌ای
          </h3>
          <p className="text-xs text-stone-500">مقایسه بازه‌های زمانی با درصد تغییرات عملکرد</p>
        </div>

        <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold text-stone-600">
          <button
            onClick={() => setPeriod('week')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              period === 'week' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'hover:text-stone-900'
            }`}
          >
            این هفته / هفته قبل
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              period === 'month' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'hover:text-stone-900'
            }`}
          >
            این ماه / ماه قبل
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              period === 'year' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'hover:text-stone-900'
            }`}
          >
            امسال / پارسال
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span>تعداد تمرین‌ها</span>
            <span
              className={`px-2 py-0.5 rounded-lg text-[11px] ${
                stats.countDelta >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {stats.countDelta >= 0 ? '▲' : '▼'} {toPersianDigits(Math.abs(stats.countDelta))}٪
            </span>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="flex-1">
              <div className="text-[10px] text-stone-400 font-semibold mb-1">دوره فعلی</div>
              <div className="h-6 bg-emerald-500 rounded-xl flex items-center justify-end px-2 text-white font-extrabold text-xs">
                {toPersianDigits(stats.currentCount)}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-stone-400 font-semibold mb-1">دوره قبل</div>
              <div className="h-6 bg-slate-300 rounded-xl flex items-center justify-end px-2 text-stone-700 font-extrabold text-xs">
                {toPersianDigits(stats.previousCount)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span>امتیاز (XP)</span>
            <span
              className={`px-2 py-0.5 rounded-lg text-[11px] ${
                stats.xpDelta >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {stats.xpDelta >= 0 ? '▲' : '▼'} {toPersianDigits(Math.abs(stats.xpDelta))}٪
            </span>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="flex-1">
              <div className="text-[10px] text-stone-400 font-semibold mb-1">دوره فعلی</div>
              <div className="h-6 bg-amber-500 rounded-xl flex items-center justify-end px-2 text-white font-extrabold text-xs">
                {toPersianDigits(stats.currentXP)} XP
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-stone-400 font-semibold mb-1">دوره قبل</div>
              <div className="h-6 bg-slate-300 rounded-xl flex items-center justify-end px-2 text-stone-700 font-extrabold text-xs">
                {toPersianDigits(stats.previousXP)} XP
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
