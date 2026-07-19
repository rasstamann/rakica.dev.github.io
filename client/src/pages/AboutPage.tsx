import { useEffect, useState } from 'react';
import type { Profile, SupportedLocale, ExperienceEntry, EducationEntry } from '../types';
import { Summary } from '../components/Summary';
import { Skills } from '../components/Skills';
import { Experience } from '../components/Experience';
import { Education } from '../components/Education';

const FALLBACK_EXPERIENCE: Record<string, ExperienceEntry[]> = {
  en: [{
    company: 'grapho-metronic gmbh',
    role: 'Software Engineer',
    startDate: '2023-01',
    endDate: null,
  }],
  de: [{
    company: 'grapho-metronic gmbh',
    role: 'Software Engineer',
    startDate: '2023-01',
    endDate: null,
  }],
};

const FALLBACK_EDUCATION: Record<string, EducationEntry[]> = {
  en: [{
    institution: 'School of Electrical Engineering, University of Belgrade',
    degree: 'BSc. in Electrical Engineering and Computer Science',
    field: 'Computer Science',
    startDate: '2006-10',
    endDate: '2025-09',
  }],
  de: [{
    institution: 'School of Electrical Engineering, University of Belgrade',
    degree: 'B.Sc. Elektrotechnik und Informatik',
    field: 'Informatik',
    startDate: '2006-10',
    endDate: '2025-09',
  }],
};

type Props = { locale: SupportedLocale };

export function AboutPage({ locale }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-500 text-sm">Loading...</p>
      </div>
    );
  }

  const experience = profile?.experience ?? (FALLBACK_EXPERIENCE[locale] ?? FALLBACK_EXPERIENCE.en);
  const education = profile?.education ?? (FALLBACK_EDUCATION[locale] ?? FALLBACK_EDUCATION.en);

  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-16">
      <div className="w-full max-w-xl space-y-10">
        {profile && <Summary summary={profile.summary} />}
        {profile && <Skills skills={profile.skills} />}
        <Experience experience={experience} locale={locale} />
        <Education education={education} locale={locale} />
      </div>
    </main>
  );
}
