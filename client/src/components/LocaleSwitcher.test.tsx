import { describe, it, expect, mock, beforeEach, afterEach } from 'bun:test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LocaleSwitcher } from './LocaleSwitcher';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe('LocaleSwitcher', () => {
  it('renders EN and DE buttons', () => {
    const setLocale = mock(() => {});
    render(<LocaleSwitcher locale="en" setLocale={setLocale} />);
    expect(screen.getByRole('button', { name: /switch to en/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /switch to de/i })).toBeInTheDocument();
  });

  it('marks the active locale button as pressed', () => {
    const setLocale = mock(() => {});
    render(<LocaleSwitcher locale="en" setLocale={setLocale} />);
    expect(screen.getByRole('button', { name: /switch to en/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /switch to de/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('marks DE as pressed when locale is de', () => {
    const setLocale = mock(() => {});
    render(<LocaleSwitcher locale="de" setLocale={setLocale} />);
    expect(screen.getByRole('button', { name: /switch to de/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /switch to en/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls setLocale with "de" and persists to localStorage when DE is clicked', async () => {
    const setLocale = mock(() => {});
    render(<LocaleSwitcher locale="en" setLocale={setLocale} />);
    await userEvent.click(screen.getByRole('button', { name: /switch to de/i }));
    expect(setLocale).toHaveBeenCalledWith('de');
    expect(localStorage.getItem('locale')).toBe('de');
  });

  it('calls setLocale with "en" and persists to localStorage when EN is clicked', async () => {
    const setLocale = mock(() => {});
    render(<LocaleSwitcher locale="de" setLocale={setLocale} />);
    await userEvent.click(screen.getByRole('button', { name: /switch to en/i }));
    expect(setLocale).toHaveBeenCalledWith('en');
    expect(localStorage.getItem('locale')).toBe('en');
  });
});
