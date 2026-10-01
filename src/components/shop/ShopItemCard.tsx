import React from 'react';
import type { ShopItem } from '../../types/shop';
import { useShopStore } from '../../store/useShopStore';
import { useGamificationStore } from '../../store/useGamificationStore';
import { toPersianDigits } from '../../utils/dateHelpers';

interface Props {
  item: ShopItem;
  onSelect: (item: ShopItem) => void;
}

export const ShopItemCard: React.FC<Props> = ({ item, onSelect }) => {
  const isOwned = useShopStore((s) => s.isOwned(item.id));
  const activeBg = useShopStore((s) => s.activeBackgroundId);
  const coins = useGamificationStore((s) => s.coins);
  const gems = useGamificationStore((s) => s.gems);

  const isActive = activeBg === item.id;
  const canAfford = item.currency === 'coins' ? coins >= item.price : gems >= item.price;

  const rarityBorders: Record<string, string> = {
    common: 'border-stone-200',
    rare: 'border-sky-300 bg-sky-50/20',
    epic: 'border-purple-300 bg-purple-50/20',
    legendary: 'border-amber-300 bg-amber-50/20',
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`bg-white rounded-3xl p-4 border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-2xs hover:shadow-md relative overflow-hidden ${
        rarityBorders[item.rarity] || 'border-stone-200'
      }`}
    >
      <div className="flex items-center justify-between text-[10px] font-bold">
        {item.isPopular && (
          <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-200">
            🔥 محبوب
          </span>
        )}
        {isOwned ? (
          <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-lg border border-emerald-200 font-extrabold mr-auto">
            {isActive ? '✓ فعال' : '✓ خریداری شده'}
          </span>
        ) : (
          <span className="text-stone-400 mr-auto">قفل</span>
        )}
      </div>

      <div className="flex flex-col items-center text-center gap-2">
        <div className="text-4xl p-3 bg-stone-50 rounded-2xl border border-stone-100 shadow-2xs">
          {item.icon}
        </div>
        <div>
          <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.name}</h4>
          <p className="text-[10px] text-stone-500 font-medium line-clamp-2 mt-0.5">{item.description}</p>
        </div>
      </div>

      <div className="pt-2 border-t border-stone-100 flex items-center justify-center">
        {isOwned ? (
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 w-full py-1.5 rounded-xl text-center border border-emerald-200">
            {isActive ? 'در حال استفاده' : 'انتخاب و استفاده'}
          </span>
        ) : (
          <button
            className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              canAfford
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>{toPersianDigits(item.price)}</span>
            <span>{item.currency === 'coins' ? '🪙' : '💎'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
