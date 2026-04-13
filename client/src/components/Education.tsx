import type { EducationEntry, SupportedLocale } from '../types';
import { SectionDivider } from './SectionDivider';
import { DateRange } from './DateRange';

type EducationProps = { education: EducationEntry[]; locale: SupportedLocale };

const LABELS = {
  heading: { en: 'Education', de: 'Ausbildung' },
} as const;

export function Education({ education, locale }: EducationProps) {
  if (!education?.length) return null;

  return (
    <section aria-label="Education" className="space-y-4">
      <SectionDivider />
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        {LABELS.heading[locale]}
      </h2>
      <ol className="space-y-4">
        {education.map((entry, i) => (
          <li key={i} className="flex flex-col gap-0.5">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <span className="text-sm font-semibold text-neutral-800">{entry.institution}</span>
              <DateRange startDate={entry.startDate} endDate={entry.endDate} locale={locale} singleMonthCollapse />
            </div>
            <p className="text-sm text-neutral-600">
              {entry.degree}
              {entry.field ? ` — ${entry.field}` : ''}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
