import React from 'react';
import { useGamificationStore } from '../../store/useGamificationStore';
import { usePlantStore } from '../../store/usePlantStore';
import { toPersianDigits } from '../../utils/dateHelpers';

export const XPBar: React.FC = () => {
  const level = useGamificationStore((s) => s.level);
  const prestigeLevel = useGamificationStore((s) => s.prestigeLevel);
  const totalXP = usePlantStore((s) => s.totalXP);

  const currentLevelXP = Math.floor(100 * Math.pow(level, 1.5));
  const nextLevelXP = Math.floor(100 * Math.pow(level + 1, 1.5));
  const xpInRange = Math.max(0, totalXP - currentLevelXP);
  const rangeNeeded = Math.max(1, nextLevelXP - currentLevelXP);
  const progressPercent = Math.min(100, Math.round((xpInRange / rangeNeeded) * 100));

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-stone-100 flex items-center gap-3 shadow-2xs dir-rtl">
      <div className="flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-black text-xs w-10 h-10 rounded-xl shadow-xs">
        <span className="text-[9px] opacity-80 font-normal">سطح</span>
        <span>{toPersianDigits(level)}</span>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between items-center text-xs font-bold text-stone-700">
          <span>{prestigeLevel > 0 ? `پرستیژ +${toPersianDigits(prestigeLevel)}` : `سطح ${toPersianDigits(level)}`}</span>
          <span className="text-[10px] text-stone-500">
            {toPersianDigits(totalXP)} / {toPersianDigits(nextLevelXP)} XP
          </span>
        </div>

        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
