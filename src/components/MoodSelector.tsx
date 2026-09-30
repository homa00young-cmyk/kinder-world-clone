import React from 'react';
import { MOODS, type MoodType } from '../types/moods';

interface MoodSelectorProps {
  onSelectMood: (mood: MoodType) => void;
  disabled?: boolean;
}

const moodKeys: MoodType[] = ['آرام', 'خسته', 'مضطرب', 'سپاسگزار', 'عصبانی'];

export const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelectMood, disabled }) => {
  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <h2 className="text-xl md:text-2xl font-bold text-slate-700 text-center">
        امروز چه حسی داری؟
      </h2>
      <div className="flex flex-wrap justify-center gap-3 max-w-md w-full">
        {moodKeys.map((key) => {
          const mood = MOODS[key];
          return (
            <button
              key={mood.id}
              onClick={() => onSelectMood(mood.id)}
              disabled={disabled}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all duration-200 shadow-sm font-medium text-base hover:shadow focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 ${mood.buttonClass} disabled:opacity-50 cursor-pointer`}
            >
              <span className="text-xl">{mood.emoji}</span>
              <span>{mood.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
