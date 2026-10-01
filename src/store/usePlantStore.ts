import { create } from 'zustand';
import type { PlantSpeciesConfig, PlantStageConfig, WeatherType } from '../types/plant';
import { PLANT_SPECIES, getStageByXP, getNextStage } from '../data/plants';

const V2_STORAGE_KEY = 'kinder_world_plant_state_v2';
const V1_STORAGE_KEY = 'kinder_world_plant_state_v1';

export interface PlantStoreState {
  speciesId: string;
  totalXP: number;
  completedExercisesCount: number;
  health: number; // 20 - 100
  lastWateredDate: string | null; // YYYY-MM-DD
  lastActiveDate: string | null; // YYYY-MM-DD
  completedExerciseIds: string[];

  // Actions
  waterPlant: () => void;
  addXP: (baseXP: number, exerciseId?: string, mood?: string) => { xpGained: number; bonusGained: number; newTotalXP: number; levelUp: boolean };
  switchSpecies: (speciesId: string) => void;
  resetPlant: () => void;

  // Selectors / Helpers
  getSpecies: () => PlantSpeciesConfig;
  getStage: () => PlantStageConfig;
  getNextStageInfo: () => { nextStage: PlantStageConfig | null; xpNeeded: number; progressPercent: number };
  getWeather: () => WeatherType;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

function calculateDaysDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// Migration & Initial load function
function loadInitialState() {
  const today = getTodayString();
  let defaultData = {
    speciesId: 'sunflower',
    totalXP: 0,
    completedExercisesCount: 0,
    health: 100,
    lastWateredDate: today,
    lastActiveDate: today,
    completedExerciseIds: [] as string[],
  };

  try {
    const v2Saved = localStorage.getItem(V2_STORAGE_KEY);
    if (v2Saved) {
      const parsed = JSON.parse(v2Saved);
      defaultData = { ...defaultData, ...parsed };

      // Apply health decay if days were missed
      if (defaultData.lastActiveDate && defaultData.lastActiveDate !== today) {
        const daysMissed = calculateDaysDifference(defaultData.lastActiveDate, today);
        if (daysMissed > 0) {
          const healthDecay = daysMissed * 10;
          defaultData.health = Math.max(20, defaultData.health - healthDecay);
        }
      }
      defaultData.lastActiveDate = today;
      return defaultData;
    }

    // Try migrating V1 legacy storage
    const v1Saved = localStorage.getItem(V1_STORAGE_KEY);
    if (v1Saved) {
      const parsedV1 = JSON.parse(v1Saved);
      const stageIndex = typeof parsedV1.stageIndex === 'number' ? parsedV1.stageIndex : 0;
      const count = typeof parsedV1.completedExercisesCount === 'number' ? parsedV1.completedExercisesCount : 0;

      let initialXP = 0;
      if (stageIndex === 1) initialXP = 25; // Seedling
      if (stageIndex >= 2) initialXP = 200; // Mature tree
      initialXP = Math.max(initialXP, count * 10);

      defaultData.totalXP = initialXP;
      defaultData.completedExercisesCount = count;
    }
  } catch (error) {
    console.error('Error loading plant state from localStorage', error);
  }

  return defaultData;
}

function persistState(state: {
  speciesId: string;
  totalXP: number;
  completedExercisesCount: number;
  health: number;
  lastWateredDate: string | null;
  lastActiveDate: string | null;
  completedExerciseIds: string[];
}) {
  try {
    localStorage.setItem(V2_STORAGE_KEY, JSON.stringify(state));

    // Save legacy V1 format for backwards compatibility
    const currentStage = getStageByXP(state.totalXP);
    let legacyStageIndex = 0;
    if (currentStage.stage >= 6) legacyStageIndex = 2; // Tree
    else if (currentStage.stage >= 3) legacyStageIndex = 1; // Seedling/Sprout

    localStorage.setItem(
      V1_STORAGE_KEY,
      JSON.stringify({
        stageIndex: legacyStageIndex,
        completedExercisesCount: state.completedExercisesCount,
      })
    );
  } catch (error) {
    console.error('Error persisting plant state', error);
  }
}

export const usePlantStore = create<PlantStoreState>((set, get) => {
  const initial = loadInitialState();

  return {
    ...initial,

    getSpecies: () => {
      const { speciesId } = get();
      return PLANT_SPECIES.find((s) => s.id === speciesId) || PLANT_SPECIES[0];
    },

    getStage: () => {
      const { totalXP } = get();
      return getStageByXP(totalXP);
    },

    getNextStageInfo: () => {
      const { totalXP } = get();
      const currentStage = getStageByXP(totalXP);
      const nextStage = getNextStage(currentStage.stage);

      if (!nextStage) {
        return { nextStage: null, xpNeeded: 0, progressPercent: 100 };
      }

      const currentStageMinXP = currentStage.requiredXP;
      const nextStageXP = nextStage.requiredXP;
      const totalRange = nextStageXP - currentStageMinXP;
      const currentProgress = totalXP - currentStageMinXP;
      const progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / totalRange) * 100)));

