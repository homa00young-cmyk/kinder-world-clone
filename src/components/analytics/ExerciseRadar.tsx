import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { toPersianDigits } from '../../utils/dateHelpers';

export const ExerciseRadar: React.FC = () => {
  const logs = useAnalyticsStore((s) => s.logs);

  const radarData = useMemo(() => {
    const categories = [
      { key: 'breathing', label: 'تنفس' },
      { key: 'writing', label: 'نگارش' },
      { key: 'meditation', label: 'مراقبه' },
      { key: 'body', label: 'اسکن بدنی' },
      { key: 'compassion', label: 'شفقت' },
      { key: 'gratitude', label: 'سپاسگزاری' },
    ];

    const currentMonthCounts: Record<string, number> = {
      breathing: 0,
      writing: 0,
      meditation: 0,
      body: 0,
      compassion: 0,
      gratitude: 0,
    };

    const previousMonthCounts: Record<string, number> = {
      breathing: 0,
      writing: 0,
      meditation: 0,
      body: 0,
      compassion: 0,
      gratitude: 0,
    };

    const now = new Date();
    const currMonth = now.getMonth();
    const currYear = now.getFullYear();

    logs.forEach((log) => {
      const d = new Date(log.date);
      const isCurr = d.getMonth() === currMonth && d.getFullYear() === currYear;
      const isPrev =
        (d.getMonth() === currMonth - 1 && d.getFullYear() === currYear) ||
        (currMonth === 0 && d.getMonth() === 11 && d.getFullYear() === currYear - 1);

      let catKey = 'breathing';
      const title = log.exerciseTitle || log.exerciseId || '';
      if (title.includes('تنفس') || title.includes('breath')) catKey = 'breathing';
      else if (title.includes('نوشتن') || title.includes('نامه') || title.includes('نگارش')) catKey = 'writing';
      else if (title.includes('مدیتیشن') || title.includes('مراقبه') || title.includes('حضور')) catKey = 'meditation';
      else if (title.includes('بدن') || title.includes('عضلانی') || title.includes('اسکن')) catKey = 'body';
      else if (title.includes('مهربانی') || title.includes('شفقت') || title.includes('مهر')) catKey = 'compassion';
      else if (title.includes('سپاس') || title.includes('قدردانی') || title.includes('اتفاق')) catKey = 'gratitude';

      if (isCurr) currentMonthCounts[catKey]++;
      if (isPrev) previousMonthCounts[catKey]++;
    });

    return categories.map((c) => ({
      category: c.label,
      ماه_جاری: currentMonthCounts[c.key] || 1,
      ماه_قبل: previousMonthCounts[c.key] || 1,
    }));
  }, [logs]);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100 flex flex-col gap-4 w-full">
      <div>
        <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
          <span>🕸️</span> رادار تعادل تمرینات
        </h3>
        <p className="text-xs text-stone-500">مقایسه توازن ۶ حوزه اصلی خودآگاهی در ماه جاری و ماه قبل</p>
      </div>

      <div className="w-full h-64 dir-ltr">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="category" tick={{ fill: '#334155', fontSize: 11, fontWeight: 'bold' }} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fontSize: 9, fill: '#94a3b8' }} />
            <Radar name="ماه جاری" dataKey="ماه_جاری" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
            <Radar name="ماه قبل" dataKey="ماه_قبل" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-stone-900/90 text-white p-2.5 rounded-2xl text-xs dir-rtl">
                      <div className="font-bold text-emerald-400">{data.category}</div>
                      <div>ماه جاری: {toPersianDigits(data.ماه_جاری)} تمرین</div>
                      <div>ماه قبل: {toPersianDigits(data.ماه_قبل)} تمرین</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
