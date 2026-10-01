import { describe, it, expect, beforeEach } from 'vitest';
import { useAnalyticsStore } from '../store/useAnalyticsStore';
import { generatePersonalInsights } from '../data/insights';

describe('Analytics Store & Insights', () => {
  beforeEach(() => {
    useAnalyticsStore.getState().clearLogs();
  });

  it('should add mood log correctly', () => {
    const store = useAnalyticsStore.getState();
    expect(store.logs.length).toBe(0);

    store.addMoodLog({
      date: '2025-01-01',
      mood: 'آرام',
      exerciseTitle: 'تنفس ۴-۷-۸',
      xpGained: 20,
    });

    const updated = useAnalyticsStore.getState().logs;
    expect(updated.length).toBe(1);
    expect(updated[0].mood).toBe('آرام');
    expect(updated[0].xpGained).toBe(20);
  });

  it('should generate statistical insights from logs', () => {
    const logs = [
      {
        id: '1',
        date: '2025-01-01',
        timestamp: '2025-01-01T21:00:00.000Z',
        mood: 'مضطرب' as const,
        xpGained: 15,
      },
      {
        id: '2',
        date: '2025-01-02',
        timestamp: '2025-01-02T21:00:00.000Z',
        mood: 'آرام' as const,
        xpGained: 25,
      },
    ];

    const insights = generatePersonalInsights(logs, 5, 100, 3);
    expect(insights.length).toBeGreaterThan(0);
    expect(insights.some((i) => i.id === 'progress-streak')).toBe(true);
  });
});
