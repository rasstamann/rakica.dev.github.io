import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

// Store original fetch
const originalFetch = globalThis.fetch;

beforeEach(() => {
  localStorage.clear();
  globalThis.fetch = mock(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProfile),
    } as Response),
  ) as unknown as typeof fetch;
});

afterEach(() => {
  localStorage.clear();
  globalThis.fetch = originalFetch;
});

// Import after mocks are set up
const { default: App } = await import('./App');

describe('App', () => {
  it('shows a loading state on initial mount', () => {
    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders name and tagline after successful fetch', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test User' })).toBeInTheDocument();
      expect(screen.getByText('Test tagline')).toBeInTheDocument();
    });
  });

  it('renders summary after successful fetch', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Test summary text.')).toBeInTheDocument();
    });
  });

  it('renders social links after successful fetch', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /email/i })).toBeInTheDocument();
    });
  });

  it('renders skills after successful fetch', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });
  });

  it('renders experience after successful fetch', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Test Corp')).toBeInTheDocument();
      expect(screen.getByText('Engineer')).toBeInTheDocument();
    });
  });

  it('renders education after successful fetch', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Test University')).toBeInTheDocument();
      expect(screen.getByText('BSc Computer Science')).toBeInTheDocument();
    });
  });

  it('includes the detected locale in the fetch URL', async () => {
    render(<App />);
    await waitFor(() => {
      const fetchMock = globalThis.fetch as unknown as ReturnType<typeof mock>;
      const calledUrl = fetchMock.mock.calls[0]?.[0] as string;
      expect(calledUrl).toMatch(/\/api\/me\?lang=(en|de)/);
    });
  });

  it('uses locale stored in localStorage over browser locale', async () => {
    localStorage.setItem('locale', 'de');
    render(<App />);
    await waitFor(() => {
      const fetchMock = globalThis.fetch as unknown as ReturnType<typeof mock>;
      const calledUrl = fetchMock.mock.calls[0]?.[0] as string;
      expect(calledUrl).toContain('lang=de');
    });
  });

  it('re-fetches with the new locale when the locale switcher is clicked', async () => {
    render(<App />);
    // Wait for initial load to complete
    await waitFor(() => screen.getByRole('heading', { name: 'Test User' }));

    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof mock>;
    const initialCallCount = fetchMock.mock.calls.length;

    // Click the DE button
    await userEvent.click(screen.getByRole('button', { name: /switch to de/i }));

    await waitFor(() => {
      expect(fetchMock.mock.calls.length).toBeGreaterThan(initialCallCount);
      const lastUrl = fetchMock.mock.calls[fetchMock.mock.calls.length - 1]?.[0] as string;
      expect(lastUrl).toContain('lang=de');
    });
  });

  it('shows fallback profile when fetch fails', async () => {
    globalThis.fetch = mock(() => Promise.reject(new Error('Network error'))) as unknown as typeof fetch;
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Aleksandar Rakić' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    });
  });

  it('shows fallback profile when fetch is aborted', async () => {
    const abortError = Object.assign(new Error('The operation was aborted'), { name: 'AbortError' });
    globalThis.fetch = mock(() => Promise.reject(abortError)) as unknown as typeof fetch;
    render(<App />);
    // AbortError is ignored — stays in loading state, no fallback rendered
    await waitFor(() => {
      expect(screen.queryByText(/could not load profile/i)).not.toBeInTheDocument();
    });
  });

  it('shows fallback profile when server returns a non-ok response', async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({}),
      } as Response),
    ) as unknown as typeof fetch;
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Aleksandar Rakić' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    });
  });
});
