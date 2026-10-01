import React, { useState, useEffect } from 'react';
import { MOODS, type MoodType } from '../types/moods';
import type { ExerciseItem } from '../types/exercise';
import { getExercisesByEmotion, EXERCISE_TIERS } from '../data/exercises';
import { usePlantStore } from '../store/usePlantStore';

interface ExerciseModalProps {
  mood: MoodType;
  onComplete: (exercise: ExerciseItem, xpGained: number, bonusGained: number) => void;
  onCancel: () => void;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({ mood, onComplete, onCancel }) => {
  const moodConfig = MOODS[mood];
  const availableExercises = getExercisesByEmotion(mood);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem>(
    availableExercises[0] || {
      id: 'default',
      emotion: mood,
      title: moodConfig.exercise,
      description: 'تمرین آرامش‌بخش',
      tier: 'standard',
      durationSeconds: 120,
      xpReward: 10,
      instructions: [moodConfig.exercise],
    }
  );

  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('all');
  const [secondsRemaining, setSecondsRemaining] = useState(selectedExercise.durationSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);

  // Breathing state
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'holdIn' | 'exhale' | 'holdOut'>('inhale');

  const addXP = usePlantStore((s) => s.addXP);
  const species = usePlantStore((s) => s.getSpecies)();

  // Reset timer state on exercise selection
  const handleSelectExercise = (ex: ExerciseItem) => {
    setSelectedExercise(ex);
    setSecondsRemaining(ex.durationSeconds);
    setIsActive(false);
    setBreathingPhase('inhale');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsNarrating(false);
  };

  // Main countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining]);

  // Breathing cycle logic
  useEffect(() => {
    const pattern = selectedExercise.breathingPattern;
    if (!isActive || !pattern) return;

    let secInPhase = 0;
    const breathInterval = setInterval(() => {
      secInPhase += 1;
      setBreathingPhase((prevPhase) => {
        if (prevPhase === 'inhale' && secInPhase >= pattern.inhale) {
          secInPhase = 0;
          return pattern.holdIn ? 'holdIn' : 'exhale';
        }
        if (prevPhase === 'holdIn' && secInPhase >= (pattern.holdIn || 0)) {
          secInPhase = 0;
          return 'exhale';
        }
        if (prevPhase === 'exhale' && secInPhase >= pattern.exhale) {
          secInPhase = 0;
          return pattern.holdOut ? 'holdOut' : 'inhale';
        }
        if (prevPhase === 'holdOut' && secInPhase >= (pattern.holdOut || 0)) {
          secInPhase = 0;
          return 'inhale';
        }
        return prevPhase;
      });
    }, 1000);

    return () => clearInterval(breathInterval);
  }, [isActive, selectedExercise.breathingPattern]);

  // Handle Text-To-Speech (Web Speech API)
  const toggleNarration = () => {
    if (!('speechSynthesis' in window)) return;

    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }

    const textToSpeak = `${selectedExercise.title}. ${selectedExercise.description}. ${selectedExercise.instructions.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'fa-IR';
    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsNarrating(true);
  };

  const handleFinish = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const result = addXP(selectedExercise.xpReward, selectedExercise.id, mood);
    onComplete(selectedExercise, result.xpGained, result.bonusGained);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const totalDuration = selectedExercise.durationSeconds;
  const progressPercent = Math.round(((totalDuration - secondsRemaining) / totalDuration) * 100);

  const filteredExercises = selectedTierFilter === 'all'
    ? availableExercises
    : availableExercises.filter((ex) => ex.tier === selectedTierFilter);

  // Breathing circle animation scale
  const getCircleScale = () => {
    if (!isActive) return 'scale-100';
    if (breathingPhase === 'inhale') return 'scale-125 transition-transform duration-1000';
    if (breathingPhase === 'holdIn' || breathingPhase === 'holdOut') return 'scale-125 duration-1000';
    return 'scale-90 transition-transform duration-1000';
  };

  const getBreathingLabel = () => {
    if (breathingPhase === 'inhale') return 'دم... (نفس بکشید)';
    if (breathingPhase === 'holdIn') return 'نگه‌داشتن نفس...';
    if (breathingPhase === 'exhale') return 'بازدم... (آرام خالی کنید)';
    return 'مکث...';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-stone-100 flex flex-col items-center text-center space-y-6 my-auto">

        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100">
            {moodConfig.emoji} {moodConfig.label}
          </span>
          <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
            {EXERCISE_TIERS[selectedExercise.tier]?.emoji} {EXERCISE_TIERS[selectedExercise.tier]?.label} ({selectedExercise.xpReward} XP)
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-100">
            {species.emoji} {species.name}
          </span>
        </div>

        {/* Exercise Selector */}
        <div className="w-full text-right space-y-2">
          <label className="text-xs font-semibold text-stone-500 block">انتخاب تمرین:</label>
          <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedTierFilter('all')}
              className={`px-2.5 py-1 text-xs rounded-xl transition-colors cursor-pointer ${
                selectedTierFilter === 'all' ? 'bg-emerald-600 text-white font-medium' : 'bg-stone-100 text-stone-600'
              }`}
            >
              همه ({availableExercises.length})
            </button>
            {Object.values(EXERCISE_TIERS).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTierFilter(t.id)}
                className={`px-2.5 py-1 text-xs rounded-xl transition-colors cursor-pointer ${
                  selectedTierFilter === t.id ? 'bg-emerald-600 text-white font-medium' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          <select
            value={selectedExercise.id}
            onChange={(e) => {
              const found = availableExercises.find((ex) => ex.id === e.target.value);
              if (found) handleSelectExercise(found);
            }}
            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {filteredExercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.title} ({EXERCISE_TIERS[ex.tier]?.label} - {ex.xpReward} XP)
              </option>
            ))}
          </select>
        </div>

        {/* Exercise Card */}
        <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100 w-full space-y-3">
          <h3 className="text-lg font-bold text-slate-800">{selectedExercise.title}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{selectedExercise.description}</p>

          <div className="space-y-1.5 text-right pt-2 border-t border-stone-200">
            <p className="text-xs font-bold text-stone-600">راهنمای گام‌به‌گام:</p>
            <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
              {selectedExercise.instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Animated Breathing Circle */}
        <div className="relative flex flex-col items-center justify-center my-2">
          <div
            className={`w-32 h-32 rounded-full bg-emerald-100/80 border-4 border-emerald-400 flex items-center justify-center shadow-lg transition-all transform ${getCircleScale()}`}
          >
            <span className="text-2xl font-mono font-bold text-emerald-800">
              {formatTime(secondsRemaining)}
            </span>
          </div>

          {selectedExercise.breathingPattern && (
            <p className="text-xs font-medium text-emerald-700 mt-4 animate-pulse">
              {isActive ? getBreathingLabel() : 'آماده برای شروع تنفس آگاهانه'}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* TTS & Control Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full pt-1">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`py-2.5 px-4 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              isActive ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isActive ? '⏸️ توقف زمان' : '▶️ شروع تمرین'}
          </button>

          {'speechSynthesis' in window && (
            <button
              onClick={toggleNarration}
              className={`py-2.5 px-4 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                isNarrating ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {isNarrating ? '🔇 توقف گوینده' : '🔊 خواندن متنی'}
            </button>
          )}

          <button
            onClick={handleFinish}
            className="py-2.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow cursor-pointer"
          >
            اتمام تمرین و رشد گیاه 🌱
          </button>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onCancel();
            }}
            className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium text-sm cursor-pointer"
          >
            انصراف
          </button>
        </div>

      </div>
    </div>
  );
};
