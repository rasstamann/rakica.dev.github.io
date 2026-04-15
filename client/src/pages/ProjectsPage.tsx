import { useEffect, useState } from 'react';
import type { Project, SupportedLocale } from '../types';
import { ProjectCard } from '../components/ProjectCard';

const FALLBACK_PROJECTS: Record<string, Project[]> = {
  en: [{
    slug: 'personal-presentation',
    title: 'Personal Presentation Website',
    description: 'Full-stack personal portfolio built with React, Express, Bun, and MongoDB. Real API calls are visible in DevTools — the architecture is the demo. Features EN/DE i18n, a GitHub Actions CI pipeline, and sticky navigation. Built with Claude.',
    techStack: ['React', 'TypeScript', 'Express', 'Bun', 'MongoDB', 'TailwindCSS', 'GitHub Actions'],
    githubUrl: 'https://github.com/rasstamann/personal_presentation',
    status: 'Active',
    order: 0,
  }],
  de: [{
    slug: 'personal-presentation',
    title: 'Personal Presentation Website',
    description: 'Full-Stack-Portfolio mit React, Express, Bun und MongoDB. Echte API-Aufrufe sind im DevTools sichtbar — die Architektur ist das Demo. Mit EN/DE-Lokalisierung, GitHub Actions CI und Sticky-Navigation. Mit Claude gebaut.',
    techStack: ['React', 'TypeScript', 'Express', 'Bun', 'MongoDB', 'TailwindCSS', 'GitHub Actions'],
    githubUrl: 'https://github.com/rasstamann/personal_presentation',
    status: 'Active',
    order: 0,
  }],
};

type Props = { locale: SupportedLocale };

export function ProjectsPage({ locale }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/projects?lang=${locale}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText || 'Request failed');
        return res.json() as Promise<Project[]>;
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('Failed to load projects:', err);
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

  const displayProjects = projects.length > 0
    ? projects
    : (FALLBACK_PROJECTS[locale] ?? FALLBACK_PROJECTS.en);

  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-16">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="text-2xl font-bold text-[#1c1917]">Projects</h1>
        {displayProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}
      </div>
    </main>
  );
}
