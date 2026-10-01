import React, { useState } from 'react';
import type { ShopItem } from '../../types/shop';
import { useShopStore } from '../../store/useShopStore';
import { useGamificationStore } from '../../store/useGamificationStore';
import { toPersianDigits } from '../../utils/dateHelpers';
import { LuckyBox } from '../gamification/LuckyBox';

interface Props {
  item: ShopItem;
  onClose: () => void;
}

export const PurchaseModal: React.FC<Props> = ({ item, onClose }) => {
  const [showLuckyBox, setShowLuckyBox] = useState(false);
  const isOwned = useShopStore((s) => s.isOwned(item.id));
  const purchaseItem = useShopStore((s) => s.purchaseItem);
  const setActiveBackground = useShopStore((s) => s.setActiveBackground);
  const activateBooster = useShopStore((s) => s.activateBooster);

  const coins = useGamificationStore((s) => s.coins);
  const gems = useGamificationStore((s) => s.gems);
  const deductCoins = useGamificationStore((s) => s.deductCoins);
  const deductGems = useGamificationStore((s) => s.deductGems);

  const canAfford = item.currency === 'coins' ? coins >= item.price : gems >= item.price;

  const handleAction = () => {
    if (isOwned) {
      if (item.category === 'backgrounds') {
        setActiveBackground(item.id);
        alert(`پس‌زمینه «${item.name}» فعال شد! 🏡`);
        onClose();
      }
      return;
    }

    if (item.category === 'lucky_boxes') {
      const paid = item.currency === 'coins' ? deductCoins(item.price) : deductGems(item.price);
      if (paid) {
        setShowLuckyBox(true);
      } else {
        alert('موجودی کافی نیست!');
      }
      return;
    }

    if (item.category === 'boosters') {
      const paid = item.currency === 'coins' ? deductCoins(item.price) : deductGems(item.price);
      if (paid) {
        const mult = item.id.includes('5x') ? 5 : 2;
        activateBooster(item.id, 60, mult);
        alert(`تقویت‌کننده «${item.name}» با موفقیت فعال شد! ⚡`);
        onClose();
      } else {
        alert('موجودی کافی نیست!');
      }
      return;
    }

    const paid = item.currency === 'coins' ? deductCoins(item.price) : deductGems(item.price);
    if (paid) {
      purchaseItem(item);
      alert(`«${item.name}» با موفقیت خریداری شد! 🎉`);
      onClose();
    } else {
      alert('موجودی برای خرید این آیتم کافی نیست!');
    }
  };

  if (showLuckyBox) {
    const boxType = item.id.includes('gold') ? 'gold' : item.id.includes('silver') ? 'silver' : 'bronze';
    return <LuckyBox boxType={boxType} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 dir-rtl">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-4 border border-stone-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-600 cursor-pointer"
        >
          ✕
        </button>

        <div className="text-5xl p-4 bg-stone-50 rounded-2xl border border-stone-100">{item.icon}</div>

        <div>
          <h3 className="text-lg font-black text-stone-900">{item.name}</h3>
          <p className="text-xs text-stone-500 font-medium mt-1 leading-relaxed">{item.description}</p>
        </div>

        {!isOwned && (
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3 flex items-center justify-around text-xs font-bold text-stone-800 w-full">
            <div>قیمت: {toPersianDigits(item.price)} {item.currency === 'coins' ? '🪙 سکه' : '💎 الماس'}</div>
            <div>
              موجودی: {toPersianDigits(item.currency === 'coins' ? coins : gems)}{' '}
              {item.currency === 'coins' ? '🪙' : '💎'}
            </div>
          </div>
        )}

        <button
          onClick={handleAction}
          disabled={!isOwned && !canAfford}
          className={`w-full py-3 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer ${
            isOwned
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : canAfford
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
          }`}
        >
          {isOwned ? 'استفاده و فعال‌سازی' : canAfford ? 'تایید و خرید' : 'موجودی ناکافی'}
        </button>
      </div>
    </div>
  );
};
