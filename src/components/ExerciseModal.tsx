import React, { useState, useEffect } from 'react';
import { MOODS, type MoodType } from '../types/moods';

interface ExerciseModalProps {
  mood: MoodType;
  onComplete: () => void;
  onCancel: () => void;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({ mood, onComplete, onCancel }) => {
  const moodConfig = MOODS[mood];
  const [secondsRemaining, setSecondsRemaining] = useState(120); // 2 minutes

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [secondsRemaining]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-stone-100 flex flex-col items-center text-center space-y-6">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-sm font-semibold border border-emerald-100">
          <span>تمرین ۲ دقیقه‌ای</span>
          <span>•</span>
          <span>{moodConfig.emoji} {moodConfig.label}</span>
        </div>

        <div className="my-2 p-6 bg-slate-50 rounded-2xl border border-slate-100 w-full min-h-[120px] flex items-center justify-center">
          <p className="text-xl font-medium text-slate-800 leading-relaxed">
            "{moodConfig.exercise}"
          </p>
        </div>

        {/* Timer display */}
        <div className="flex flex-col items-center space-y-1">
          <span className="text-3xl font-mono font-bold text-slate-700">
            {formatTime(secondsRemaining)}
          </span>
          <span className="text-xs text-slate-400">زمان پیشنهادی برای تمرین</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <button
            onClick={onComplete}
            className="flex-1 py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            اتمام تمرین و رشد گیاه 🌱
          </button>
          <button
            onClick={onCancel}
            className="py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium transition-all duration-200 cursor-pointer"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
};
