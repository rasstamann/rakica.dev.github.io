import type { ExperienceEntry, SupportedLocale } from '../types';
import { SectionDivider } from './SectionDivider';
import { DateRange } from './DateRange';

type ExperienceProps = { experience: ExperienceEntry[]; locale: SupportedLocale };

const LABELS = {
  heading: { en: 'Experience', de: 'Berufserfahrung' },
} as const;

export function Experience({ experience, locale }: ExperienceProps) {
  if (!experience?.length) return null;

  return (
    <section aria-label="Experience" className="space-y-4">
      <SectionDivider />
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        {LABELS.heading[locale]}
      </h2>
      <ol className="space-y-6">
        {experience.map((entry, i) => (
          <li key={i} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <div>
                <span className="text-sm font-semibold text-neutral-800">{entry.company}</span>
                <span className="text-sm text-neutral-500 ml-2">{entry.role}</span>
              </div>
              <DateRange startDate={entry.startDate} endDate={entry.endDate} locale={locale} />
            </div>
            {entry.bullets.length > 0 && (
              <ul className="mt-1 space-y-1 pl-4">
                {entry.bullets.map((bullet, j) => (
                  <li key={j} className="text-sm text-neutral-600 leading-snug list-disc">
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
