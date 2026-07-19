import mongoose from 'mongoose';
import { connectDb } from '../lib/db';
import Profile from '../models/Profile';
import Project from '../models/Project';

const seedData = {
  name: 'Aleksandar Rakić',
  tagline: {
    en: 'Engineer, C++ developer, Lego enjoyer, cook, husband, dad and sometimes asleep',
    de: 'Ingenieur, C++ Entwickler, Lego-Enthusiast, Koch, Ehemann, Papa und manchmal am Schlafen',
  },
  summary: {
    en: 'Experienced software engineer with 3 years of experience in C++, Qt, and Embedded Linux. I am used to analyzing problems in detail and carefully developing and testing robust solutions. I place great importance on knowledge transfer and transparency at work: detailed documentation and peer reviews are a must for me. I enjoy refining details while always keeping the big picture in mind.',
    de: 'Erfahrener Softwareingenieur mit 3 Jahren Erfahrung in C++, Qt und Embedded Linux. Ich bin es gewohnt, Probleme detailliert zu analysieren und robuste Lösungen sorgfältig zu entwickeln und zu testen. Ich lege großen Wert auf Wissenstransfer und Transparenz bei der Arbeit: Eine detaillierte Dokumentation und Peer-Reviews sind für mich ein Muss. Es macht mir Spaß, Details zu verfeinern und dabei stets das große Ganze im Blick zu behalten.',
  },
  links: {
    github: 'https://github.com/rasstamann',
    linkedin: 'https://www.linkedin.com/in/aleksandarrakic88/',
    email: 'aleksandar.rakic.88@gmail.com',
  },
  skills: [
    'C++', 'C', 'C#', 'Java',
    'Qt', 'QML', 'OpenCV',
    'Embedded Linux', 'ARM', 'Zynq',
    'Sensor Technology', 'Image Processing',
    'Software Architecture', 'Design Patterns', 'UML',
    'User Interface',
    'Git', 'Gitea', 'Eclipse', 'Visual Studio Code',
    'Claude', 'Agentic Programming', 'CI/CD',
  ],
  experience: [
    {
      company: 'grapho-metronic gmbh',
      role: { en: 'Software Engineer', de: 'Software Engineer' },
      startDate: '2023-01',
      endDate: '2026-02',
    },
    {
      company: '—',
      role: { en: 'Relocation to Germany', de: 'Umzug nach Deutschland' },
      startDate: '2021-04',
      endDate: '2023-01',
    },
    {
      company: 'ZR VesnaR',
      role: { en: 'Assistant to Bakery Owner', de: 'Assistent der Bäckereibesitzerin' },
      startDate: '2009-11',
      endDate: '2021-04',
    },
    {
      company: 'application software partner',
      role: { en: 'Software Developer', de: 'Software Developer' },
      startDate: '2018-09',
      endDate: '2019-05',
    },
    {
      company: 'CITI d.o.o.',
      role: { en: 'Junior Embedded Software Developer', de: 'Junior Embedded Software Developer' },
      startDate: '2016-10',
      endDate: '2017-05',
    },
  ],
  education: [
    {
      institution: 'School of Electrical Engineering, University of Belgrade',
      degree: {
        en: 'BSc. in Electrical Engineering and Computer Science',
        de: 'B.Sc. Elektrotechnik und Informatik',
      },
      field: { en: 'Computer Science', de: 'Informatik' },
      startDate: '2006-10',
      endDate: '2025-09',
    },
    {
      institution: 'MicroConsult Academy GmbH',
      degree: {
        en: 'Modern C++: New Features in C++11 and C++14',
        de: 'Modernes C++: Neuerungen durch C++11 und C++14',
      },
      startDate: '2023-01',
      endDate: '2023-01',
    },
  ],
};

const projectSeedData = [
  {
    slug: 'personal-presentation',
    title: 'Personal Presentation Website',
    description: {
      en: 'Full-stack personal portfolio built with React, Express, Bun, and MongoDB. Real API calls are visible in DevTools — the architecture is the demo. Features EN/DE i18n, a GitHub Actions CI pipeline, and sticky navigation. Built with Claude.',
      de: 'Full-Stack-Portfolio mit React, Express, Bun und MongoDB. Echte API-Aufrufe sind im DevTools sichtbar — die Architektur ist das Demo. Mit EN/DE-Lokalisierung, GitHub Actions CI und Sticky-Navigation. Mit Claude gebaut.',
    },
    techStack: ['React', 'TypeScript', 'Express', 'Bun', 'MongoDB', 'TailwindCSS', 'GitHub Actions'],
    githubUrl: 'https://github.com/rasstamann/personal_presentation',
    status: 'Active',
    order: 0,
  },
];

async function seed() {
  await connectDb();

  // NOTE: findOneAndUpdate bypasses Mongoose validators by default.
  // This is intentional for a hardcoded seed. If seed data ever comes
  // from user input, add { runValidators: true } to the options.
  const result = await Profile.findOneAndUpdate({}, seedData, {
    upsert: true,
    returnDocument: 'after',
  });

  console.log(`Profile seeded: ${result.name}`);

  for (const project of projectSeedData) {
    const p = await Project.findOneAndUpdate({ slug: project.slug }, project, {
      upsert: true,
      returnDocument: 'after',
    });
    console.log(`Project seeded: ${p.title}`);
  }

  await mongoose.disconnect();
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
