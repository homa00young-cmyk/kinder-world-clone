import React, { useState, useMemo } from 'react';
import { ACHIEVEMENTS } from '../data/achievements';
import { useAchievementStore } from '../store/useAchievementStore';
import { AchievementCard } from '../components/achievements/AchievementCard';
import { AchievementModal } from '../components/achievements/AchievementModal';
import { UnlockAnimation } from '../components/achievements/UnlockAnimation';
import type { AchievementCategory, Achievement } from '../types/achievement';
import { toPersianDigits } from '../utils/dateHelpers';

export const AchievementsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked' | 'in_progress'>('all');
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const userAchievements = useAchievementStore((s) => s.userAchievements);

  const totalCount = ACHIEVEMENTS.length;
  const unlockedCount = Object.values(userAchievements).filter((ua) => ua.unlockedAt).length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = useMemo(() => {
    return ACHIEVEMENTS.filter((ach) => {
      const userAch = userAchievements[ach.id];
      const isUnlocked = !!userAch?.unlockedAt;
      const progress = userAch?.progress || 0;

      if (activeTab === 'unlocked' && !isUnlocked) return false;
      if (activeTab === 'locked' && isUnlocked) return false;
      if (activeTab === 'in_progress' && (isUnlocked || progress === 0)) return false;

      if (selectedCategory !== 'ALL' && ach.category !== selectedCategory) return false;

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = ach.title.toLowerCase().includes(query);
        const matchesDesc = ach.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    });
  }, [activeTab, selectedCategory, searchQuery, userAchievements]);

  const categories: { key: AchievementCategory | 'ALL'; label: string; emoji: string }[] = [
    { key: 'ALL', label: 'همه دسته‌ها', emoji: '🌟' },
    { key: 'streak', label: 'تداوم', emoji: '🔥' },
    { key: 'volume', label: 'حجم', emoji: '📝' },
    { key: 'variety', label: 'تنوع', emoji: '🎨' },
    { key: 'mastery', label: 'تسلط', emoji: '🧘' },
    { key: 'growth', label: 'رشد گیاه', emoji: '🪴' },
    { key: 'time', label: 'زمان‌بندی', emoji: '⏰' },
    { key: 'social', label: 'اجتماعی', emoji: '🤝' },
    { key: 'hidden', label: 'مخفی', emoji: '🕵️' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 p-4 md:p-6 pb-24 dir-rtl">
      <UnlockAnimation />

      <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-black text-stone-800 tracking-tight flex items-center gap-2">
              <span>🏆</span> تالار دستاوردها ({toPersianDigits(totalCount)} دستاورد)
            </h2>
            <p className="text-xs text-stone-500 font-medium">ماموریت‌ها و مدال‌های افتخار مسیر خودآگاهی شما</p>
          </div>

          <div className="text-sm font-extrabold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
            {toPersianDigits(unlockedCount)} از {toPersianDigits(totalCount)} آزاد شده ({toPersianDigits(completionPercent)}٪)
          </div>
        </div>

        <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="🔍 جستجو در دستاوردها..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-stone-200 rounded-2xl px-4 py-3 text-xs font-medium focus:outline-hidden focus:border-emerald-500 shadow-xs"
        />

        <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs font-bold text-stone-700">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat.key
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs font-bold text-stone-700">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'all' ? 'bg-stone-900 text-white shadow-xs' : 'bg-white border border-stone-200 hover:bg-stone-50'
            }`}
          >
            همه ({toPersianDigits(totalCount)})
          </button>
          <button
            onClick={() => setActiveTab('unlocked')}
            className={`px-4 py-2 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'unlocked' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-stone-200 hover:bg-stone-50'
            }`}
          >
            آزاد شده ({toPersianDigits(unlockedCount)})
          </button>
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`px-4 py-2 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'in_progress' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white border border-stone-200 hover:bg-stone-50'
            }`}
          >
            در حال انجام
          </button>
          <button
            onClick={() => setActiveTab('locked')}
            className={`px-4 py-2 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'locked' ? 'bg-stone-600 text-white shadow-xs' : 'bg-white border border-stone-200 hover:bg-stone-50'
            }`}
          >
            قفل شده
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {filteredAchievements.map((ach) => (
          <AchievementCard
            key={ach.id}
            achievement={ach}
            userAchievement={userAchievements[ach.id]}
            onClick={() => setSelectedAchievement(ach)}
          />
        ))}
      </div>

      {selectedAchievement && (
        <AchievementModal
          achievement={selectedAchievement}
          userAchievement={userAchievements[selectedAchievement.id]}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </div>
  );
};

export default AchievementsPage;
