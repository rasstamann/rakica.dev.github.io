import type { Project } from '../types';

type Props = { project: Project };

export function ProjectCard({ project }: Props) {
  return (
    <article className="space-y-3 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-base font-semibold text-[#1c1917]">{project.title}</h2>
        {project.status && (
          <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            {project.status}
          </span>
        )}
      </div>

      <p className="text-sm text-stone-600 leading-relaxed">{project.description}</p>

      {project.screenshotUrl && (
        <img
          src={project.screenshotUrl}
          alt={`${project.title} screenshot`}
          className="w-full rounded border border-stone-100 object-cover"
        />
      )}

      <div className="flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex gap-4 pt-1">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-stone-500 hover:text-[#16a34a] transition-colors"
          >
            GitHub
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-stone-500 hover:text-[#16a34a] transition-colors"
          >
            Live
          </a>
        )}
      </div>
    </article>
  );
}
