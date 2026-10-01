import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useGamificationStore } from '../../store/useGamificationStore';
import { usePlantStore } from '../../store/usePlantStore';
import { toPersianDigits } from '../../utils/dateHelpers';

interface Props {
  boxType: 'bronze' | 'silver' | 'gold';
  onClose: () => void;
}

export const LuckyBox: React.FC<Props> = ({ boxType, onClose }) => {
  const [opening, setOpening] = useState(false);
  const [reward, setReward] = useState<{ name: string; icon: string; amount: string } | null>(null);

  const addCoins = useGamificationStore((s) => s.addCoins);
  const addGems = useGamificationStore((s) => s.addGems);
  const addXP = usePlantStore((s) => s.addXP);

  const handleOpen = () => {
    setOpening(true);

    setTimeout(() => {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });

      let rewardData = { name: '۵۰ سکه طلایی', icon: '🪙', amount: '۵۰ سکه' };

      if (boxType === 'bronze') {
        const coinAmt = 50 + Math.floor(Math.random() * 50);
        addCoins(coinAmt);
        rewardData = { name: `${coinAmt} سکه`, icon: '🪙', amount: `${coinAmt} سکه` };
      } else if (boxType === 'silver') {
        const coinAmt = 150 + Math.floor(Math.random() * 100);
        const gemAmt = 10;
        addCoins(coinAmt);
        addGems(gemAmt);
        rewardData = { name: `${coinAmt} سکه + ۱۰ الماس`, icon: '💎', amount: `${coinAmt} سکه + ۱۰ الماس` };
      } else {
        const gemAmt = 30 + Math.floor(Math.random() * 20);
        addGems(gemAmt);
        addXP(200);
        rewardData = { name: `${gemAmt} الماس + ۲۰۰ XP`, icon: '👑', amount: `${gemAmt} الماس + ۲۰۰ XP` };
      }

      setReward(rewardData);
      setOpening(false);
    }, 1500);
  };

  const boxTitles = {
    bronze: 'جعبه برنزی شانس',
    silver: 'جعبه نقره‌ای شانس',
    gold: 'جعبه طلایی شاهانه',
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-4 dir-rtl">
      <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl flex flex-col items-center text-center gap-4 border border-stone-100 relative">
        <h3 className="text-base font-black text-stone-900">{boxTitles[boxType]}</h3>

        {!reward ? (
          <div className="flex flex-col items-center gap-4 my-4">
            <div className={`text-6xl ${opening ? 'animate-bounce' : 'hover:scale-110 transition-transform cursor-pointer'}`}>
              📦
            </div>
            <p className="text-xs text-stone-500">برای باز کردن جعبه شانس دکمه زیر را فشار دهید!</p>
            <button
              onClick={handleOpen}
              disabled={opening}
              className="py-3 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer"
            >
              {opening ? 'در حال گشودن...' : 'گشودن جعبه 🎁'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 my-2 animate-bounceIn">
            <div className="text-6xl p-4 bg-amber-50 rounded-full border border-amber-200">
              {reward.icon}
            </div>
            <div>
              <div className="text-xs text-stone-500">پاداش شما:</div>
              <div className="text-lg font-black text-emerald-800">{toPersianDigits(reward.amount)}</div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer"
            >
              دریافت پاداش ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
