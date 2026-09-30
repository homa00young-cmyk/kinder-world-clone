import { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function InstallButton() {
  const { deferredPrompt, isStandalone, isMobile, isInstalled, triggerInstall } = usePWAInstall();
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Do not render if standalone mode (already installed & running as PWA), installed, or dismissed
  if (isStandalone || isInstalled || dismissed) {
    return null;
  }

  // Show if on mobile device or if beforeinstallprompt event is captured
  if (!isMobile && !deferredPrompt) {
    return null;
  }

  const handleInstallClick = async () => {
    const installed = await triggerInstall();
    if (!installed) {
      // If no deferred prompt (e.g. iOS Safari), show iOS instructions
      setShowIosInstructions(true);
    }
  };

  return (
    <div className="w-full bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 shadow-sm flex flex-col items-center gap-3 transition-all duration-300">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-lg shadow-sm">
            📲
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-900">نصب اپلیکیشن Kinder World</h3>
            <p className="text-xs text-emerald-700">دسترسی سریع و استفاده کامل در حالت آفلاین</p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-stone-400 hover:text-stone-600 p-1 text-sm rounded-full transition-colors cursor-pointer"
          aria-label="بستن"
          title="بستن"
        >
          ✕
        </button>
      </div>

      <button
        onClick={handleInstallClick}
        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
      >
        <span>نصب اپ</span>
      </button>

      {showIosInstructions && (
        <div className="w-full text-xs text-emerald-800 bg-white/90 rounded-xl p-3 border border-emerald-200 mt-1 space-y-1">
          <p className="font-semibold text-emerald-900">راهنمای نصب روی آیفون (iOS):</p>
          <p>۱. در مرورگر Safari دکمه <strong>Share (اشتراک‌گذاری)</strong> ⎋ را بزنید.</p>
          <p>۲. گزینه <strong>Add to Home Screen (افزودن به صفحه اصلی)</strong> ➕ را انتخاب کنید.</p>
        </div>
      )}
    </div>
  );
}
