import React, { useState } from 'react';
import { useGamificationStore } from '../store/useGamificationStore';
import { usePlantStore } from '../store/usePlantStore';
import { useAchievementStore } from '../store/useAchievementStore';
import { ACHIEVEMENTS } from '../data/achievements';
import { AchievementBadge } from '../components/achievements/AchievementBadge';
import { XPBar } from '../components/gamification/XPBar';
import { StreakProtectionModal } from '../components/gamification/StreakProtectionModal';
import { toPersianDigits } from '../utils/dateHelpers';

export const ProfilePage: React.FC = () => {
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const level = useGamificationStore((s) => s.level);
  const streak = useGamificationStore((s) => s.currentStreak);
  const bestStreak = useGamificationStore((s) => s.bestStreak);
  const coins = useGamificationStore((s) => s.coins);
  const gems = useGamificationStore((s) => s.gems);
  const streakFreezeCount = useGamificationStore((s) => s.streakFreezeCount);

  const plantSpecies = usePlantStore((s) => s.getSpecies());
  const plantStage = usePlantStore((s) => s.getStage());

  const userAchievements = useAchievementStore((s) => s.userAchievements);

  const pinnedAchievements = ACHIEVEMENTS.filter((a) => userAchievements[a.id]?.isPinned);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 p-4 md:p-6 pb-24 dir-rtl">
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-stone-100 flex flex-col items-center text-center gap-4 relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-4xl shadow-md text-white font-black">
          {plantSpecies.emoji}
        </div>

        <div>
          <h2 className="text-xl font-black text-stone-900">باغبان ارشد (سطح {toPersianDigits(level)})</h2>
          <p className="text-xs text-stone-500 font-medium">گونه فعال: {plantSpecies.name} • {plantStage.label}</p>
        </div>

        <XPBar />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-2xs flex flex-col items-center gap-1">
          <span className="text-xs text-stone-500">استریک فعلی</span>
          <span className="text-lg font-black text-amber-900">🔥 {toPersianDigits(streak)} روز</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-2xs flex flex-col items-center gap-1">
          <span className="text-xs text-stone-500">بهترین استریک</span>
          <span className="text-lg font-black text-emerald-900">⭐ {toPersianDigits(bestStreak)} روز</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-2xs flex flex-col items-center gap-1">
          <span className="text-xs text-stone-500">سکه‌ها</span>
          <span className="text-lg font-black text-amber-800">🪙 {toPersianDigits(coins)}</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-2xs flex flex-col items-center gap-1">
          <span className="text-xs text-stone-500">الماس‌ها</span>
          <span className="text-lg font-black text-purple-900">💎 {toPersianDigits(gems)}</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-5 text-white shadow-md flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl p-2 bg-white/20 rounded-2xl">🧊</div>
          <div>
            <h3 className="text-sm font-black">محافظ استریک (Streak Freeze)</h3>
            <p className="text-xs text-sky-100">موجودی فعلی شما: {toPersianDigits(streakFreezeCount)} عدد</p>
          </div>
        </div>
        <button
          onClick={() => setShowFreezeModal(true)}
          className="px-4 py-2 bg-white text-sky-900 font-bold text-xs rounded-2xl shadow-xs hover:bg-sky-50 transition-all cursor-pointer"
        >
          مدیریت و خرید
        </button>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100 flex flex-col gap-3">
        <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
          <span>📌</span> دستاوردهای سنجاق شده
        </h3>

        {pinnedAchievements.length === 0 ? (
          <p className="text-xs text-stone-400">هنوز دستاوردی به پروفایل سنجاق نکرده‌اید. می‌توانید از تالار دستاوردها مدال‌های دلخواهتان را سنجاق کنید.</p>
        ) : (
          <div className="flex items-center gap-4 overflow-x-auto py-1">
            {pinnedAchievements.map((ach) => (
              <div key={ach.id} className="flex flex-col items-center gap-1">
                <AchievementBadge achievement={ach} unlocked={true} progressPercent={100} size="md" />
                <span className="text-xs font-bold text-stone-800">{ach.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showFreezeModal && <StreakProtectionModal onClose={() => setShowFreezeModal(false)} />}
    </div>
  );
};

export default ProfilePage;
