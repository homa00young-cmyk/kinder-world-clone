import React, { useState } from 'react';
import { SHOP_ITEMS } from '../data/shopItems';
import type { ShopCategory, ShopItem } from '../types/shop';
import { ShopItemCard } from '../components/shop/ShopItemCard';
import { PurchaseModal } from '../components/shop/PurchaseModal';
import { CurrencyDisplay } from '../components/gamification/CurrencyDisplay';

export const ShopPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | 'ALL'>('ALL');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  const categories: { key: ShopCategory | 'ALL'; label: string; emoji: string }[] = [
    { key: 'ALL', label: 'همه آیتم‌ها', emoji: '🛍️' },
    { key: 'boosters', label: 'تقویت‌کننده‌ها', emoji: '⚡' },
    { key: 'lucky_boxes', label: 'جعبه شانس', emoji: '📦' },
    { key: 'plants', label: 'گیاهان جدید', emoji: '🌱' },
    { key: 'backgrounds', label: 'پس‌زمینه باغ', emoji: '🏡' },
    { key: 'sounds', label: 'صداهای طبیعت', emoji: '🎧' },
  ];

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 p-4 md:p-6 pb-24 dir-rtl">
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-black text-stone-800 tracking-tight flex items-center gap-2">
              <span>🛍️</span> فروشگاه و گنجینه باغ
            </h2>
            <p className="text-xs text-stone-500 font-medium">خرید گونه‌های گیاهی جدید، پس‌زمینه‌ها، صداها و تقویتی‌ها</p>
          </div>

          <CurrencyDisplay />
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl p-5 text-white shadow-md flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="text-4xl p-2 bg-white/20 rounded-2xl backdrop-blur-xs">🔥</div>
          <div>
            <h3 className="text-base font-black">پیشنهادات ویژه روزانه (تا ۳۰٪ تخفیف)</h3>
            <p className="text-xs text-amber-100">فرصت محدود برای خرید جعبه‌های شانس و تقویت‌کننده‌ها با تخفیف ویژه</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs font-bold text-stone-700">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-2xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === cat.key
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <ShopItemCard key={item.id} item={item} onSelect={(i) => setSelectedItem(i)} />
        ))}
      </div>

      {selectedItem && <PurchaseModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
};

export default ShopPage;