      return {
        nextStage,
        xpNeeded: nextStageXP - totalXP,
        progressPercent,
      };
    },

    getWeather: () => {
      const month = new Date().getMonth(); // 0 - 11
      if (month === 11 || month === 0 || month === 1) return 'snowy';
      if (month >= 2 && month <= 4) return 'rainy';
      if (month >= 5 && month <= 7) return 'sunny';
      return 'windy';
    },

    waterPlant: () => {
      const today = getTodayString();
      set((state) => {
        const newHealth = Math.min(100, state.health + 30);
        const newState = {
          ...state,
          health: newHealth,
          lastWateredDate: today,
          lastActiveDate: today,
        };
        persistState(newState);
        return newState;
      });
    },

    addXP: (baseXP: number, exerciseId?: string, mood?: string) => {
      const state = get();
      const species = state.getSpecies();

      // Calculate species bonus
      let bonusMultiplier = 1.0;
      if (species.mechanic.type === 'hard_day_bonus' && (mood === 'مضطرب' || mood === 'عصبانی')) {
        bonusMultiplier = species.mechanic.multiplier;
      } else if (species.mechanic.type === 'anxious_day_bonus' && mood === 'مضطرب') {
        bonusMultiplier = species.mechanic.multiplier;
      } else if (species.mechanic.type === 'grateful_day_bonus' && mood === 'سپاسگزار') {
        bonusMultiplier = species.mechanic.multiplier;
      } else if (species.mechanic.type === 'new_exercise_bonus' && exerciseId && !state.completedExerciseIds.includes(exerciseId)) {
        bonusMultiplier = species.mechanic.multiplier;
      }

      const totalXPGained = Math.round(baseXP * bonusMultiplier);
      const bonusGained = totalXPGained - baseXP;

      const oldStage = getStageByXP(state.totalXP);
      const newTotalXP = state.totalXP + totalXPGained;
      const newStage = getStageByXP(newTotalXP);
      const levelUp = newStage.stage > oldStage.stage;

      const updatedExerciseIds = exerciseId && !state.completedExerciseIds.includes(exerciseId)
        ? [...state.completedExerciseIds, exerciseId]
        : state.completedExerciseIds;

      const today = getTodayString();
      const newState = {
        ...state,
        totalXP: newTotalXP,
        completedExercisesCount: state.completedExercisesCount + 1,
        health: Math.min(100, state.health + 10), // Small health boost on completing exercise
        lastActiveDate: today,
        completedExerciseIds: updatedExerciseIds,
      };

      set(newState);
      persistState(newState);

      return {
        xpGained: totalXPGained,
        bonusGained,
        newTotalXP,
        levelUp,
      };
    },

    switchSpecies: (speciesId: string) => {
      const exists = PLANT_SPECIES.some((s) => s.id === speciesId);
      if (!exists) return;

      set((state) => {
        const newState = { ...state, speciesId };
        persistState(newState);
        return newState;
      });
    },

    resetPlant: () => {
      const today = getTodayString();
      const newState = {
        speciesId: 'sunflower',
        totalXP: 0,
        completedExercisesCount: 0,
        health: 100,
        lastWateredDate: today,
        lastActiveDate: today,
        completedExerciseIds: [],
      };
      set(newState);
      persistState(newState);
    },
  };
});
