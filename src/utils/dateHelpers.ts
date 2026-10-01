import { format as formatJalali } from 'date-fns-jalali';

export function toJalaliDateString(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return formatJalali(d, 'yyyy/MM/dd');
  } catch {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(typeof date === 'string' ? new Date(date) : date);
  }
}

export function toJalaliMonthYear(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return formatJalali(d, 'MMMM yyyy');
  } catch {
    return new Intl.DateTimeFormat('fa-IR', {
      month: 'long',
      year: 'numeric',
    }).format(typeof date === 'string' ? new Date(date) : date);
  }
}

export function toPersianDayName(dayOfWeek: number): string {
  const days = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
  return days[dayOfWeek % 7];
}

export function toPersianDigits(num: number | string): string {
  const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => faDigits[parseInt(x, 10)]);
}
