import type { SupportedLocale } from '../types';

// Maps our app locale code to a BCP 47 tag for toLocaleDateString.
// en-GB gives "Jan 2020"; de-DE gives "Jan. 2020" (German convention adds a dot).
export const LOCALE_TAG: Record<SupportedLocale, string> = { en: 'en-GB', de: 'de-DE' };

export const PRESENT_LABEL: Record<SupportedLocale, string> = { en: 'Present', de: 'Heute' };

export function formatDate(date: string, locale: SupportedLocale): string {
  const [year, month] = date.split('-');
  if (!year || !month) return date;
  const d = new Date(Number(year), Number(month) - 1);
  return isNaN(d.getTime())
    ? date
    : d.toLocaleDateString(LOCALE_TAG[locale], { month: 'short', year: 'numeric' });
}
