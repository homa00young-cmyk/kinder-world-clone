import React from 'react';
import type { Achievement } from '../../types/achievement';
import { TIER_CONFIGS } from '../../data/achievements';

interface Props {
  achievement: Achievement;
  unlocked: boolean;
  progressPercent?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const AchievementBadge: React.FC<Props> = ({
  achievement,
  unlocked,
  size = 'md',
}) => {
  const tierConfig = TIER_CONFIGS[achievement.tier];

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <div
        className={`rounded-full flex items-center justify-center p-1 transition-all ${
          unlocked
            ? `bg-gradient-to-tr ${tierConfig.bgGradient} border-2 ${tierConfig.borderColor} shadow-lg shadow-${achievement.tier}`
            : 'bg-stone-200 border-2 border-stone-300 opacity-60'
        }`}
      >
        <div
          className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-white/90 backdrop-blur-xs relative overflow-hidden`}
        >
          {achievement.secret && !unlocked ? (
            <span className="text-stone-400">❓</span>
          ) : unlocked ? (
            <span className="animate-pulse">{achievement.icon}</span>
          ) : (
            <span className="filter grayscale opacity-60">{achievement.icon}</span>
          )}

          {!unlocked && !achievement.secret && (
            <div className="absolute inset-0 bg-stone-900/20 flex items-center justify-center text-xs">
              🔒
            </div>
          )}
        </div>
      </div>

      {unlocked && (
        <span className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full p-0.5 shadow-md border border-stone-200">
          {tierConfig.emoji}
        </span>
      )}
    </div>
  );
};
