import { describe, it, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Education } from './Education';
import type { EducationEntry } from '../types';

const mockEducation: EducationEntry[] = [
  {
    institution: 'University of Belgrade',
    degree: 'BSc. Computer Science',
    field: 'Computer Science',
    startDate: '2006-10',
    endDate: '2025-09',
  },
  {
    institution: 'MicroConsult Academy GmbH',
    degree: 'Modern C++: Features through C++11 and C++14',
    startDate: '2023-01',
    endDate: '2023-01',
  },
];

describe('Education', () => {
  it('renders nothing when education list is empty', () => {
    const { container } = render(<Education education={[]} locale="en" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a section with the Education heading', () => {
    render(<Education education={mockEducation} locale="en" />);
    expect(screen.getByRole('region', { name: /education/i })).toBeInTheDocument();
  });

  it('renders institution and degree for each entry', () => {
    render(<Education education={mockEducation} locale="en" />);
    expect(screen.getByText('University of Belgrade')).toBeInTheDocument();
    expect(screen.getByText(/BSc\. Computer Science/)).toBeInTheDocument();
    expect(screen.getByText('MicroConsult Academy GmbH')).toBeInTheDocument();
  });

  it('renders field of study when present', () => {
    render(<Education education={mockEducation} locale="en" />);
    expect(screen.getByText(/Computer Science/)).toBeInTheDocument();
  });

  it('does not render a dash for entries without a field', () => {
    render(<Education education={[mockEducation[1]]} locale="en" />);
    expect(screen.getByText('Modern C++: Features through C++11 and C++14')).toBeInTheDocument();
    expect(screen.queryByText(/—/)).not.toBeInTheDocument();
  });

  it('renders a single date (not a range) when startDate equals endDate', () => {
    render(<Education education={[mockEducation[1]]} locale="en" />);
    // Should not contain an en-dash for a single-month entry
    const dateEl = screen.queryByText(/–/);
    expect(dateEl).not.toBeInTheDocument();
  });

  it('renders German heading when locale is de', () => {
    render(<Education education={mockEducation} locale="de" />);
    expect(screen.getByText('Ausbildung')).toBeInTheDocument();
  });
});
