import { create } from 'zustand';
import type { ShopItem } from '../types/shop';

const SHOP_STORAGE_KEY = 'kinder_world_shop_v1';

export interface ActiveBooster {
  id: string;
  type: 'xp_2x' | 'xp_5x' | 'auto_water';
  multiplier: number;
  expiresAt: string;
}

export interface ShopStoreState {
  ownedItemIds: string[];
  activeBackgroundId: string;
  activeSoundId: string | null;
  activeBoosters: ActiveBooster[];

  purchaseItem: (item: ShopItem) => boolean;
  isOwned: (itemId: string) => boolean;
  setActiveBackground: (bgId: string) => void;
  setActiveSound: (soundId: string | null) => void;
  activateBooster: (boosterId: string, durationMinutes: number, multiplier: number) => void;
  getActiveXpMultiplier: () => number;
}

function loadInitialShopState() {
  const defaultState = {
    ownedItemIds: ['bg-meadow', 'plant-sunflower'],
    activeBackgroundId: 'bg-meadow',
    activeSoundId: null as string | null,
    activeBoosters: [] as ActiveBooster[],
  };

  try {
    const saved = localStorage.getItem(SHOP_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultState, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load shop state', e);
  }

  return defaultState;
}

function persistShopState(state: unknown) {
  try {
    localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to persist shop state', e);
  }
}

export const useShopStore = create<ShopStoreState>((set, get) => {
  const initial = loadInitialShopState();

  return {
    ...initial,

    isOwned: (itemId: string) => {
      const { ownedItemIds } = get();
      return ownedItemIds.includes(itemId);
    },

    purchaseItem: (item: ShopItem) => {
      const { ownedItemIds } = get();
      if (ownedItemIds.includes(item.id)) return true;

      set((state) => {
        const nextOwned = [...state.ownedItemIds, item.id];
        let nextBg = state.activeBackgroundId;
        if (item.category === 'backgrounds') nextBg = item.id;

        const newState = {
          ...state,
          ownedItemIds: nextOwned,
          activeBackgroundId: nextBg,
        };
        persistShopState(newState);
        return newState;
      });
      return true;
    },

    setActiveBackground: (bgId: string) => {
      set((state) => {
        const newState = { ...state, activeBackgroundId: bgId };
        persistShopState(newState);
        return newState;
      });
    },

    setActiveSound: (soundId: string | null) => {
      set((state) => {
        const newState = { ...state, activeSoundId: soundId };
        persistShopState(newState);
        return newState;
      });
    },

    activateBooster: (boosterId: string, durationMinutes: number, multiplier: number) => {
      const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
      const type: 'xp_2x' | 'xp_5x' | 'auto_water' = boosterId.includes('5x') ? 'xp_5x' : boosterId.includes('auto') ? 'auto_water' : 'xp_2x';

      set((state) => {
        const newBooster: ActiveBooster = { id: boosterId, type, multiplier, expiresAt };
        const nextBoosters: ActiveBooster[] = [...state.activeBoosters, newBooster];
        const newState = { ...state, activeBoosters: nextBoosters };
        persistShopState(newState);
        return newState;
      });
    },

    getActiveXpMultiplier: () => {
      const { activeBoosters } = get();
      const now = new Date().getTime();
      let maxMultiplier = 1.0;

      activeBoosters.forEach((b) => {
        if (new Date(b.expiresAt).getTime() > now) {
          if (b.multiplier > maxMultiplier) {
            maxMultiplier = b.multiplier;
          }
        }
      });

      return maxMultiplier;
    },
  };
});
