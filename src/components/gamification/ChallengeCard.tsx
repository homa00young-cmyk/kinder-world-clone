import React from 'react';
import type { Challenge } from '../../types/challenge';
import { useChallengeStore } from '../../store/useChallengeStore';
import { useGamificationStore } from '../../store/useGamificationStore';
import { usePlantStore } from '../../store/usePlantStore';
import { toPersianDigits } from '../../utils/dateHelpers';

export const ChallengeCard: React.FC<{ challenge: Challenge }> = ({ challenge }) => {
  const getChallengeState = useChallengeStore((s) => s.getChallengeState);
  const claimChallengeReward = useChallengeStore((s) => s.claimChallengeReward);
  const addCoins = useGamificationStore((s) => s.addCoins);
  const addGems = useGamificationStore((s) => s.addGems);
  const addXP = usePlantStore((s) => s.addXP);

  const state = getChallengeState(challenge.id);
  const progressPercent = Math.min(100, Math.round((state.progress / challenge.requiredCount) * 100));

  const handleClaim = () => {
    const res = claimChallengeReward(challenge.id);
    if (res.claimed) {
      if (res.rewardCoins) addCoins(res.rewardCoins);
      if (res.rewardGems) addGems(res.rewardGems);
      if (res.rewardXP) addXP(res.rewardXP);
    }
  };

  return (
    <div
      className={`bg-white rounded-3xl p-4 border transition-all flex flex-col justify-between gap-3 shadow-xs ${
        state.claimed
          ? 'border-stone-200/60 opacity-70 bg-stone-50/50'
          : state.completed
          ? 'border-emerald-300 bg-emerald-50/30'
          : 'border-stone-200/80 hover:border-stone-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="text-2xl p-2 bg-stone-100 rounded-2xl">{challenge.icon}</div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">{challenge.title}</h4>
            <p className="text-[11px] text-stone-500 font-medium leading-snug">{challenge.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60 whitespace-nowrap">
          <span>+{toPersianDigits(challenge.reward.coins)} 🪙</span>
          <span>+{toPersianDigits(challenge.reward.xp)} XP</span>
          {challenge.reward.gems && <span>+{toPersianDigits(challenge.reward.gems)} 💎</span>}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1 border-t border-stone-100">
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between text-[10px] font-bold text-stone-500">
            <span>پیشرفت</span>
            <span>
              {toPersianDigits(state.progress)} / {toPersianDigits(challenge.requiredCount)}
            </span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                state.completed ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {state.claimed ? (
          <span className="text-xs font-bold text-stone-400 px-3 py-1.5 bg-stone-100 rounded-xl">
            ✓ دریافت شد
          </span>
        ) : state.completed ? (
          <button
            onClick={handleClaim}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer animate-pulse"
          >
            دریافت پاداش 🎁
          </button>
        ) : (
          <span className="text-[11px] font-semibold text-stone-400 px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-200/60">
            در حال انجام
          </span>
        )}
      </div>
    </div>
  );
};
