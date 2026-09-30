import React from 'react';

interface PlantDisplayProps {
  emoji: string;
  label: string;
  description: string;
  stageIndex: number;
}

export const PlantDisplay: React.FC<PlantDisplayProps> = ({
  emoji,
  label,
  description,
  stageIndex,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-emerald-50/60 rounded-3xl border border-emerald-100 shadow-sm backdrop-blur-sm transition-all duration-500">
      <div className="relative flex items-center justify-center w-36 h-36 bg-white/80 rounded-full shadow-inner mb-4 border border-emerald-100 transform hover:scale-105 transition-transform duration-300">
        <span className="text-7xl select-none animate-bounce-slow" role="img" aria-label={label}>
          {emoji}
        </span>
      </div>
      <div className="text-center space-y-1">
        <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full mb-1">
          مرحله {stageIndex + 1}: {label}
        </div>
        <p className="text-slate-600 text-sm max-w-xs">{description}</p>
      </div>
    </div>
  );
};
