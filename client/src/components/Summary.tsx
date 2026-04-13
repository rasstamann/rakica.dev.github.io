import { SectionDivider } from './SectionDivider';

type SummaryProps = { summary: string };

export function Summary({ summary }: SummaryProps) {
  return (
    <section aria-label="About me" className="space-y-4">
      <SectionDivider />
      <p className="text-neutral-600 text-sm leading-relaxed">{summary}</p>
    </section>
  );
}
