import React, { useState } from 'react';
import type { Achievement, UserAchievement } from '../../types/achievement';
import { AchievementBadge } from './AchievementBadge';
import { TIER_CONFIGS } from '../../data/achievements';
import { toJalaliDateString, toPersianDigits } from '../../utils/dateHelpers';
import { useAchievementStore } from '../../store/useAchievementStore';

interface Props {
  achievement: Achievement;
  userAchievement?: UserAchievement;
  onClose: () => void;
}

export const AchievementModal: React.FC<Props> = ({ achievement, userAchievement, onClose }) => {
  const [copied, setCopied] = useState(false);
  const togglePin = useAchievementStore((s) => s.togglePin);

  const unlocked = !!userAchievement?.unlockedAt;
  const isPinned = !!userAchievement?.isPinned;
  const currentProgress = userAchievement?.progress || 0;
  const progressPercent = Math.min(100, Math.round((currentProgress / achievement.requiredCount) * 100));
  const tierConfig = TIER_CONFIGS[achievement.tier];

  const handleShare = async () => {
    const text = `من دستاورد «${achievement.title}» را در اپلیکیشن Kinder World آزاد کردم! 🎉✨`;
    if (navigator.share) {
      try {
        await navigator.share({ title: achievement.title, text });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 dir-rtl">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-4 border border-stone-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-600 cursor-pointer"
        >
          ✕
        </button>

        <AchievementBadge achievement={achievement} unlocked={unlocked} progressPercent={progressPercent} size="lg" />

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200 mb-2">
            <span>{tierConfig.emoji}</span>
            <span>سطح {tierConfig.label}</span>
          </div>
          <h3 className="text-lg font-black text-stone-900">
            {achievement.secret && !unlocked ? 'دستاورد مخفی' : achievement.title}
          </h3>
        </div>

        <p className="text-xs text-stone-600 font-medium leading-relaxed">
          {achievement.secret && !unlocked ? 'شرایط آزادسازی این دستاورد پنهان است!' : achievement.description}
        </p>

        <div className="w-full bg-stone-50 border border-stone-200/80 rounded-2xl p-3 flex items-center justify-around text-xs font-bold text-stone-800">
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span>{toPersianDigits(achievement.xpReward)} XP</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🪙</span>
            <span>{toPersianDigits(achievement.coinReward)} سکه</span>
          </div>
          {achievement.gemReward > 0 && (
            <div className="flex items-center gap-1">
              <span>💎</span>
              <span>{toPersianDigits(achievement.gemReward)} الماس</span>
            </div>
          )}
        </div>

        {unlocked ? (
          <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 w-full">
            تاریخ دریافت: {toPersianDigits(toJalaliDateString(userAchievement.unlockedAt!))}
          </div>
        ) : (
          <div className="w-full flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-bold text-stone-600">
              <span>پیشرفت</span>
              <span>
                {toPersianDigits(currentProgress)} / {toPersianDigits(achievement.requiredCount)}
              </span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 w-full mt-2">
          {unlocked && (
            <button
              onClick={() => togglePin(achievement.id)}
              className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                isPinned
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
              }`}
            >
              {isPinned ? '📌 سنجاق شده' : '📌 سنجاق به پروفایل'}
            </button>
          )}

          <button
            onClick={handleShare}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            {copied ? '✓ کپی شد' : '🔗 اشتراک‌گذاری'}
          </button>
        </div>
      </div>
    </div>
  );
};
