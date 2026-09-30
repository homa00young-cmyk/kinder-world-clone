import { useState } from 'react';
import { PlantDisplay } from './components/PlantDisplay';
import { MoodSelector } from './components/MoodSelector';
import { ExerciseModal } from './components/ExerciseModal';
import { usePlant } from './hooks/usePlant';
import type { MoodType } from './types/moods';

export function App() {
  const { currentStage, stageIndex, growPlant, resetPlant } = usePlant();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [showGrowthCelebration, setShowGrowthCelebration] = useState(false);

  const handleSelectMood = (mood: MoodType) => {
    setSelectedMood(mood);
  };

  const handleCompleteExercise = () => {
    growPlant();
    setSelectedMood(null);
    setShowGrowthCelebration(true);
    setTimeout(() => {
      setShowGrowthCelebration(false);
    }, 3000);
  };

  const handleCancelExercise = () => {
    setSelectedMood(null);
  };

  return (
    <main className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-stone-100 flex flex-col items-center gap-8 relative z-10">
        <header className="text-center space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-800 tracking-tight">
            Kinder World
          </h1>
          <p className="text-xs text-stone-500 font-medium">گوشه‌ای آرام برای ذهن شما</p>
        </header>

        {showGrowthCelebration && (
          <div className="w-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl text-center text-sm font-medium animate-bounce">
            🎉 آفرین! تمرین انجام شد و گیاه شما یک مرحله رشد کرد! 🌱✨
          </div>
        )}

        <PlantDisplay
          emoji={currentStage.emoji}
          label={currentStage.label}
          description={currentStage.description}
          stageIndex={stageIndex}
        />

        <MoodSelector onSelectMood={handleSelectMood} />

        {stageIndex > 0 && (
          <button
            onClick={resetPlant}
            className="text-xs text-stone-400 hover:text-stone-600 underline transition-colors pt-2 cursor-pointer"
          >
            شروع مجدد رشد گیاه
          </button>
        )}
      </div>

      {selectedMood && (
        <ExerciseModal
          mood={selectedMood}
          onComplete={handleCompleteExercise}
          onCancel={handleCancelExercise}
        />
      )}
    </main>
  );
}

export default App;
