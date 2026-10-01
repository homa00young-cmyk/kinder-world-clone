import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { usePlantStore } from '../../store/usePlantStore';
import { toJalaliDateString, toPersianDigits } from '../../utils/dateHelpers';

export const XPGrowthChart: React.FC = () => {
  const [range, setRange] = useState<30 | 90 | 365>(30);
  const logs = useAnalyticsStore((s) => s.logs);
  const currentTotalXP = usePlantStore((s) => s.totalXP);

  const chartData = useMemo(() => {
    const now = new Date();
    const dateMap: Record<string, number> = {};

    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dateMap[d.toISOString().split('T')[0]] = 0;
    }

    logs.forEach((log) => {
      if (log.date in dateMap) {
        dateMap[log.date] += log.xpGained || 0;
      }
    });

    const dates = Object.keys(dateMap).sort();
    let cumulative = Math.max(0, currentTotalXP - Object.values(dateMap).reduce((a, b) => a + b, 0));

    const points = dates.map((dateStr) => {
      const daily = dateMap[dateStr];
      cumulative += daily;

      return {
        date: dateStr,
        jalaliDate: toJalaliDateString(dateStr),
        dailyXP: daily,
        cumulativeXP: cumulative,
      };
    });

    const avgDailyXP = points.length > 0 ? points.reduce((acc, p) => acc + p.dailyXP, 0) / points.length : 20;
    const forecastXP = cumulative + Math.round(avgDailyXP * 30);

    return { points, forecastXP };
  }, [logs, range, currentTotalXP]);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
            <span>✨</span> منحنی رشد امتیاز و XP
          </h3>
          <p className="text-xs text-stone-500">روند صعودی امتیاز کل (ناحیه) و درآمد روزانه (میله‌ها)</p>
        </div>

        <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold text-stone-600">
          <button
            onClick={() => setRange(30)}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              range === 30 ? 'bg-white shadow-xs text-amber-800 font-bold' : 'hover:text-stone-900'
            }`}
          >
            ۳۰ روز
          </button>
          <button
            onClick={() => setRange(90)}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              range === 90 ? 'bg-white shadow-xs text-amber-800 font-bold' : 'hover:text-stone-900'
            }`}
          >
            ۹۰ روز
          </button>
          <button
            onClick={() => setRange(365)}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              range === 365 ? 'bg-white shadow-xs text-amber-800 font-bold' : 'hover:text-stone-900'
            }`}
          >
            ۱ سال
          </button>
        </div>
      </div>

      <div className="w-full h-64 dir-ltr">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData.points} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="jalaliDate"
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickFormatter={(val) => toPersianDigits(val.split('/')[2] || val)}
            />
            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748b' }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748b' }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-stone-900/90 text-white p-3 rounded-2xl text-xs shadow-xl dir-rtl">
                      <div className="font-bold text-amber-300">{toPersianDigits(data.jalaliDate)}</div>
                      <div>امتیاز کسب شده امروز: {toPersianDigits(data.dailyXP)} XP</div>
                      <div>مجموع تراکمی: {toPersianDigits(data.cumulativeXP)} XP</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar yAxisId="right" dataKey="dailyXP" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={12} name="XP روزانه" />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="cumulativeXP"
              stroke="#d97706"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#xpGradient)"
              name="مجموع XP"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-xs flex items-center justify-between text-amber-900">
        <div className="flex items-center gap-2">
          <span>🔮</span>
          <span>پیش‌بینی ۳۰ روز آینده: رسیدن به حدود <strong className="font-bold text-amber-800">{toPersianDigits(chartData.forecastXP)} XP</strong></span>
        </div>
      </div>
    </div>
  );
};
