import { describe, it, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Experience } from './Experience';
import type { ExperienceEntry } from '../types';

const mockExperience: ExperienceEntry[] = [
  {
    company: 'Acme Corp',
    role: 'Software Engineer',
    startDate: '2023-01',
    endDate: null,
    bullets: ['Built things', 'Fixed bugs'],
  },
  {
    company: 'Old Job',
    role: 'Junior Developer',
    startDate: '2020-06',
    endDate: '2022-12',
    bullets: [],
  },
];

describe('Experience', () => {
  it('renders nothing when experience list is empty', () => {
    const { container } = render(<Experience experience={[]} locale="en" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a section with the Experience heading', () => {
    render(<Experience experience={mockExperience} locale="en" />);
    expect(screen.getByRole('region', { name: /experience/i })).toBeInTheDocument();
  });

  it('renders the company name and role for each entry', () => {
    render(<Experience experience={mockExperience} locale="en" />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Old Job')).toBeInTheDocument();
    expect(screen.getByText('Junior Developer')).toBeInTheDocument();
  });

  it('renders bullet points', () => {
    render(<Experience experience={mockExperience} locale="en" />);
    expect(screen.getByText('Built things')).toBeInTheDocument();
    expect(screen.getByText('Fixed bugs')).toBeInTheDocument();
  });

  it('shows "Present" for entries with null endDate in English', () => {
    render(<Experience experience={mockExperience} locale="en" />);
    expect(screen.getByText(/present/i)).toBeInTheDocument();
  });

  it('shows "Heute" for entries with null endDate in German', () => {
    render(<Experience experience={mockExperience} locale="de" />);
    // "Heute" appears as a text node inside a span that also contains the start date,
    // so we match the span's full text content with a regex.
    expect(screen.getByText(/Heute/)).toBeInTheDocument();
  });

  it('renders German heading when locale is de', () => {
    render(<Experience experience={mockExperience} locale="de" />);
    expect(screen.getByText('Berufserfahrung')).toBeInTheDocument();
  });

  it('renders entries with no bullets without crashing', () => {
    const { container } = render(<Experience experience={[mockExperience[1]]} locale="en" />);
    expect(screen.getByText('Old Job')).toBeInTheDocument();
    // No bullet <ul> rendered when bullets array is empty
    expect(container.querySelector('ul')).toBeNull();
  });
});
