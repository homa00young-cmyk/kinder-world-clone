import { useState, useEffect } from 'react';
import { PlantDisplay } from './components/PlantDisplay';
import { MoodSelector } from './components/MoodSelector';
import { ExerciseModal } from './components/ExerciseModal';
import { InstallButton } from './components/InstallButton';
import { CurrencyDisplay } from './components/gamification/CurrencyDisplay';
import { XPBar } from './components/gamification/XPBar';
import { LevelUpAnimation } from './components/gamification/LevelUpAnimation';
import { UnlockAnimation } from './components/achievements/UnlockAnimation';

import { StatsPage } from './pages/Stats';
import { AchievementsPage } from './pages/Achievements';
import { ShopPage } from './pages/Shop';
import { ChallengesPage } from './pages/Challenges';
import { SettingsPage } from './pages/Settings';
import { ProfilePage } from './pages/Profile';

import { usePlantStore } from './store/usePlantStore';
import { useAnalyticsStore } from './store/useAnalyticsStore';
import { useGamificationStore } from './store/useGamificationStore';
import { useChallengeStore } from './store/useChallengeStore';
import { useThemeStore } from './store/useThemeStore';
import { useAchievements } from './hooks/useAchievements';

import type { MoodType } from './types/moods';
import type { ExerciseItem } from './types/exercise';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'achievements' | 'shop' | 'settings' | 'profile' | 'challenges'>('home');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);
  const [levelUpData, setLevelUpData] = useState<{ newLevel: number; rewards?: { coins: number; gems: number } } | null>(null);

  const resetPlant = usePlantStore((s) => s.resetPlant);
  const totalXP = usePlantStore((s) => s.totalXP);

  const addMoodLog = useAnalyticsStore((s) => s.addMoodLog);
  const addCoins = useGamificationStore((s) => s.addCoins);
  const checkAndLevelUp = useGamificationStore((s) => s.checkAndLevelUp);
  const updateStreak = useGamificationStore((s) => s.updateStreak);
  const updateChallengeProgress = useChallengeStore((s) => s.updateChallengeProgress);

  const getEffectiveTheme = useThemeStore((s) => s.getEffectiveTheme);
  const applyThemeToDocument = useThemeStore((s) => s.applyThemeToDocument);

  const { checkAllAchievements } = useAchievements();

  useEffect(() => {
    const theme = getEffectiveTheme(selectedMood);
    applyThemeToDocument(theme);
  }, [selectedMood, getEffectiveTheme, applyThemeToDocument]);

  useEffect(() => {
    updateStreak();
    checkAllAchievements();
  }, [updateStreak, checkAllAchievements]);

  const handleSelectMood = (mood: MoodType) => {
    setSelectedMood(mood);
  };

  const handleCompleteExercise = (exercise: ExerciseItem, xpGained: number, bonusGained: number) => {
    const todayStr = new Date().toISOString().split('T')[0];

    addMoodLog({
      date: todayStr,
      mood: exercise.emotion,
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      durationSeconds: exercise.durationSeconds,
      xpGained,
    });

    addCoins(xpGained);

    updateChallengeProgress('exercises_count', 1);
    if (exercise.emotion === 'مضطرب') updateChallengeProgress('anxious_count', 1);
    if (exercise.emotion === 'سپاسگزار') updateChallengeProgress('gratitude_count', 1);
    if (exercise.tier === 'quick') updateChallengeProgress('quick_count', 1);
    if (exercise.tier === 'deep' || exercise.tier === 'long' || exercise.tier === 'sleep') updateChallengeProgress('deep_count', 1);
    if (exercise.tier === 'sleep') updateChallengeProgress('sleep_count', 1);

    const newTotalXP = totalXP + xpGained;
    const lvlRes = checkAndLevelUp(newTotalXP);
    if (lvlRes.leveledUp) {
      setLevelUpData({ newLevel: lvlRes.newLevel, rewards: lvlRes.rewards });
    }

    checkAllAchievements();

    setSelectedMood(null);

    let msg = `🎉 آفرین! تمرین انجام شد و ${xpGained} XP و ${xpGained} سکه پاداش گرفتید! 🌱✨`;
    if (bonusGained > 0) {
      msg += ` (${bonusGained} XP پاداش ویژه گونه)`;
    }
    setCelebrationMsg(msg);

    setTimeout(() => {
      setCelebrationMsg(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-between relative overflow-hidden dir-rtl font-sans">
      <UnlockAnimation />

      <header className="w-full max-w-lg bg-white/80 backdrop-blur-md px-4 py-3 border-b border-stone-100 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className="w-9 h-9 rounded-2xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-700 transition-all cursor-pointer"
            title="پروفایل کاربری"
          >
            👤
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className="w-9 h-9 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 flex items-center justify-center font-bold transition-all cursor-pointer"
            title="چالش‌ها"
          >
            🎯
          </button>
        </div>

        <h1
          onClick={() => setActiveTab('home')}
          className="text-lg font-black text-emerald-800 tracking-tight cursor-pointer"
        >
          Kinder World 2.0
        </h1>

        <CurrencyDisplay />
      </header>

      <main className="w-full flex-1 flex flex-col items-center justify-start p-4">
        {activeTab === 'home' && (
          <div className="w-full max-w-lg bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-stone-100 flex flex-col items-center gap-6 my-auto">
            <XPBar />

            <InstallButton />

            {celebrationMsg && (
              <div className="w-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-center text-xs font-bold animate-bounce shadow-xs">
                {celebrationMsg}
              </div>
            )}

            <PlantDisplay />

            <MoodSelector onSelectMood={handleSelectMood} />

            {totalXP > 0 && (
              <button
                onClick={resetPlant}
                className="text-xs text-stone-400 hover:text-stone-600 underline transition-colors pt-1 cursor-pointer"
              >
                شروع مجدد رشد گیاه
              </button>
            )}
          </div>
        )}

        {activeTab === 'stats' && <StatsPage />}

        {activeTab === 'achievements' && <AchievementsPage />}

        {activeTab === 'shop' && <ShopPage />}

        {activeTab === 'settings' && <SettingsPage />}

        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'challenges' && <ChallengesPage />}
      </main>

      {selectedMood && (
        <ExerciseModal
          mood={selectedMood}
          onComplete={handleCompleteExercise}
          onCancel={() => setSelectedMood(null)}
        />
      )}

      {levelUpData && (
        <LevelUpAnimation
          newLevel={levelUpData.newLevel}
          rewards={levelUpData.rewards}
          onClose={() => setLevelUpData(null)}
        />
      )}

      <nav className="w-full max-w-md fixed bottom-3 inset-x-0 mx-auto px-4 z-40">
        <div className="bg-stone-900/90 backdrop-blur-md text-white rounded-3xl p-2 shadow-2xl flex items-center justify-around border border-stone-700/80">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'home' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span className="text-lg">🏠</span>
            <span className="text-[10px]">خانه</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'stats' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span className="text-lg">📊</span>
            <span className="text-[10px]">آمار</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'achievements' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span className="text-lg">🏆</span>
            <span className="text-[10px]">دستاوردها</span>
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'shop' ? 'bg-emerald-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span className="text-lg">🛍️</span>
            <span className="text-[10px]">فروشگاه</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span className="text-lg">⚙️</span>
            <span className="text-[10px]">تنظیمات</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
