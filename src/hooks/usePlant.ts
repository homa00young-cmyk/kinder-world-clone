import { usePlantStore } from '../store/usePlantStore';

export function usePlant() {
  const store = usePlantStore();
  const stage = store.getStage();
  const nextInfo = store.getNextStageInfo();

  // Legacy stageIndex mapping for backwards compatibility (0, 1, 2)
  let legacyStageIndex = 0;
  if (stage.stage >= 6) legacyStageIndex = 2; // Tree
  else if (stage.stage >= 3) legacyStageIndex = 1; // Seedling/Sprout

  const growPlant = () => {
    store.addXP(15);
  };

  return {
    stageIndex: legacyStageIndex,
    completedExercisesCount: store.completedExercisesCount,
    currentStage: {
      emoji: stage.emoji,
      label: stage.label,
      description: stage.description,
    },
    growPlant,
    resetPlant: store.resetPlant,

    // V2 Extended features
    store,
    stageLevel: stage.stage,
    totalXP: store.totalXP,
    health: store.health,
    species: store.getSpecies(),
    nextStageInfo: nextInfo,
    waterPlant: store.waterPlant,
  };
}
