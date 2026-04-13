export type SupportedLocale = 'en' | 'de';

export type ProfileLinks = {
  github?: string;
  linkedin?: string;
  email?: string;
};

export type ExperienceEntry = {
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  bullets: string[];
};

export type EducationEntry = {
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate: string | null;
};

export type Profile = {
  name: string;
  tagline: string;
  summary: string;
  links: ProfileLinks;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  screenshotUrl?: string;
  status?: string;
  order: number;
};
