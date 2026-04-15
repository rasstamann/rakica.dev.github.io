import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

const mockProfile = {
  name: 'Test User',
  tagline: 'Test tagline',
  summary: 'Test summary text.',
  links: { github: 'https://github.com/test', email: 'test@test.com' },
  skills: ['TypeScript', 'React'],
  experience: [
    {
      company: 'Test Corp',
      role: 'Engineer',
      startDate: '2022-01',
      endDate: null,
      bullets: ['Did things'],
    },
  ],
  education: [
    {
      institution: 'Test University',
      degree: 'BSc Computer Science',
      startDate: '2018-09',
      endDate: '2022-06',
    },
  ],
};

const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = mock(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProfile),
    } as Response),
  ) as unknown as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

const { AboutPage } = await import('./AboutPage');

function renderAboutPage() {
  return render(
    <MemoryRouter>
      <AboutPage locale="en" />
    </MemoryRouter>,
  );
}

describe('AboutPage', () => {
  it('renders summary after successful fetch', async () => {
    renderAboutPage();
    await waitFor(() => {
      expect(screen.getByText('Test summary text.')).toBeInTheDocument();
    });
  });

  it('renders skills after successful fetch', async () => {
    renderAboutPage();
    await waitFor(() => {
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });
  });

  it('renders experience after successful fetch', async () => {
    renderAboutPage();
    await waitFor(() => {
      expect(screen.getByText('Test Corp')).toBeInTheDocument();
      expect(screen.getByText('Engineer')).toBeInTheDocument();
    });
  });

  it('renders education after successful fetch', async () => {
    renderAboutPage();
    await waitFor(() => {
      expect(screen.getByText('Test University')).toBeInTheDocument();
      expect(screen.getByText('BSc Computer Science')).toBeInTheDocument();
    });
  });

  it('shows fallback experience and education when fetch fails', async () => {
    globalThis.fetch = mock(() => Promise.reject(new Error('Network error'))) as unknown as typeof fetch;
    renderAboutPage();
    await waitFor(() => {
      expect(screen.getByText('grapho-metronic gmbh')).toBeInTheDocument();
      expect(screen.getByText('School of Electrical Engineering, University of Belgrade')).toBeInTheDocument();
    });
  });
});
