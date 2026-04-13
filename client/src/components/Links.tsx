import type { ProfileLinks } from '../types';

type LinksProps = {
  links: ProfileLinks;
};

function isSafeUrl(url: string): boolean {
  return url.startsWith('https://');
}

export function Links({ links }: LinksProps) {
  return (
    <div className="space-y-2">
      <p aria-hidden="true" className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
        Get in touch
      </p>
    <nav aria-label="Contact" className="flex flex-wrap gap-4">
      {links.github && isSafeUrl(links.github) && (
        <a
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-sm font-medium text-stone-500 hover:text-[#16a34a] transition-colors duration-150 underline underline-offset-4 decoration-stone-300 hover:decoration-[#16a34a]"
        >
          GitHub
        </a>
      )}
      {links.linkedin && isSafeUrl(links.linkedin) && (
        <a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-sm font-medium text-stone-500 hover:text-[#16a34a] transition-colors duration-150 underline underline-offset-4 decoration-stone-300 hover:decoration-[#16a34a]"
        >
          LinkedIn
        </a>
      )}
      {links.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(links.email) && (
        <a
          href={`mailto:${links.email}`}
          aria-label="Email"
          className="text-sm font-medium text-stone-500 hover:text-[#16a34a] transition-colors duration-150 underline underline-offset-4 decoration-stone-300 hover:decoration-[#16a34a]"
        >
          Email
        </a>
      )}
    </nav>
    </div>
  );
}
