import React from 'react';
import { useGamificationStore } from '../../store/useGamificationStore';
import { toPersianDigits } from '../../utils/dateHelpers';

export const StreakProtectionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const coins = useGamificationStore((s) => s.coins);
  const streakFreezeCount = useGamificationStore((s) => s.streakFreezeCount);
  const buyStreakFreeze = useGamificationStore((s) => s.buyStreakFreeze);

  const handleBuy = () => {
    const success = buyStreakFreeze();
    if (success) {
      alert('یخچالی استریک با موفقیت خریداری شد! 🧊');
      onClose();
    } else {
      alert('سکه کافی ندارید! (نیاز به ۲۰۰ سکه)');
    }
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

        <div className="text-5xl p-3 bg-sky-50 rounded-2xl border border-sky-200">🧊</div>

        <h3 className="text-base font-black text-stone-900">محافظت از استریک (Streak Freeze)</h3>

        <p className="text-xs text-stone-600 font-medium leading-relaxed">
          با داشتن یخچالی استریک، اگر یک روز تمرین خود را فراموش کنید، زنجیره روزانه (Streak) شما قطع نخواهد شد!
        </p>

        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 text-xs font-bold text-sky-900 w-full">
          موجودی یخچالی شما: {toPersianDigits(streakFreezeCount)} عدد
        </div>

        <button
          onClick={handleBuy}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>خرید ۱ یخچالی (۲۰۰ سکه)</span>
          <span className="text-[10px] bg-amber-700/30 px-2 py-0.5 rounded-lg">موجودی: {toPersianDigits(coins)} 🪙</span>
        </button>
      </div>
    </div>
  );
};
