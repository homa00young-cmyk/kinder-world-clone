import React, { useState } from 'react';
import type { PersonalInsight } from '../../types/analytics';

export const InsightCard: React.FC<{ insight: PersonalInsight }> = ({ insight }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: insight.title,
          text: insight.shareableText,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(insight.shareableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const typeBgMap: Record<string, string> = {
    pattern: 'from-purple-500/10 to-indigo-500/10 border-purple-200',
    progress: 'from-emerald-500/10 to-teal-500/10 border-emerald-200',
    behavioral: 'from-amber-500/10 to-orange-500/10 border-amber-200',
    predictive: 'from-sky-500/10 to-blue-500/10 border-sky-200',
    recommendation: 'from-rose-500/10 to-pink-500/10 border-rose-200',
  };

  return (
    <div
      className={`bg-gradient-to-br ${
        typeBgMap[insight.type] || 'from-stone-50 to-stone-100 border-stone-200'
      } border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3 relative overflow-hidden`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl p-2.5 bg-white/80 rounded-2xl shadow-xs border border-white">{insight.icon}</div>
          <div>
            <h4 className="text-sm font-bold text-stone-900">{insight.title}</h4>
            {insight.metric && <span className="inline-block px-2 py-0.5 mt-1 bg-white/90 text-stone-700 text-[10px] font-bold rounded-lg border border-stone-200">{insight.metric}</span>}
          </div>
        </div>

        <button
          onClick={handleShare}
          className="px-3 py-1.5 bg-white/90 hover:bg-white text-stone-700 text-xs font-bold rounded-xl border border-stone-200 transition-all cursor-pointer shadow-xs whitespace-nowrap"
        >
          {copied ? '✓ کپی شد' : '🔗 اشتراک'}
        </button>
      </div>

      <p className="text-xs text-stone-700 leading-relaxed font-medium">{insight.description}</p>
    </div>
  );
};
