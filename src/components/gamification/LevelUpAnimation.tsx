import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGamificationStore } from '../../store/useGamificationStore';
import { toPersianDigits } from '../../utils/dateHelpers';

interface Props {
  newLevel: number;
  rewards?: { coins: number; gems: number };
  onClose: () => void;
}

export const LevelUpAnimation: React.FC<Props> = ({ newLevel, rewards, onClose }) => {
  const level = useGamificationStore((s) => s.level);
  const activatePrestige = useGamificationStore((s) => s.activatePrestige);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4 dir-rtl animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-4 border-2 border-amber-300 animate-bounceIn">
        <div className="text-4xl p-4 bg-amber-100 rounded-full animate-pulse shadow-inner">
          👑
        </div>

        <h3 className="text-2xl font-black text-amber-900">سطح جدید: {toPersianDigits(newLevel)}!</h3>

        <p className="text-xs text-stone-600 font-medium">
          تبریک! تمرکز و پایبندی شما به ثمر نشست. ذهن شما قوی‌تر و آرام‌تر شده است.
        </p>

        {rewards && (
          <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-around text-xs font-bold text-amber-900">
            <div>🪙 +{toPersianDigits(rewards.coins)} سکه</div>
            <div>💎 +{toPersianDigits(rewards.gems)} الماس</div>
          </div>
        )}

        {level >= 100 && (
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 flex flex-col gap-2 w-full text-purple-900 text-xs">
            <span className="font-bold">✨ وضعیت پرستیژ آماده فعال‌سازی است!</span>
            <p className="text-[11px] text-purple-700">با بازنشانی سطح به ۱، ۱۰٪ پاداش دائمی XP دریافت کنید.</p>
            <button
              onClick={() => {
                activatePrestige();
                onClose();
              }}
              className="py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              فعال‌سازی حالت پرستیژ
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer"
        >
          ادامه مسیر ✨
        </button>
      </div>
    </div>
  );
};
