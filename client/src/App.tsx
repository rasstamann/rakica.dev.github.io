import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import type { SupportedLocale } from './types';
import { StickyHeader } from './components/StickyHeader';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
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
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="fixed top-0 left-0 h-full w-[3%] bg-gradient-to-r from-green-600/50 to-stone-50" aria-hidden="true" />
      <div className="fixed top-0 right-0 h-full w-[3%] bg-gradient-to-l from-violet-600/50 to-stone-50" aria-hidden="true" />
      <StickyHeader heroInView={heroInView} locale={locale} setLocale={setLocale} />
      <Routes>
        <Route
          path="/"
          element={<HomePage locale={locale} onHeroVisibilityChange={setHeroInView} />}
        />
        <Route path="/about" element={<AboutPage locale={locale} />} />
        <Route path="/projects" element={<ProjectsPage locale={locale} />} />
      </Routes>
    </BrowserRouter>
  );
}
