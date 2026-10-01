import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { useGamificationStore } from '../../store/useGamificationStore';
import { toJalaliDateString, toPersianDigits } from '../../utils/dateHelpers';

const moodScoreMap: Record<string, number> = {
  'سپاسگزار': 9.5,
  'آرام': 8.5,
  'خسته': 5.5,
  'مضطرب': 3.5,
  'عصبانی': 2.5,
};

export const MoodTrendChart: React.FC = () => {
  const [daysRange, setDaysRange] = useState<7 | 30 | 90>(30);
  const logs = useAnalyticsStore((s) => s.logs);
  const streak = useGamificationStore((s) => s.currentStreak);

  const chartData = useMemo(() => {
    const now = new Date();
    const dateMap: Record<string, { totalScore: number; count: number; mood: string; xp: number; notes?: string }> = {};

    for (let i = daysRange - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      dateMap[dateStr] = { totalScore: 0, count: 0, mood: 'آرام', xp: 0 };
    }

    logs.forEach((log) => {
      if (log.date in dateMap) {
        const score = moodScoreMap[log.mood] || 5;
        dateMap[log.date].totalScore += score;
        dateMap[log.date].count += 1;
        dateMap[log.date].mood = log.mood;
        dateMap[log.date].xp += log.xpGained || 0;
        if (log.notes) dateMap[log.date].notes = log.notes;
      }
    });

    const points = Object.keys(dateMap).sort().map((dateStr, idx, keys) => {
      const item = dateMap[dateStr];
      const dailyScore = item.count > 0 ? Number((item.totalScore / item.count).toFixed(1)) : 6.0;

      let sum = 0;
      let count = 0;
      for (let k = Math.max(0, idx - 6); k <= idx; k++) {
        const kDate = keys[k];
        const kItem = dateMap[kDate];
        const kScore = kItem.count > 0 ? kItem.totalScore / kItem.count : 6.0;
        sum += kScore;
        count++;
      }
      const movingAvg = Number((sum / count).toFixed(1));

      return {
        date: dateStr,
        jalaliDate: toJalaliDateString(dateStr),
        score: dailyScore,
        movingAvg,
        baseline: 6.5,
        mood: item.mood,
        exercises: item.count,
        xp: item.xp,
        notes: item.notes,
        isMilestone: idx === keys.length - 1 && streak >= 7,
      };
    });

    return points;
  }, [logs, daysRange, streak]);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
            <span>📈</span> روند سلامت احساسی
          </h3>
          <p className="text-xs text-stone-500">نمره عاطفی محاسبه شده روزانه و میانگین ۷ روزه</p>
        </div>

        <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold text-stone-600">
          <button
            onClick={() => setDaysRange(7)}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              daysRange === 7 ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'hover:text-stone-900'
            }`}
          >
            ۷ روز
          </button>
          <button
            onClick={() => setDaysRange(30)}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              daysRange === 30 ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'hover:text-stone-900'
            }`}
          >
            ۳۰ روز
          </button>
          <button
            onClick={() => setDaysRange(90)}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              daysRange === 90 ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'hover:text-stone-900'
            }`}
          >
            ۹۰ روز
          </button>
        </div>
      </div>

      <div className="w-full h-64 dir-ltr">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="jalaliDate"
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickFormatter={(val) => toPersianDigits(val.split('/')[2] || val)}
            />
            <YAxis domain={[1, 10]} tick={{ fontSize: 10, fill: '#64748b' }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-stone-900/90 backdrop-blur-md text-white p-3 rounded-2xl text-xs shadow-xl dir-rtl border border-stone-700">
                      <div className="font-bold text-amber-300">{toPersianDigits(data.jalaliDate)}</div>
                      <div className="mt-1">احساس غلبه‌یافته: {data.mood}</div>
                      <div>نمره احساسی: {toPersianDigits(data.score)} / ۱۰</div>
                      <div>میانگین ۷ روزه: {toPersianDigits(data.movingAvg)}</div>
                      <div>تعداد تمرین: {toPersianDigits(data.exercises)}</div>
                      <div>امتیاز کسب شده: {toPersianDigits(data.xp)} XP</div>
                      {data.notes && <div className="mt-1 text-stone-300 italic">«{data.notes}»</div>}
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={6.5} stroke="#cbd5e1" strokeDasharray="3 3" label={{ value: 'مبنا', fill: '#94a3b8', fontSize: 10 }} />
            <Line
              type="monotone"
              dataKey="movingAvg"
              stroke="#0284c7"
              strokeDasharray="4 4"
              strokeWidth={2}
              dot={false}
              name="میانگین ۷ روزه"
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#10b981"
              strokeWidth={3}
              activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
              dot={{ r: 3, fill: '#10b981' }}
              name="نمره روزانه"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-around border-t border-stone-100 pt-3 text-xs text-stone-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-emerald-500 rounded-full inline-block"></span>
          <span>نمره روزانه</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-sky-500 border-dashed border-sky-500 rounded-full inline-block"></span>
          <span>میانگین ۷ روزه</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-slate-300 rounded-full inline-block"></span>
          <span>خط مبنا (۶.۵)</span>
        </div>
      </div>
    </div>
  );
};
