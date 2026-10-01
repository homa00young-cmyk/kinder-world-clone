import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAchievementStore } from '../../store/useAchievementStore';
import { TIER_CONFIGS } from '../../data/achievements';
import { toPersianDigits } from '../../utils/dateHelpers';

export const UnlockAnimation: React.FC = () => {
  const recentlyUnlocked = useAchievementStore((s) => s.recentlyUnlocked);
  const clearRecentlyUnlocked = useAchievementStore((s) => s.clearRecentlyUnlocked);

  useEffect(() => {
    if (recentlyUnlocked) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Canvas not available in test environment
      }

      const timer = setTimeout(() => {
        clearRecentlyUnlocked();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [recentlyUnlocked, clearRecentlyUnlocked]);

  if (!recentlyUnlocked) return null;

  const tierConfig = TIER_CONFIGS[recentlyUnlocked.tier];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4 dir-rtl animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-4 border-2 border-amber-300 relative animate-bounceIn">
        <div className="text-sm font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 animate-pulse">
          🎉 دستاورد جدید آزاد شد!
        </div>

        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-200 to-yellow-300 border-4 border-amber-400 flex items-center justify-center text-5xl shadow-xl">
          {recentlyUnlocked.icon}
        </div>

        <div>
          <h3 className="text-xl font-black text-stone-900">{recentlyUnlocked.title}</h3>
          <span className="text-xs font-bold text-stone-500">سطح {tierConfig.label}</span>
        </div>

        <p className="text-xs text-stone-600 font-medium leading-relaxed">{recentlyUnlocked.description}</p>

        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-around text-xs font-bold text-amber-900">
          <div>+{toPersianDigits(recentlyUnlocked.xpReward)} XP</div>
          <div>+{toPersianDigits(recentlyUnlocked.coinReward)} سکه</div>
          {recentlyUnlocked.gemReward > 0 && <div>+{toPersianDigits(recentlyUnlocked.gemReward)} الماس</div>}
        </div>

        <button
          onClick={clearRecentlyUnlocked}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer"
        >
          عالیه! (بستن)
        </button>
      </div>
    </div>
  );
};
