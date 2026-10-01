import React from 'react';
import type { Achievement, UserAchievement } from '../../types/achievement';
import { AchievementBadge } from './AchievementBadge';
import { toPersianDigits } from '../../utils/dateHelpers';

interface Props {
  achievement: Achievement;
  userAchievement?: UserAchievement;
  onClick: () => void;
}

export const AchievementCard: React.FC<Props> = ({ achievement, userAchievement, onClick }) => {
  const unlocked = !!userAchievement?.unlockedAt;
  const currentProgress = userAchievement?.progress || 0;
  const progressPercent = Math.min(100, Math.round((currentProgress / achievement.requiredCount) * 100));

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-3xl p-4 border transition-all cursor-pointer flex flex-col items-center text-center gap-2 relative overflow-hidden ${
        unlocked
          ? 'border-emerald-200/80 shadow-sm hover:shadow-md hover:border-emerald-300'
          : 'border-stone-200/60 opacity-80 hover:opacity-100 hover:border-stone-300'
      }`}
    >
      <AchievementBadge achievement={achievement} unlocked={unlocked} progressPercent={progressPercent} size="md" />

      <h4 className="text-xs font-bold text-stone-900 line-clamp-1 mt-1">
        {achievement.secret && !unlocked ? 'دستاورد مخفی' : achievement.title}
      </h4>

      {unlocked ? (
        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
          ✓ باز شده
        </span>
      ) : (
        <div className="w-full flex flex-col gap-1 mt-1">
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="text-[9px] font-semibold text-stone-500">
            {toPersianDigits(currentProgress)} / {toPersianDigits(achievement.requiredCount)}
          </span>
        </div>
      )}
    </div>
  );
};
