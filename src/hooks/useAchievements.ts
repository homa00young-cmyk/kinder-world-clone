import { useCallback } from 'react';
import { useAchievementStore } from '../store/useAchievementStore';
import { useGamificationStore } from '../store/useGamificationStore';
import { usePlantStore } from '../store/usePlantStore';
import { useAnalyticsStore } from '../store/useAnalyticsStore';
import { ACHIEVEMENTS } from '../data/achievements';

export function useAchievements() {
  const checkAllAchievements = useCallback(() => {
    const userAchievements = useAchievementStore.getState().userAchievements;
    const unlockAchievement = useAchievementStore.getState().unlockAchievement;
    const updateProgress = useAchievementStore.getState().updateProgress;
    const addCoins = useGamificationStore.getState().addCoins;
    const addGems = useGamificationStore.getState().addGems;
    const addXP = usePlantStore.getState().addXP;
    const streak = useGamificationStore.getState().currentStreak;
    const logs = useAnalyticsStore.getState().logs;
    const totalXP = usePlantStore.getState().totalXP;
    const plantStage = usePlantStore.getState().getStage();

    ACHIEVEMENTS.forEach((ach) => {
      const userAch = userAchievements[ach.id];
      if (userAch?.unlockedAt) return;

      let progress = 0;

      if (ach.category === 'streak') {
        progress = streak;
      } else if (ach.category === 'volume') {
        progress = logs.length;
      } else if (ach.category === 'growth') {
        if (ach.id.includes('stage')) {
          progress = plantStage.stage;
        }
      } else if (ach.category === 'variety') {
        if (ach.id === 'variety-emotions') {
          const uniqueEmotions = new Set(logs.map((l) => l.mood));
          progress = uniqueEmotions.size;
        } else if (ach.id === 'variety-weekdays') {
          const uniqueDays = new Set(logs.map((l) => new Date(l.date).getDay()));
          progress = uniqueDays.size;
        }
      } else if (ach.category === 'mastery') {
        if (ach.id === 'mastery-breathing') {
          progress = logs.filter((l) => (l.exerciseTitle || '').includes('تنفس')).length;
        } else if (ach.id === 'mastery-gratitude') {
          progress = logs.filter((l) => l.mood === 'سپاسگزار').length;
        } else if (ach.id === 'mastery-anxiety') {
          progress = logs.filter((l) => l.mood === 'مضطرب').length;
        } else if (ach.id === 'mastery-anger') {
          progress = logs.filter((l) => l.mood === 'عصبانی').length;
        }
      } else if (ach.category === 'time') {
        if (ach.id === 'time-night-owl') {
          const hasNight = logs.some((l) => {
            const h = new Date(l.timestamp).getHours();
            return h >= 0 && h < 4;
          });
          progress = hasNight ? 1 : 0;
        } else if (ach.id === 'time-early-bird') {
          const hasMorning = logs.some((l) => {
            const h = new Date(l.timestamp).getHours();
            return h >= 5 && h < 8;
          });
          progress = hasMorning ? 1 : 0;
        }
      } else if (ach.category === 'hidden') {
        if (ach.id === 'secret-eagle') {
          progress = totalXP >= 500 ? 500 : totalXP;
        }
      }

      if (progress > 0) {
        updateProgress(ach.id, progress);
        if (progress >= ach.requiredCount) {
          const res = unlockAchievement(ach.id);
          if (res.unlocked) {
            if (ach.coinReward) addCoins(ach.coinReward);
            if (ach.gemReward) addGems(ach.gemReward);
            if (ach.xpReward) addXP(ach.xpReward);
          }
        }
      }
    });
  }, []);

  return { checkAllAchievements };
}
