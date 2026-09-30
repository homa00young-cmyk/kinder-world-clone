export type PlantStage = '🌱' | '🌿' | '🌳';

export interface PlantState {
  stageIndex: number;
  completedExercisesCount: number;
}

const STORAGE_KEY = 'kinder_world_plant_state_v1';

export const PLANT_STAGES: { emoji: PlantStage; label: string; description: string }[] = [
  { emoji: '🌱', label: 'جوانه', description: 'گیاه کوچک شما تازه سر از خاک برآورده است' },
  { emoji: '🌿', label: 'نهال', description: 'گیاه شما در حال رشد و بالندگی است' },
  { emoji: '🌳', label: 'درخت تنومند', description: 'گیاه شما به درختی استوار و زیبا تبدیل شده است' }
];

export function getPlantStage(stageIndex: number): { emoji: PlantStage; label: string; description: string } {
  const boundedIndex = Math.min(Math.max(0, stageIndex), PLANT_STAGES.length - 1);
  return PLANT_STAGES[boundedIndex];
}

export function loadPlantState(): PlantState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed.stageIndex === 'number' && typeof parsed.completedExercisesCount === 'number') {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading plant state from localStorage', error);
  }
  return { stageIndex: 0, completedExercisesCount: 0 };
}

export function savePlantState(state: PlantState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving plant state to localStorage', error);
  }
}
