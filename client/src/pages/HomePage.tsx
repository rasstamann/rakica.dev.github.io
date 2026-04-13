import { useEffect, useRef, useState } from 'react';
import type { Profile, SupportedLocale } from '../types';
import { Hero } from '../components/Hero';
import { Summary } from '../components/Summary';
import { Links } from '../components/Links';
import { Skills } from '../components/Skills';
import { Experience } from '../components/Experience';
import { Education } from '../components/Education';

type Props = {
  locale: SupportedLocale;
  onHeroVisibilityChange: (inView: boolean) => void;
};

export function HomePage({ locale, onHeroVisibilityChange }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

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
        setError('Could not load profile');
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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-500 text-sm">No profile data available.</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl space-y-10">
        <Hero ref={heroRef} name={profile.name} tagline={profile.tagline} />
        <Summary summary={profile.summary} />
        <Links links={profile.links} />
        <Skills skills={profile.skills} />
        <Experience experience={profile.experience} locale={locale} />
        <Education education={profile.education} locale={locale} />
      </div>
    </main>
  );
}
