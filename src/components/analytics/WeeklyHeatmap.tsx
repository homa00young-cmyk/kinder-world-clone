import React, { useState, useMemo } from 'react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import type { TimeSlot } from '../../types/analytics';
import { toPersianDigits, toPersianDayName } from '../../utils/dateHelpers';

const timeSlots: { key: TimeSlot; label: string; hours: string }[] = [
  { key: 'morning', label: 'صبح', hours: '۶-۱۲' },
  { key: 'afternoon', label: 'عصر', hours: '۱۲-۱۸' },
  { key: 'evening', label: 'شب', hours: '۱۸-۲۴' },
  { key: 'night', label: 'بامداد', hours: '۰-۶' },
];

export const WeeklyHeatmap: React.FC = () => {
  const [selectedSlot, setSelectedSlot] = useState<{ dayName: string; slotLabel: string; exercises: string[] } | null>(null);
  const logs = useAnalyticsStore((s) => s.logs);

  const matrix = useMemo(() => {
    const grid: Record<number, Record<TimeSlot, { count: number; exercises: string[] }>> = {};

    for (let day = 0; day < 7; day++) {
      grid[day] = {
        morning: { count: 0, exercises: [] },
        afternoon: { count: 0, exercises: [] },
        evening: { count: 0, exercises: [] },
        night: { count: 0, exercises: [] },
      };
    }

    logs.forEach((log) => {
      if (log.timestamp) {
        const date = new Date(log.timestamp);
        const dayIdx = date.getDay();
        const persianDayIdx = (dayIdx + 1) % 7;
        const hour = date.getHours();

        let slotKey: TimeSlot = 'morning';
        if (hour >= 12 && hour < 18) slotKey = 'afternoon';
        else if (hour >= 18 && hour < 24) slotKey = 'evening';
        else if (hour >= 0 && hour < 6) slotKey = 'night';

        grid[persianDayIdx][slotKey].count++;
        if (log.exerciseTitle) {
          grid[persianDayIdx][slotKey].exercises.push(log.exerciseTitle);
        }
      }
    });

    return grid;
  }, [logs]);

  const getCellBg = (count: number) => {
    if (count === 0) return 'bg-stone-100/60 hover:bg-stone-200';
    if (count === 1) return 'bg-purple-200 text-purple-900 font-medium hover:bg-purple-300';
    if (count <= 3) return 'bg-purple-400 text-white font-bold hover:bg-purple-500';
    if (count <= 5) return 'bg-purple-600 text-white font-bold hover:bg-purple-700';
    return 'bg-purple-900 text-white font-black hover:bg-purple-950';
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100 flex flex-col gap-4 w-full">
      <div>
        <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
          <span>⏰</span> نقشه حرارتی ریتم هفتگی
        </h3>
        <p className="text-xs text-stone-500">کشف زمان‌های طلایی تمرین و تمرکز در طول هفته</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-separate border-spacing-1.5 text-xs">
          <thead>
            <tr>
              <th className="p-1 text-stone-400 font-medium text-[10px]">بازه</th>
              {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => (
                <th key={dayIdx} className="p-1 text-stone-700 font-bold">
                  {toPersianDayName((dayIdx + 6) % 7)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot) => (
              <tr key={slot.key}>
                <td className="p-1 font-semibold text-stone-500 text-[11px] whitespace-nowrap">
                  {slot.label} ({toPersianDigits(slot.hours)})
                </td>
                {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                  const cellData = matrix[dayIdx][slot.key];
                  const dayName = toPersianDayName((dayIdx + 6) % 7);

                  return (
                    <td
                      key={dayIdx}
                      onClick={() =>
                        setSelectedSlot({
                          dayName,
                          slotLabel: `${slot.label} (${slot.hours})`,
                          exercises: cellData.exercises,
                        })
                      }
                      className={`h-9 min-w-[36px] rounded-xl transition-all cursor-pointer flex items-center justify-center text-xs ${getCellBg(
                        cellData.count
                      )}`}
                    >
                      {cellData.count > 0 ? toPersianDigits(cellData.count) : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSlot && (
        <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-3 text-xs flex justify-between items-center">
          <div>
            <span className="font-bold text-purple-900">{selectedSlot.dayName}</span> -{' '}
            <span className="text-purple-700">{selectedSlot.slotLabel}</span>
            <div className="text-purple-800 font-medium mt-0.5">
              {selectedSlot.exercises.length > 0
                ? `تمرین‌ها: ${selectedSlot.exercises.join('، ')}`
                : 'در این زمان تمرینی انجام نشده است.'}
            </div>
          </div>
          <button
            onClick={() => setSelectedSlot(null)}
            className="text-purple-500 hover:text-purple-800 font-bold px-2 py-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
