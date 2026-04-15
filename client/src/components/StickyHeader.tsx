import { Link, useLocation } from 'react-router-dom';
import type { SupportedLocale } from '../types';
import { LocaleSwitcher } from './LocaleSwitcher';

type Props = {
  heroInView: boolean;
  locale: SupportedLocale;
  setLocale: (l: SupportedLocale) => void;
};

export function StickyHeader({ heroInView, locale, setLocale }: Props) {
  const { pathname } = useLocation();

  return (
    <div className="fixed top-0 left-[3%] right-[3%] z-20">
      <div className="flex items-center justify-between px-6 py-2 bg-stone-50/90 backdrop-blur-sm border-b border-stone-100">
        {/* Left: identity (animates in on scroll) + nav links (always visible) */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center transition-all duration-200 ${
              heroInView ? 'opacity-0 pointer-events-none -translate-y-1' : 'opacity-100 translate-y-0'
            }`}
          >
            <Link to="/" tabIndex={heroInView ? -1 : 0} aria-label="Home">
              <img
                src={`${import.meta.env.BASE_URL}avatar.png`}
                alt="Home"
                className="h-8 w-8 rounded-full object-cover object-top ring-1 ring-stone-200 bg-stone-200"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
                }}
              />
            </Link>
          </div>

          <nav aria-label="Site navigation" className="flex gap-4">
            <Link
              to="/"
              className={`text-xs font-medium transition-colors ${
                pathname === '/' ? 'text-[#16a34a]' : 'text-stone-500 hover:text-[#16a34a]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-xs font-medium transition-colors ${
                pathname === '/about' ? 'text-[#16a34a]' : 'text-stone-500 hover:text-[#16a34a]'
              }`}
            >
              About
            </Link>
            <Link
              to="/projects"
              className={`text-xs font-medium transition-colors ${
                pathname === '/projects' ? 'text-[#16a34a]' : 'text-stone-500 hover:text-[#16a34a]'
              }`}
            >
              Projects
            </Link>
          </nav>
        </div>

        {/* Right: locale switcher */}
        <LocaleSwitcher locale={locale} setLocale={setLocale} />
      </div>
    </div>
  );
}
