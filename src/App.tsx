import { useState } from 'react';
import { PlantDisplay } from './components/PlantDisplay';
import { MoodSelector } from './components/MoodSelector';
import { ExerciseModal } from './components/ExerciseModal';
import { InstallButton } from './components/InstallButton';
import { usePlantStore } from './store/usePlantStore';
import type { MoodType } from './types/moods';
import type { ExerciseItem } from './types/exercise';

export function App() {
  const resetPlant = usePlantStore((s) => s.resetPlant);
  const totalXP = usePlantStore((s) => s.totalXP);
  const completedCount = usePlantStore((s) => s.completedExercisesCount);

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  const handleSelectMood = (mood: MoodType) => {
    setSelectedMood(mood);
  };

  const handleCompleteExercise = (_exercise: ExerciseItem, xpGained: number, bonusGained: number) => {
    setSelectedMood(null);

    let msg = `🎉 آفرین! تمرین انجام شد و ${xpGained} XP پاداش گرفتید! 🌱✨`;
    if (bonusGained > 0) {
      msg += ` (${bonusGained} XP پاداش ویژه گونه)`;
    }
    setCelebrationMsg(msg);

    setTimeout(() => {
      setCelebrationMsg(null);
    }, 4000);
  };

  const handleCancelExercise = () => {
    setSelectedMood(null);
  };

  return (
    <main className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-stone-100 flex flex-col items-center gap-6 relative z-10">

        {/* Header */}
        <header className="text-center space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-800 tracking-tight">
            Kinder World
          </h1>
          <p className="text-xs text-stone-500 font-medium">گوشه‌ای آرام برای ذهن شما</p>
        </header>

        {/* Stats Strip */}
        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-stone-600 bg-stone-50 px-4 py-2 rounded-2xl border border-stone-100 w-full">
          <span>⭐ امتیاز کل: {totalXP} XP</span>
          <span>•</span>
          <span>🌱 تمرین‌های کامل شده: {completedCount}</span>
        </div>

        <InstallButton />

        {celebrationMsg && (
          <div className="w-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-center text-xs font-bold animate-bounce shadow-xs">
            {celebrationMsg}
          </div>
        )}

        {/* Main Plant Component */}
        <PlantDisplay />

        {/* Mood Selector */}
        <MoodSelector onSelectMood={handleSelectMood} />

        {totalXP > 0 && (
          <button
            onClick={resetPlant}
            className="text-xs text-stone-400 hover:text-stone-600 underline transition-colors pt-1 cursor-pointer"
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
