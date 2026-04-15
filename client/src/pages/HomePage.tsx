import { useEffect, useRef, useState } from 'react';
import type { Profile, SupportedLocale } from '../types';
import { Hero } from '../components/Hero';
import { Summary } from '../components/Summary';
import { Links } from '../components/Links';
import { Skills } from '../components/Skills';
import { Experience } from '../components/Experience';
import { Education } from '../components/Education';

const FALLBACK_TAGLINES: Record<string, string> = {
  en: 'Engineer, C++ developer, Lego enjoyer, cook, husband, dad and sometimes asleep',
  de: 'Ingenieur, C++ Entwickler, Lego-Enthusiast, Koch, Ehemann, Papa und manchmal am Schlafen',
};

const FALLBACK_LINKS = {
  github: 'https://github.com/rasstamann',
  linkedin: 'https://www.linkedin.com/in/aleksandarrakic88/',
  email: 'aleksandar.rakic.88@gmail.com',
};

type Props = {
  locale: SupportedLocale;
  onHeroVisibilityChange: (inView: boolean) => void;
};

export function HomePage({ locale, onHeroVisibilityChange }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/me?lang=${locale}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText || 'Request failed');
        return res.json() as Promise<Profile>;
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('Failed to load profile:', err);
        setLoading(false);
      });

    return () => controller.abort();
  }, [locale]);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => onHeroVisibilityChange(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [profile, onHeroVisibilityChange]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-500 text-sm">Loading...</p>
      </div>
    );
  }

  const displayProfile: Profile = profile ?? {
    name: 'Aleksandar Rakić',
    tagline: FALLBACK_TAGLINES[locale] ?? FALLBACK_TAGLINES.en,
    summary: '',
    links: FALLBACK_LINKS,
    skills: [],
    experience: [],
    education: [],
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">

      <div className="w-full max-w-xl space-y-10">
        <Hero ref={heroRef} name={displayProfile.name} tagline={displayProfile.tagline} />
        {profile && <Summary summary={profile.summary} />}
        <Links links={displayProfile.links} />
        <Skills skills={displayProfile.skills} />
        <Experience experience={displayProfile.experience} locale={locale} />
        <Education education={displayProfile.education} locale={locale} />
      </div>
    </main>
  );
}
