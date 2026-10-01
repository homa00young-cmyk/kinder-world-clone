import React, { useMemo } from 'react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { useGamificationStore } from '../../store/useGamificationStore';
import { usePlantStore } from '../../store/usePlantStore';
import { generatePersonalInsights } from '../../data/insights';
import { InsightCard } from './InsightCard';

export const InsightsList: React.FC = () => {
  const logs = useAnalyticsStore((s) => s.logs);
  const streak = useGamificationStore((s) => s.currentStreak);
  const level = useGamificationStore((s) => s.level);
  const totalXP = usePlantStore((s) => s.totalXP);

  const insights = useMemo(() => {
    return generatePersonalInsights(logs, streak, totalXP, level);
  }, [logs, streak, totalXP, level]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
          <span>🧠</span> تحلیل‌های هوشمند و روانی (۱۰+ الگوی اختصاصی)
        </h3>
        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200">
          تحلیل محلی (آفلاین)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
};
