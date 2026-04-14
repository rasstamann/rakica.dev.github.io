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
    'Claude', 'Agentic Programming',
  ],
  experience: [
    {
      company: 'grapho-metronic gmbh',
      role: { en: 'Software Engineer', de: 'Software Engineer' },
      startDate: '2023-01',
      endDate: null,
      bullets: [
        {
          en: 'Contributed to several C++/Qt projects in the field of inline image processing using embedded Linux and industrial PCs',
          de: 'Mitarbeit an mehreren C++/Qt Projekten im Bereich der Inline-Bildverarbeitung mit embedded Linux und industriellen PCs',
        },
        {
          en: 'Implemented multithreaded real-time components for controlling stepper motors and Basler camera systems',
          de: 'Implementierung von multithreadfähigen Echtzeitkomponenten für die Steuerung von Schrittmotoren und Basler-Kamerasystemen',
        },
        {
          en: 'Developed new algorithms for color stripe detection in the printing process and distance measurement in the micrometer range',
          de: 'Entwicklung neuer Algorithmen, unter anderem zur Farbstreifenerkennung im Druckprozess und zur Abstandsmessung im Mikrometerbereich',
        },
        {
          en: 'Established the foundations for company-wide coding guidelines in C++',
          de: 'Die Grundlagen für unternehmensweite Coding-Richtlinien in C++ geschaffen',
        },
      ],
    },
    {
      company: '—',
      role: { en: 'Relocation to Germany', de: 'Umzug nach Deutschland' },
      startDate: '2021-04',
      endDate: '2023-01',
      bullets: [
        {
          en: "Relocated to Germany; focused on family, language acquisition, and completing my Bachelor's thesis",
          de: 'Umzug nach Deutschland; Fokus auf Familie, Spracherwerb und Abschluss der Bachelorarbeit',
        },
        {
          en: 'Supplementary part-time work in retail (2022)',
          de: 'Ergänzende Teilzeittätigkeit im Einzelhandel (2022)',
        },
      ],
    },
    {
      company: 'ZR VesnaR',
      role: { en: 'Assistant to Bakery Owner', de: 'Assistent der Bäckereibesitzerin' },
      startDate: '2009-11',
      endDate: '2021-04',
      bullets: [
        {
          en: 'Managed a family business with 10 employees',
          de: 'Leitung eines Familienunternehmens mit 10 Mitarbeitern',
        },
        {
          en: 'Handled direct sales to customers and took custom orders for catering',
          de: 'Direktverkauf an Kunden abgewickelt und Sonderbestellungen für das Catering entgegengenommen',
        },
        {
          en: 'Shared responsibility for finances, procurement, delivery, and basic administrative tasks',
          de: 'Gemeinsam verantwortlich für Finanzen, Beschaffung, Lieferung und grundlegende Verwaltungsaufgaben',
        },
      ],
    },
    {
      company: 'application software partner',
      role: { en: 'Software Developer', de: 'Software Developer' },
      startDate: '2018-09',
      endDate: '2019-05',
      bullets: [
        {
          en: 'Contributed to four independent projects as extensions of an existing insurance management system',
          de: 'Mitarbeit an vier eigenständigen Projekten als Erweiterungen eines bestehenden Versicherungsverwaltungssystems',
        },
        {
          en: 'Worked primarily in C# and MSSQL across four independent module projects',
          de: 'Die Arbeit erfolgte hauptsächlich mit C# und MSSQL im Rahmen von vier eigenständigen Modulprojekten',
        },
      ],
    },
    {
      company: 'CITI d.o.o.',
      role: { en: 'Junior Embedded Software Developer', de: 'Junior Embedded Software Developer' },
      startDate: '2016-10',
      endDate: '2017-05',
      bullets: [
        {
          en: 'Contributed to projects for the development and implementation of embedded systems on STMicroelectronics ARM processors',
          de: 'Mitarbeit an Projekten zur Entwicklung und Implementierung von Embedded-Systemen auf ARM-Prozessoren von STMicroelectronics',
        },
        {
          en: 'Created user interfaces in Java and C++ and defined communication protocols between ARM devices and PC applications',
          de: 'Erstellung von Benutzeroberflächen in Java und C++ sowie Definition von Kommunikationsprotokollen zwischen ARM-Geräten und PC-Anwendungen',
        },
      ],
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
