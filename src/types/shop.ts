export type ShopCategory = 'plants' | 'themes' | 'backgrounds' | 'sounds' | 'boosters' | 'lucky_boxes';

export type CurrencyType = 'coins' | 'gems';

export interface ShopItem {
  id: string;
  name: string;
  nameEn?: string;
  category: ShopCategory;
  description: string;
  price: number;
  currency: CurrencyType;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  previewUrl?: string;
  previewColor?: string;
  targetId?: string;
  isPopular?: boolean;
  discountPercent?: number;
}
