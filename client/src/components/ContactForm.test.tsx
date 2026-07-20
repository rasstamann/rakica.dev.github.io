import { describe, it, expect, mock, afterEach } from 'bun:test';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContactForm } from './ContactForm';

describe('ContactForm', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  function fillAndSubmit() {
    fireEvent.change(screen.getByLabelText('Your email'), {
      target: { value: 'visitor@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Hello' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hi there' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
  }

  it('shows a success message after a successful submit', async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve({ ok: true } as Response),
    ) as unknown as typeof fetch;

    render(<ContactForm />);
    fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();
    });
  });

  it('posts to /api/contact with the form values', async () => {
    const fetchSpy = mock((_url: string, _options: RequestInit) =>
      Promise.resolve({ ok: true } as Response),
    );
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    render(<ContactForm />);
    fillAndSubmit();

    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    const [url, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/contact');
    expect(JSON.parse(options.body as string)).toEqual({
      senderEmail: 'visitor@example.com',
      subject: 'Hello',
      message: 'Hi there',
    });
  });

  it('shows an error message when the request fails', async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve({ ok: false, statusText: 'Bad Request' } as Response),
    ) as unknown as typeof fetch;

    render(<ContactForm />);
    fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('shows a rate-limit message on a 429 response', async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve({ ok: false, status: 429 } as Response),
    ) as unknown as typeof fetch;

    render(<ContactForm />);
    fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText(/too many requests/i)).toBeInTheDocument();
    });
  });

  it('lets the user send another message after success', async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve({ ok: true } as Response),
    ) as unknown as typeof fetch;

    render(<ContactForm />);
    fillAndSubmit();

    await waitFor(() => expect(screen.getByText(/message sent/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /send another/i }));

    expect(screen.getByLabelText('Your email')).toBeInTheDocument();
  });
});
