import React from 'react';
import { StatsSummary } from '../components/analytics/StatsSummary';
import { MoodTrendChart } from '../components/analytics/MoodTrendChart';
import { EmotionSunburst } from '../components/analytics/EmotionSunburst';
import { WeeklyHeatmap } from '../components/analytics/WeeklyHeatmap';
import { XPGrowthChart } from '../components/analytics/XPGrowthChart';
import { ExerciseRadar } from '../components/analytics/ExerciseRadar';
import { StreakCalendar } from '../components/analytics/StreakCalendar';
import { MoodCalendar } from '../components/analytics/MoodCalendar';
import { InsightsList } from '../components/analytics/InsightsList';
import { ComparativeStats } from '../components/analytics/ComparativeStats';

export const StatsPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 p-4 md:p-6 pb-24 dir-rtl">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-stone-800 tracking-tight flex items-center gap-2">
          <span>📊</span> داشبورد آمار و تحلیل‌های روانی
        </h2>
        <p className="text-xs text-stone-500 font-medium">
          تحلیل عمیق داده‌های خودآگاهی، سلامت احساسی و روند رشد ذهن شما
        </p>
      </div>

      <StatsSummary />
      <MoodTrendChart />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmotionSunburst />
        <WeeklyHeatmap />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <XPGrowthChart />
        <ExerciseRadar />
      </div>

      <ComparativeStats />
      <StreakCalendar />
      <MoodCalendar />
      <InsightsList />
    </div>
  );
};

export default StatsPage;
