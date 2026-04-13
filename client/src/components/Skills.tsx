import { SectionDivider } from './SectionDivider';

type SkillsProps = {
  skills: string[];
};

const SKILL_GROUPS: { label: string; skills: string[] }[] = [
  { label: 'Languages', skills: ['C++', 'C', 'C#', 'Java'] },
  { label: 'Frameworks', skills: ['Qt', 'QML', 'OpenCV'] },
  { label: 'Platforms', skills: ['Embedded Linux', 'ARM', 'Zynq'] },
  {
    label: 'Domain',
    skills: ['Sensor Technology', 'Image Processing', 'Software Architecture', 'Design Patterns', 'UML', 'User Interface'],
  },
  { label: 'Tooling', skills: ['Git', 'Gitea', 'Eclipse', 'Visual Studio Code'] },
  { label: 'Emerging', skills: ['Claude', 'Agentic Programming'] },
];

function SkillGroup({ label, skills }: { label: string; skills: string[] }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 w-20 shrink-0">
        {label}
      </span>
      <ul className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li key={skill}>
            <span className="rounded-md border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-medium text-[#78716c]">
              {skill}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Skills({ skills }: SkillsProps) {
  if (!skills.length) return null;

  const skillSet = new Set(skills);
  const grouped = new Set<string>();

  const groups = SKILL_GROUPS.map(({ label, skills: groupSkills }) => {
    const present = groupSkills.filter((s) => skillSet.has(s));
    present.forEach((s) => grouped.add(s));
    return { label, present };
  }).filter(({ present }) => present.length > 0);

  const ungrouped = skills.filter((s) => !grouped.has(s));

  return (
    <section aria-label="Skills" className="space-y-4">
      <SectionDivider />
      <div className="space-y-3">
        {groups.map(({ label, present }) => (
          <SkillGroup key={label} label={label} skills={present} />
        ))}
        {ungrouped.length > 0 && <SkillGroup label="Other" skills={ungrouped} />}
      </div>
    </section>
  );
}
