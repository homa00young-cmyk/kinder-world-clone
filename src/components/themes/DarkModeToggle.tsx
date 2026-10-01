import React from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import type { ThemeMode } from '../../types/theme';

export const DarkModeToggle: React.FC = () => {
  const mode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setThemeMode);

  const modes: { key: ThemeMode; label: string; icon: string; desc: string }[] = [
    { key: 'system', label: 'سیستمی', icon: '💻', desc: 'تطبیق با تنظیمات گوشی/دستگاه' },
    { key: 'light', label: 'روشن', icon: '☀️', desc: 'حالت روشن استاندارد' },
    { key: 'dark', label: 'تاریک', icon: '🌙', desc: 'حالت تاریک و بهینه‌شده OLED' },
    { key: 'emotion_aware', label: 'هوش احساسی', icon: '🧠', desc: 'تغییر رنگ‌ها متناسب با احساس ثبت‌شده' },
    { key: 'time_aware', label: 'هوش زمانی', icon: '🕰️', desc: 'تغییر خودکار رنگ‌ها بر اساس ساعت روز' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100 flex flex-col gap-3 w-full dir-rtl">
      <div>
        <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
          <span>🎨</span> حالت نمایش و تم هوشمند
        </h3>
        <p className="text-xs text-stone-500">انتخاب نحوه تطبیق تم با محیط یا حالت احساسی شما</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setThemeMode(m.key)}
            className={`p-3 rounded-2xl border text-right flex items-center gap-3 transition-all cursor-pointer ${
              mode === m.key
                ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300 text-emerald-950 font-bold shadow-xs'
                : 'bg-stone-50/50 border-stone-200/80 hover:bg-stone-100 text-stone-700'
            }`}
          >
            <span className="text-2xl p-2 bg-white rounded-xl shadow-2xs border border-stone-100">{m.icon}</span>
            <div>
              <div className="text-xs font-bold">{m.label}</div>
              <div className="text-[10px] text-stone-500 font-medium">{m.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
