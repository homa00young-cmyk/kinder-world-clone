export type MoodType = 'آرام' | 'خسته' | 'مضطرب' | 'سپاسگزار' | 'عصبانی';

export interface MoodConfig {
  id: MoodType;
  label: string;
  emoji: string;
  colorClass: string;
  buttonClass: string;
  exercise: string;
}

export const MOODS: Record<MoodType, MoodConfig> = {
  آرام: {
    id: 'آرام',
    label: 'آرام',
    emoji: '😌',
    colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    buttonClass: 'hover:bg-emerald-100 hover:border-emerald-300 bg-emerald-50 text-emerald-800 border-emerald-200',
    exercise: 'به خودت یک جمله محبت‌آمیز بگو'
  },
  خسته: {
    id: 'خسته',
    label: 'خسته',
    emoji: '🥱',
    colorClass: 'bg-amber-50 text-amber-800 border-amber-200',
    buttonClass: 'hover:bg-amber-100 hover:border-amber-300 bg-amber-50 text-amber-800 border-amber-200',
    exercise: '۵ نفس عمیق بکش و استراحت کن'
  },
  مضطرب: {
    id: 'مضطرب',
    label: 'مضطرب',
    emoji: '😰',
    colorClass: 'bg-sky-50 text-sky-800 border-sky-200',
    buttonClass: 'hover:bg-sky-100 hover:border-sky-300 bg-sky-50 text-sky-800 border-sky-200',
    exercise: 'چشم‌ها را ببند و ۴ ثانیه دم، ۷ ثانیه نگه دار، ۸ ثانیه بازدم'
  },
  سپاسگزار: {
    id: 'سپاسگزار',
    label: 'سپاسگزار',
    emoji: '🌸',
    colorClass: 'bg-rose-50 text-rose-800 border-rose-200',
    buttonClass: 'hover:bg-rose-100 hover:border-rose-300 bg-rose-50 text-rose-800 border-rose-200',
    exercise: 'سه چیز که امروز بابتش سپاسگزاری'
  },
  عصبانی: {
    id: 'عصبانی',
    label: 'عصبانی',
    emoji: '😤',
    colorClass: 'bg-orange-50 text-orange-800 border-orange-200',
    buttonClass: 'hover:bg-orange-100 hover:border-orange-300 bg-orange-50 text-orange-800 border-orange-200',
    exercise: '۱۰ نفس عمیق و آرام'
  }
};
