import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectsPage } from './ProjectsPage';

const mockProjects = [
  {
    slug: 'project-one',
    title: 'Project One',
    description: 'First project description',
    techStack: ['TypeScript', 'React'],
    githubUrl: 'https://github.com/test/one',
    status: 'Active',
    order: 0,
  },
  {
    slug: 'project-two',
    title: 'Project Two',
    description: 'Second project description',
    techStack: ['Bun'],
    order: 1,
  },
];

const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = mock(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProjects),
    } as Response),
  ) as unknown as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('ProjectsPage', () => {
  it('shows loading state initially', () => {
    render(<ProjectsPage locale="en" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders one ProjectCard per project on success', async () => {
    render(<ProjectsPage locale="en" />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Project One' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Project Two' })).toBeInTheDocument();
    });
  });

  it('fetches with the correct locale', async () => {
    render(<ProjectsPage locale="de" />);
    await waitFor(() => {
      const fetchMock = globalThis.fetch as unknown as ReturnType<typeof mock>;
      expect(fetchMock.mock.calls[0]?.[0]).toMatch(/\/api\/projects\?lang=de/);
    });
  });

  it('shows error message on failed fetch', async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response),
    ) as unknown as typeof fetch;

    render(<ProjectsPage locale="en" />);
    await waitFor(() => {
      expect(screen.getByText('Could not load projects')).toBeInTheDocument();
    });
  });
});
