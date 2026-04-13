import type { SupportedLocale } from '../types';

type Props = {
  locale: SupportedLocale;
  setLocale: (l: SupportedLocale) => void;
  className?: string;
};

export function LocaleSwitcher({ locale, setLocale, className = '' }: Props) {
  function handleSwitch(next: SupportedLocale) {
    localStorage.setItem('locale', next);
    setLocale(next);
  }

  return (
    <nav aria-label="Language switcher" className={`flex gap-1 ${className}`}>
      {(['en', 'de'] as const).map((l) => (
        <button
          key={l}
          onClick={() => handleSwitch(l)}
          aria-pressed={locale === l}
          aria-label={`Switch to ${l.toUpperCase()}`}
          className={`text-xs font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded transition-colors ${
            locale === l ? 'text-neutral-800' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </nav>
  );
}
