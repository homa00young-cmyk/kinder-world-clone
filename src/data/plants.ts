import type { PlantStageConfig, PlantSpeciesConfig } from '../types/plant';

export const PLANT_STAGES: PlantStageConfig[] = [
  { stage: 1, emoji: '🌰', label: 'دانه', description: 'دانه‌ای سرشار از امید در خاک آرام گرفته است.', requiredXP: 0 },
  { stage: 2, emoji: '🌱', label: 'جوانه', description: 'گیاه کوچک شما تازه سر از خاک برآورده است.', requiredXP: 10 },
  { stage: 3, emoji: '🌿', label: 'نهال جوان', description: 'برگ‌های تازه و سرسبز در حال رشد هستند.', requiredXP: 25 },
  { stage: 4, emoji: '🪴', label: 'نهال گلدانی', description: 'ریشه‌ها قوی‌تر شده و ساقه‌ها محکم‌تر شده‌اند.', requiredXP: 50 },
  { stage: 5, emoji: '🌳', label: 'درخت جوان', description: 'درختی استوار که سایه‌ای دلنشین می‌آفریند.', requiredXP: 100 },
  { stage: 6, emoji: '🌲', label: 'درخت تنومند', description: 'درختی قوی و ریشه‌دار که در برابر بادها مقاوم است.', requiredXP: 200 },
  { stage: 7, emoji: '🌸', label: 'شکوفه‌دار', description: 'شکوفه‌های معطر و زیبا بر شاخسارش جلوه‌گر شده‌اند.', requiredXP: 350 },
  { stage: 8, emoji: '🍎', label: 'میوه‌دار', description: 'بارور و پر از میوه‌های شیرین پاداش توجه شماست.', requiredXP: 500 },
  { stage: 9, emoji: '🌳🌳', label: 'درختان دوگانه', description: 'همراهی و پیوند دو درخت تنومند در کنار یکدیگر.', requiredXP: 750 },
  { stage: 10, emoji: '🏵️', label: 'پربار و درخشان', description: 'باغچه‌ای از رنگ و زندگی در اوج شادابی.', requiredXP: 1000 },
  { stage: 11, emoji: '🌳✨', label: 'درخت جادویی', description: 'هاله‌ای از نور و آرامش دور گیاه جادویی شما می‌درخشد.', requiredXP: 1500 },
  { stage: 12, emoji: '🌳👑', label: 'درخت افسانه‌ای', description: 'شاهکار صبر و مهربانی؛ درختی تاج‌دار و جاودانه.', requiredXP: 2500 },
];

export const PLANT_SPECIES: PlantSpeciesConfig[] = [
  {
    id: 'cactus',
    name: 'کاکتوس',
    title: 'مقاوم',
    emoji: '🌵',
    description: 'در سخت‌ترین روزها هم صبور و استوار می‌ماند.',
    bonusText: '۲۰٪ امتیاز بیشتر در روزهای سخت (اضطراب/خشم)',
    unlockLevel: 1,
    mechanic: { type: 'hard_day_bonus', multiplier: 1.2 },
  },
  {
    id: 'sunflower',
    name: 'آفتابگردان',
    title: 'امیدبخش',
    emoji: '🌻',
    description: 'همواره رو به نور و زیبایی می‌چرخد.',
    bonusText: '۱۰٪ امتیاز بیشتر در روزهای سپاسگزاری',
    unlockLevel: 1,
    mechanic: { type: 'grateful_day_bonus', multiplier: 1.1 },
  },
  {
    id: 'rose',
    name: 'گل رز',
    title: 'احساسی',
    emoji: '🌹',
    description: 'احساسات عمیق را با زیبایی بی‌پایان در بر می‌گیرد.',
    bonusText: '۱۵٪ امتیاز بیشتر در روزهای اضطراب',
    unlockLevel: 3,
    mechanic: { type: 'anxious_day_bonus', multiplier: 1.15 },
  },
  {
    id: 'bamboo',
    name: 'بامبو',
    title: 'صبور و انعطاف‌پذیر',
    emoji: '🎋',
    description: 'با نرمی و انعطاف در برابر طوفان‌ها خم می‌شود اما نمی‌شکند.',
    bonusText: 'محافظت از استریک و تداوم (۱ روز)',
    unlockLevel: 5,
    mechanic: { type: 'streak_protection', multiplier: 1.0 },
  },
  {
    id: 'palm',
    name: 'نخل',
    title: 'ماجراجو',
    emoji: '🌴',
    description: 'همیشه آماده کشف تجربه‌ها و افق‌های تازه.',
    bonusText: '۲۵٪ امتیاز بیشتر برای تمرین‌های جدید',
    unlockLevel: 8,
    mechanic: { type: 'new_exercise_bonus', multiplier: 1.25 },
  },
  {
    id: 'clover',
    name: 'شبدر چهارپر',
    title: 'خوش‌شانس',
    emoji: '🍀',
    description: 'نماد شانس، خیر و اتفاقات غیرمنتظره زیبا.',
    bonusText: 'شانس دریافت پاداش‌های شگفت‌انگیز تصادفی',
    unlockLevel: 12,
    mechanic: { type: 'lucky_drop', multiplier: 1.3 },
  },
];

export function getStageByXP(xp: number): PlantStageConfig {
  let current = PLANT_STAGES[0];
  for (const s of PLANT_STAGES) {
    if (xp >= s.requiredXP) {
      current = s;
    } else {
      break;
    }
  }
  return current;
}

export function getNextStage(currentStageNumber: number): PlantStageConfig | null {
  if (currentStageNumber >= 12) return null;
  return PLANT_STAGES[currentStageNumber] || null;
}
