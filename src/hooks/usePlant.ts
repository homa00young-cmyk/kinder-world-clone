import { useState, useEffect } from 'react';
import { loadPlantState, savePlantState, getPlantStage, type PlantState } from '../utils/plantStorage';

export function usePlant() {
  const [plantState, setPlantState] = useState<PlantState>(() => loadPlantState());

  useEffect(() => {
    savePlantState(plantState);
  }, [plantState]);

  const growPlant = () => {
    setPlantState((prev) => {
      const nextStageIndex = Math.min(prev.stageIndex + 1, 2);
      return {
        stageIndex: nextStageIndex,
        completedExercisesCount: prev.completedExercisesCount + 1,
      };
    });
  };

  const currentStage = getPlantStage(plantState.stageIndex);

  const resetPlant = () => {
    const newState = { stageIndex: 0, completedExercisesCount: 0 };
    setPlantState(newState);
  };

  return {
    stageIndex: plantState.stageIndex,
    completedExercisesCount: plantState.completedExercisesCount,
    currentStage,
    growPlant,
    resetPlant,
  };
}
