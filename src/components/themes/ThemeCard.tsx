import React from 'react';
import type { Theme } from '../../types/theme';
import { useThemeStore } from '../../store/useThemeStore';
import { useGamificationStore } from '../../store/useGamificationStore';
import { toPersianDigits } from '../../utils/dateHelpers';

interface Props {
  theme: Theme;
  onSelect: (theme: Theme) => void;
}

export const ThemeCard: React.FC<Props> = ({ theme }) => {
  const currentThemeId = useThemeStore((s) => s.currentThemeId);
  const unlockedThemeIds = useThemeStore((s) => s.unlockedThemeIds);
  const unlockTheme = useThemeStore((s) => s.unlockTheme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const gems = useGamificationStore((s) => s.gems);
  const deductGems = useGamificationStore((s) => s.deductGems);

  const isCurrent = currentThemeId === theme.id;
  const isUnlocked = unlockedThemeIds.includes(theme.id);

  const handleClick = () => {
    if (isUnlocked) {
      setTheme(theme.id);
      return;
    }

    if (theme.premium && theme.priceGems) {
      if (gems >= theme.priceGems) {
        if (deductGems(theme.priceGems)) {
          unlockTheme(theme.id);
          setTheme(theme.id);
          alert(`تم «${theme.name}» با موفقیت آزادسازی و فعال شد! 🎨`);
        }
      } else {
        alert('الماس کافی ندارید!');
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-3xl p-4 border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-2xs hover:shadow-md relative overflow-hidden ${
        isCurrent
          ? 'border-emerald-500 ring-2 ring-emerald-500/30'
          : isUnlocked
          ? 'border-stone-200 hover:border-stone-300'
          : 'border-purple-200 bg-purple-50/10'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{theme.emoji}</span>
          <div>
            <h4 className="text-xs font-bold text-stone-900">{theme.name}</h4>
            <span className="text-[10px] text-stone-400 font-semibold">{theme.isDark ? 'حالت تاریک' : 'حالت روشن'}</span>
          </div>
        </div>

        {isCurrent ? (
          <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded-lg border border-emerald-200">
            ✓ فعال
          </span>
        ) : theme.premium && !isUnlocked ? (
          <span className="bg-purple-100 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-purple-200 flex items-center gap-1">
            <span>💎</span>
            <span>{toPersianDigits(theme.priceGems || 50)}</span>
          </span>
        ) : null}
      </div>

      <div className="h-6 rounded-xl flex overflow-hidden border border-stone-200/60 shadow-inner">
        <div className="flex-1" style={{ backgroundColor: theme.colors.primary }} />
        <div className="flex-1" style={{ backgroundColor: theme.colors.secondary }} />
        <div className="flex-1" style={{ backgroundColor: theme.colors.accent }} />
        <div className="flex-1" style={{ backgroundColor: theme.colors.background }} />
      </div>

      <button
        className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all ${
          isCurrent
            ? 'bg-emerald-600 text-white'
            : isUnlocked
            ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        {isCurrent ? 'در حال استفاده' : isUnlocked ? 'انتخاب تم' : `خرید (${toPersianDigits(theme.priceGems || 50)} 💎)`}
      </button>
    </div>
  );
};
