import React from 'react';
import { usePlantStore } from '../store/usePlantStore';
import { PLANT_SPECIES } from '../data/plants';

interface PlantDisplayProps {
  emoji?: string;
  label?: string;
  description?: string;
  stageIndex?: number;
}

export const PlantDisplay: React.FC<PlantDisplayProps> = () => {
  const store = usePlantStore();
  const currentStage = store.getStage();
  const species = store.getSpecies();
  const nextInfo = store.getNextStageInfo();
  const weather = store.getWeather();

  const weatherIcons: Record<string, { icon: string; label: string }> = {
    sunny: { icon: '☀️', label: 'آفتابی' },
    rainy: { icon: '🌧️', label: 'بارانی' },
    snowy: { icon: '❄️', label: 'برفی' },
    windy: { icon: '💨', label: 'وزش باد' },
  };

  const weatherData = weatherIcons[weather] || weatherIcons.sunny;

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-emerald-50/70 rounded-3xl border border-emerald-100 shadow-sm backdrop-blur-sm transition-all duration-500 gap-4">

      {/* Top Weather & Species Bar */}
      <div className="flex items-center justify-between w-full text-xs text-stone-600 px-1">
        <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-full border border-stone-100 shadow-2xs font-medium">
          <span>{weatherData.icon}</span>
          <span>{weatherData.label}</span>
        </span>

        {/* Species selector dropdown */}
        <div className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-full border border-stone-100 shadow-2xs">
          <span className="text-stone-400 pl-1">گونه:</span>
          <select
            value={species.id}
            onChange={(e) => store.switchSpecies(e.target.value)}
            className="bg-transparent font-semibold text-emerald-800 text-xs focus:outline-none cursor-pointer"
          >
            {PLANT_SPECIES.map((sp) => (
              <option key={sp.id} value={sp.id}>
                {sp.emoji} {sp.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Plant Visual */}
      <div className="relative flex items-center justify-center w-36 h-36 bg-white/90 rounded-full shadow-inner border border-emerald-100 transform hover:scale-105 transition-transform duration-300">
        <span className="text-7xl select-none animate-bounce-slow" role="img" aria-label={currentStage.label}>
          {currentStage.emoji}
        </span>
      </div>

      {/* Stage Title and Description */}
      <div className="text-center space-y-1 w-full">
        <div className="inline-block px-3.5 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
          مرحله {currentStage.stage} از ۱۲: {currentStage.label}
        </div>
        <p className="text-slate-600 text-xs max-w-xs mx-auto leading-relaxed pt-1">
          {currentStage.description}
        </p>
      </div>

      {/* XP Progress Bar */}
      <div className="w-full max-w-xs space-y-1 pt-1">
        <div className="flex justify-between text-[11px] font-semibold text-slate-600">
          <span>امتیاز رشد (XP): {store.totalXP}</span>
          {nextInfo.nextStage ? (
            <span>تا مرحله بعد: {nextInfo.xpNeeded} XP</span>
          ) : (
            <span>درجه‌بندی نهایی 👑</span>
          )}
        </div>
        <div className="w-full bg-emerald-100 rounded-full h-2.5 overflow-hidden border border-emerald-200">
          <div
            className="bg-emerald-600 h-full transition-all duration-500 rounded-full"
            style={{ width: `${nextInfo.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Health Meter & Daily Water Action */}
      <div className="w-full max-w-xs flex items-center justify-between pt-2 border-t border-emerald-100/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600">سلامت گیاه:</span>
          <div className="w-20 bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
            <div
              className={`h-full transition-all duration-500 ${
                store.health > 60 ? 'bg-emerald-500' : store.health > 30 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${store.health}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-700">{store.health}%</span>
        </div>

        <button
          onClick={store.waterPlant}
          className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xs font-medium transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
        >
          <span>آبیاری</span>
          <span>💧</span>
        </button>
      </div>

      {/* Species Special Mechanic Note */}
      <div className="text-[11px] text-emerald-800 bg-emerald-100/50 px-3 py-1 rounded-xl w-full text-center font-medium">
        ✨ ویژگی {species.name}: {species.bonusText}
      </div>

    </div>
  );
};
