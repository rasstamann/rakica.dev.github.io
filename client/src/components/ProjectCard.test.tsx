import { describe, it, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../types';

const baseProject: Project = {
  slug: 'test-project',
  title: 'Test Project',
  description: 'A test project description',
  techStack: ['TypeScript', 'React'],
  order: 0,
};

describe('ProjectCard', () => {
  it('renders title and description', () => {
    render(<ProjectCard project={baseProject} />);
    expect(screen.getByRole('heading', { name: 'Test Project' })).toBeInTheDocument();
    expect(screen.getByText('A test project description')).toBeInTheDocument();
  });

  it('renders one tag per tech stack entry', () => {
    render(<ProjectCard project={baseProject} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders GitHub link when githubUrl present', () => {
    render(<ProjectCard project={{ ...baseProject, githubUrl: 'https://github.com/test' }} />);
    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com/test');
  });

  it('does not render GitHub link when githubUrl absent', () => {
    render(<ProjectCard project={baseProject} />);
    expect(screen.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument();
  });

  it('renders live URL link when liveUrl present', () => {
    render(<ProjectCard project={{ ...baseProject, liveUrl: 'https://example.com' }} />);
    const link = screen.getByRole('link', { name: 'Live' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('does not render live URL link when liveUrl absent', () => {
    render(<ProjectCard project={baseProject} />);
    expect(screen.queryByRole('link', { name: 'Live' })).not.toBeInTheDocument();
  });

  it('renders screenshot when screenshotUrl present', () => {
    render(<ProjectCard project={{ ...baseProject, screenshotUrl: 'https://example.com/img.png' }} />);
    const img = screen.getByRole('img', { name: 'Test Project screenshot' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/img.png');
  });

  it('does not render screenshot when screenshotUrl absent', () => {
    render(<ProjectCard project={baseProject} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders status badge when status present', () => {
    render(<ProjectCard project={{ ...baseProject, status: 'Active' }} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('does not render status badge when status absent', () => {
    render(<ProjectCard project={baseProject} />);
    expect(screen.queryByText('Active')).not.toBeInTheDocument();
  });
});
