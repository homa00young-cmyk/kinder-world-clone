import type { MoodLog, PersonalInsight } from '../types/analytics';

export function generatePersonalInsights(logs: MoodLog[], currentStreak: number, totalXP: number, level: number): PersonalInsight[] {
  const insights: PersonalInsight[] = [];

  if (!logs || logs.length === 0) {
    return [
      {
        id: 'default-welcome',
        type: 'recommendation',
        title: 'شروع مسیر خودآگاهی',
        description: 'با انجام روزانه تنها ۱ تمرین، به آرامی الگوی احساسی و توانمندی ذهنی خود را شکل دهید.',
        icon: '🌱',
        shareableText: 'من سفر خودآگاهی خود را در Kinder World آغاز کردم! 🌱',
      },
    ];
  }

  const dayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
  const anxietyByDay = [0, 0, 0, 0, 0, 0, 0];
  logs.forEach((log) => {
    if (log.mood === 'مضطرب') {
      const dayIdx = new Date(log.date).getDay();
      anxietyByDay[dayIdx]++;
    }
  });
  const maxAnxietyDayIdx = anxietyByDay.indexOf(Math.max(...anxietyByDay));
  if (anxietyByDay[maxAnxietyDayIdx] > 0) {
    insights.push({
      id: 'pattern-anxiety-day',
      type: 'pattern',
      title: 'الگوی اضطراب هفتگی',
      description: `بیشترین میزان احساس اضطراب شما در روزهای ${dayNames[maxAnxietyDayIdx]} ثبت شده است.`,
      icon: '📊',
      metric: `${anxietyByDay[maxAnxietyDayIdx]} بار`,
      shareableText: `من الگوی احساسی خود را کشف کردم: روزهای ${dayNames[maxAnxietyDayIdx]} نیاز به مراقبت بیشتری دارم. 🌿`,
    });
  }

  if (currentStreak >= 3) {
    insights.push({
      id: 'progress-streak',
      type: 'progress',
      title: 'اراده و تداوم عالی',
      description: `${currentStreak} روز متوالی است که تمرین‌های خودآگاهی را انجام می‌دهید! 🎉`,
      icon: '🔥',
      metric: `${currentStreak} روز`,
      shareableText: `من ${currentStreak} روز متوالی است که تمرین خودآگاهی می‌کنم! 🔥🌱`,
    });
  }

  const nextLevelXP = Math.floor(100 * Math.pow(level + 1, 1.5));
  const remainingXP = Math.max(0, nextLevelXP - totalXP);
  insights.push({
    id: 'progress-level-xp',
    type: 'progress',
    title: 'فاصله تا سطح بعدی',
    description: `به سطح ${level + 1} تنها ${remainingXP} XP باقی مانده است.`,
    icon: '🎯',
    metric: `${remainingXP} XP`,
    shareableText: `در حال ارتقا به سطح ${level + 1} در Kinder World! 🎯`,
  });

  insights.push({
    id: 'recommendation-compassion',
    type: 'recommendation',
    title: 'پیشنهاد ویژه: تمرین شفقت به خود',
    description: 'پیشنهاد می‌کنیم امروز تمرین مهربانی و شفقت به خود را برای تقویت روحیه امتحان کنید.',
    icon: '💖',
    shareableText: 'مهربانی با خود، بزرگ‌ترین هدیه به ذهن است. 💖',
  });

  return insights;
}
