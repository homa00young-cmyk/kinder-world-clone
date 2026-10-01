import React, { useState } from 'react';
import { DAILY_CHALLENGES, WEEKLY_CHALLENGES, MONTHLY_CHALLENGES } from '../data/challenges';
import { ChallengeCard } from '../components/gamification/ChallengeCard';
import type { ChallengeType } from '../types/challenge';
import { CurrencyDisplay } from '../components/gamification/CurrencyDisplay';

export const ChallengesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ChallengeType>('daily');

  const challengesMap: Record<ChallengeType, typeof DAILY_CHALLENGES> = {
    daily: DAILY_CHALLENGES,
    weekly: WEEKLY_CHALLENGES,
    monthly: MONTHLY_CHALLENGES,
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 p-4 md:p-6 pb-24 dir-rtl">
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-black text-stone-800 tracking-tight flex items-center gap-2">
              <span>🎯</span> چالش‌های زمان‌دار
            </h2>
            <p className="text-xs text-stone-500 font-medium">ماموریت‌های روزانه، هفتگی و ماهانه برای دریافت سکه و جوایز ویژه</p>
          </div>

          <CurrencyDisplay />
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-bold text-stone-700 bg-stone-100 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'daily' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-stone-900'
          }`}
        >
          📅 روزانه (۷ چالش)
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'weekly' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-stone-900'
          }`}
        >
          🗓️ هفتگی
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'monthly' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-stone-900'
          }`}
        >
          🌕 ماهانه
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {challengesMap[activeTab].map((c) => (
          <ChallengeCard key={c.id} challenge={c} />
        ))}
      </div>
    </div>
  );
};

export default ChallengesPage;
