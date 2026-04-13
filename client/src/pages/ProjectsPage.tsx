import { useEffect, useState } from 'react';
import type { Project, SupportedLocale } from '../types';
import { ProjectCard } from '../components/ProjectCard';

type Props = { locale: SupportedLocale };

export function ProjectsPage({ locale }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

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
        setError('Could not load projects');
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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-16">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="text-2xl font-bold text-[#1c1917]">Projects</h1>
        {projects.length === 0 ? (
          <p className="text-sm text-stone-500">No projects yet.</p>
        ) : (
          projects.map((project) => <ProjectCard key={project.slug} project={project} />)
        )}
      </div>
    </main>
  );
}
