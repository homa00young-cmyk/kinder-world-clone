import React from 'react';
import { THEMES } from '../data/themes';
import { ThemeCard } from '../components/themes/ThemeCard';
import { DarkModeToggle } from '../components/themes/DarkModeToggle';
import { usePlantStore } from '../store/usePlantStore';
import { useAnalyticsStore } from '../store/useAnalyticsStore';

export const SettingsPage: React.FC = () => {
  const resetPlant = usePlantStore((s) => s.resetPlant);
  const clearLogs = useAnalyticsStore((s) => s.clearLogs);

  const handleResetData = () => {
    if (confirm('آیا از بازنشانی داده‌ها و شروع مجدد مطمئن هستید؟')) {
      resetPlant();
      clearLogs();
      alert('اطلاعات با موفقیت بازنشانی شد.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 p-4 md:p-6 pb-24 dir-rtl">
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100 flex flex-col gap-1">
        <h2 className="text-2xl font-black text-stone-800 tracking-tight flex items-center gap-2">
          <span>⚙️</span> تنظیمات و تم‌های رنگی
        </h2>
        <p className="text-xs text-stone-500 font-medium">سفارشی‌سازی ظاهر، تم‌ها و تنظیمات شخصی اپلیکیشن</p>
      </div>

      <DarkModeToggle />

      <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100 flex flex-col gap-4">
        <div>
          <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
            <span>🎨</span> گالری ۱۲ تم رنگی
          </h3>
          <p className="text-xs text-stone-500">شامل ۶ تم استاندارد رایگان و ۶ تم پرمیوم با الماس</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {THEMES.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} onSelect={() => {}} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100 flex flex-col gap-3">
        <h3 className="text-base font-bold text-stone-800 flex items-center gap-2 text-rose-700">
          <span>⚠️</span> مدیریت داده‌ها
        </h3>
        <p className="text-xs text-stone-500">تمامی اطلاعات شما به صورت محلی در حافظه مرورگر ذخیره می‌شود.</p>

        <button
          onClick={handleResetData}
          className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs rounded-2xl border border-rose-200 transition-all cursor-pointer self-start"
        >
          شروع مجدد رشد گیاه و پاکسازی تاریخچه 🔄
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
