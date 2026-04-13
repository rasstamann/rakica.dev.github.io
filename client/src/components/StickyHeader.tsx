import { Link, useLocation } from 'react-router-dom';
import type { SupportedLocale } from '../types';
import { LocaleSwitcher } from './LocaleSwitcher';

type Props = {
  visible: boolean;
  locale: SupportedLocale;
  setLocale: (l: SupportedLocale) => void;
};

export function StickyHeader({ visible, locale, setLocale }: Props) {
  const { pathname } = useLocation();

  return (
    <div
      aria-hidden={!visible}
      className={`fixed top-0 left-0 right-0 z-20 transition-transform duration-200 ease-in-out ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-2 bg-stone-50/90 backdrop-blur-sm border-b border-stone-100">
        {/* Identity — links back to home */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/avatar.png"
            alt="Home"
            className="h-8 w-8 rounded-full object-cover object-top ring-1 ring-stone-200 bg-stone-200"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
            }}
          />
        </Link>

        {/* Navigation + actions */}
        <div className="flex items-center gap-4">
          <nav aria-label="Site navigation" className="flex gap-4">
            <Link
              to="/"
              className={`text-xs font-medium transition-colors ${
                pathname === '/'
                  ? 'text-[#16a34a]'
                  : 'text-stone-500 hover:text-[#16a34a]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/projects"
              className={`text-xs font-medium transition-colors ${
                pathname === '/projects'
                  ? 'text-[#16a34a]'
                  : 'text-stone-500 hover:text-[#16a34a]'
              }`}
            >
              Projects
            </Link>
          </nav>
          <LocaleSwitcher locale={locale} setLocale={setLocale} />
        </div>
      </div>
    </div>
  );
}
