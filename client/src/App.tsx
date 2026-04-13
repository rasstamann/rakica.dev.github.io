import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import type { SupportedLocale } from './types';
import { LocaleSwitcher } from './components/LocaleSwitcher';
import { StickyHeader } from './components/StickyHeader';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';

function detectLocale(): SupportedLocale {
  const lang = navigator.language ?? '';
  return lang.startsWith('de') ? 'de' : 'en';
}

export default function App() {
  const [locale, setLocale] = useState<SupportedLocale>(() => {
    const stored = localStorage.getItem('locale');
    if (stored === 'en' || stored === 'de') return stored;
    return detectLocale();
  });

  const [heroInView, setHeroInView] = useState(true);

  return (
    <BrowserRouter>
      <div className="fixed top-0 left-0 h-full w-[33px] bg-gradient-to-r from-green-600/50 to-stone-50 hidden sm:block" aria-hidden="true" />
      <div className="fixed top-0 right-0 h-full w-[33px] bg-gradient-to-l from-violet-600/50 to-stone-50 hidden sm:block" aria-hidden="true" />
      <div className={`fixed top-4 right-10 z-10 transition-opacity duration-200 ${heroInView ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <LocaleSwitcher locale={locale} setLocale={setLocale} />
      </div>
      <StickyHeader
        visible={!heroInView}
        locale={locale}
        setLocale={setLocale}
      />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage locale={locale} onHeroVisibilityChange={setHeroInView} />
          }
        />
        <Route path="/projects" element={<ProjectsPage locale={locale} />} />
      </Routes>
    </BrowserRouter>
  );
}
