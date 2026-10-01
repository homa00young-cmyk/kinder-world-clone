import React from 'react';
import { useGamificationStore } from '../../store/useGamificationStore';
import { toPersianDigits } from '../../utils/dateHelpers';

export const CurrencyDisplay: React.FC = () => {
  const coins = useGamificationStore((s) => s.coins);
  const gems = useGamificationStore((s) => s.gems);
  const streak = useGamificationStore((s) => s.currentStreak);

  return (
    <div className="flex items-center gap-2 text-xs font-bold dir-rtl">
      <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-xl shadow-2xs">
        <span className="text-sm">🔥</span>
        <span>{toPersianDigits(streak)}</span>
      </div>

      <div className="flex items-center gap-1 bg-yellow-50 text-amber-900 border border-yellow-200/80 px-2.5 py-1 rounded-xl shadow-2xs">
        <span className="text-sm">🪙</span>
        <span>{toPersianDigits(coins)}</span>
      </div>

      <div className="flex items-center gap-1 bg-purple-50 text-purple-900 border border-purple-200/80 px-2.5 py-1 rounded-xl shadow-2xs">
        <span className="text-sm">💎</span>
        <span>{toPersianDigits(gems)}</span>
      </div>
    </div>
  );
};
