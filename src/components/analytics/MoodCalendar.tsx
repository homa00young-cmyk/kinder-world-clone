import React, { useState, useMemo } from 'react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { usePlantStore } from '../../store/usePlantStore';
import type { MoodType } from '../../types/moods';
import type { MoodLog } from '../../types/analytics';
import { toJalaliDateString, toPersianDigits, toJalaliMonthYear } from '../../utils/dateHelpers';
import { exportElementAsPNG, exportElementAsPDF } from '../../utils/imageExport';

const moodBgClasses: Record<MoodType, string> = {
  'آرام': 'bg-emerald-100 text-emerald-900 border-emerald-300',
  'سپاسگزار': 'bg-rose-100 text-rose-900 border-rose-300',
  'خسته': 'bg-amber-100 text-amber-900 border-amber-300',
  'مضطرب': 'bg-sky-100 text-sky-900 border-sky-300',
  'عصبانی': 'bg-orange-100 text-orange-900 border-orange-300',
};

export const MoodCalendar: React.FC = () => {
  const [currentMonthOffset, setCurrentMonthOffset] = useState<number>(0);
  const [filterMood, setFilterMood] = useState<MoodType | 'ALL'>('ALL');
  const [selectedDayLog, setSelectedDayLog] = useState<{ date: string; logs: MoodLog[] } | null>(null);
  const [exporting, setExporting] = useState<boolean>(false);

  const logs = useAnalyticsStore((s) => s.logs);
  const plantSpecies = usePlantStore((s) => s.getSpecies());
  const plantStage = usePlantStore((s) => s.getStage());

  const monthData = useMemo(() => {
    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() + currentMonthOffset);

    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateStr = dateObj.toISOString().split('T')[0];

      let dayLogs = logs.filter((l) => l.date === dateStr);
      if (filterMood !== 'ALL') {
        dayLogs = dayLogs.filter((l) => l.mood === filterMood);
      }

      const dominantLog = dayLogs[0];

      days.push({
        dayNumber: day,
        dateStr,
        jalaliStr: toJalaliDateString(dateObj),
        logs: dayLogs,
        dominantMood: dominantLog?.mood,
        exercisesCount: dayLogs.length,
      });
    }

    return {
      monthLabel: toJalaliMonthYear(baseDate),
      days,
    };
  }, [currentMonthOffset, filterMood, logs]);

  const handleExportPNG = async () => {
    setExporting(true);
    await exportElementAsPNG('mood-calendar-export-container', `mood-calendar-${monthData.monthLabel}.png`);
    setExporting(false);
  };

  const handleExportPDF = async () => {
    setExporting(true);
    await exportElementAsPDF('mood-calendar-export-container', `mood-calendar-${monthData.monthLabel}.pdf`);
    setExporting(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
            <span>📅</span> تقویم احساسات ماهانه
          </h3>
          <p className="text-xs text-stone-500">مشاهده و تحلیل تقویمی حال و هوای احساسی شما</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            onClick={handleExportPNG}
            disabled={exporting}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold transition-all cursor-pointer border border-stone-200"
          >
            🖼️ PNG
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold transition-all cursor-pointer border border-stone-200"
          >
            📄 PDF
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-stone-50 p-3 rounded-2xl border border-stone-100 flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-stone-800">
          <button
            onClick={() => setCurrentMonthOffset((m) => m - 1)}
            className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-100 cursor-pointer"
          >
            ▶
          </button>
          <span>{monthData.monthLabel}</span>
          <button
            onClick={() => setCurrentMonthOffset((m) => m + 1)}
            className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-100 cursor-pointer"
          >
            ◀
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            onClick={() => setFilterMood('ALL')}
            className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
              filterMood === 'ALL' ? 'bg-stone-800 text-white' : 'bg-white text-stone-600 border border-stone-200'
            }`}
          >
            همه
          </button>
          {(['آرام', 'سپاسگزار', 'خسته', 'مضطرب', 'عصبانی'] as MoodType[]).map((m) => (
            <button
              key={m}
              onClick={() => setFilterMood(m)}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                filterMood === m ? 'bg-emerald-600 text-white' : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div id="mood-calendar-export-container" className="p-2 bg-white rounded-2xl">
        <div className="grid grid-cols-7 gap-2">
          {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((dayHeader, idx) => (
            <div key={idx} className="text-center font-bold text-xs text-stone-400 py-1">
              {dayHeader}
            </div>
          ))}

          {monthData.days.map((day) => {
            const mood = day.dominantMood;
            const bgClass = mood ? moodBgClasses[mood] : 'bg-stone-50 border-stone-200/60 text-stone-500';

            return (
              <button
                key={day.dateStr}
                onClick={() => day.logs.length > 0 && setSelectedDayLog({ date: day.dateStr, logs: day.logs })}
                className={`h-14 rounded-2xl border p-1 flex flex-col justify-between items-center transition-all cursor-pointer relative ${bgClass} ${
                  day.logs.length > 0 ? 'hover:scale-105 shadow-xs font-bold' : 'opacity-60'
                }`}
              >
                <span className="text-xs">{toPersianDigits(day.dayNumber)}</span>

                {mood && <span className="text-xs">{mood === 'آرام' ? '😌' : mood === 'سپاسگزار' ? '🌸' : mood === 'خسته' ? '🥱' : mood === 'مضطرب' ? '😰' : '😤'}</span>}

                {day.exercisesCount > 1 && (
                  <span className="absolute bottom-1 right-1 bg-stone-900/80 text-white text-[9px] px-1 rounded-full">
                    +{toPersianDigits(day.exercisesCount)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDayLog && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 dir-rtl">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 border border-stone-100">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-stone-800">
                  جزئیات روز {toPersianDigits(toJalaliDateString(selectedDayLog.date))}
                </h4>
                <p className="text-xs text-stone-500">گیاه فعال: {plantSpecies.name} ({plantStage.label})</p>
              </div>
              <button
                onClick={() => setSelectedDayLog(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {selectedDayLog.logs.map((log) => (
                <div key={log.id} className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3 flex flex-col gap-1">
                  <div className="flex items-center justify-between font-bold text-xs text-stone-800">
                    <span className="flex items-center gap-1.5">
                      <span>{log.mood === 'آرام' ? '😌' : log.mood === 'سپاسگزار' ? '🌸' : log.mood === 'خسته' ? '🥱' : log.mood === 'مضطرب' ? '😰' : '😤'}</span>
                      <span>{log.mood}</span>
                    </span>
                    <span className="text-emerald-700">+{toPersianDigits(log.xpGained)} XP</span>
                  </div>
                  {log.exerciseTitle && <div className="text-xs text-stone-600 font-medium">تمرین: {log.exerciseTitle}</div>}
                  {log.notes && <div className="text-xs text-stone-500 italic bg-white p-2 rounded-xl mt-1 border border-stone-100">«{log.notes}»</div>}
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedDayLog(null)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
