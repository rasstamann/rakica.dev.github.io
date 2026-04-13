import type { ILocaleString } from '../models/Profile';

export type SupportedLocale = 'en' | 'de';
const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'de'];

export function resolveLocale(raw: unknown): SupportedLocale {
  if (typeof raw === 'string' && (SUPPORTED_LOCALES as string[]).includes(raw)) {
    return raw as SupportedLocale;
  }
  return 'en';
}

export function ls(localeString: ILocaleString, locale: SupportedLocale): string {
  return localeString[locale] || localeString.en;
}
