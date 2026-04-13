import { describe, it, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Skills } from './Skills';

describe('Skills', () => {
  it('renders one tag per skill', () => {
    render(<Skills skills={['TypeScript', 'React', 'Bun']} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Bun')).toBeInTheDocument();
  });

  it('renders nothing when skills list is empty', () => {
    const { container } = render(<Skills skills={[]} />);
    expect(container.querySelectorAll('span')).toHaveLength(0);
  });

  it('renders a known skill under its group label', () => {
    render(<Skills skills={['C++', 'Qt']} />);
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('C++')).toBeInTheDocument();
    expect(screen.getByText('Frameworks')).toBeInTheDocument();
    expect(screen.getByText('Qt')).toBeInTheDocument();
  });

  it('renders unknown skills under the Other group', () => {
    render(<Skills skills={['UnknownSkill']} />);
    expect(screen.getByText('Other')).toBeInTheDocument();
    expect(screen.getByText('UnknownSkill')).toBeInTheDocument();
  });

  it('does not render a group label for skills absent from the props', () => {
    // Only C++ provided — Frameworks group should not appear
    render(<Skills skills={['C++']} />);
    expect(screen.queryByText('Frameworks')).not.toBeInTheDocument();
  });
});
