import { describe, it, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Links } from './Links';

describe('Links', () => {
  it('renders a GitHub link when github is provided', () => {
    render(<Links links={{ github: 'https://github.com/test' }} />);
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/test',
    );
  });

  it('renders an email link with mailto prefix', () => {
    render(<Links links={{ email: 'test@test.com' }} />);
    expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute(
      'href',
      'mailto:test@test.com',
    );
  });

  it('does not render a link for missing fields', () => {
    render(<Links links={{ github: 'https://github.com/test' }} />);
    expect(screen.queryByRole('link', { name: /linkedin/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /email/i })).not.toBeInTheDocument();
  });

  it('does not render a link for unsafe URLs', () => {
    render(<Links links={{ github: 'javascript:alert(1)', linkedin: 'data:text/html,bad' }} />);
    expect(screen.queryByRole('link', { name: /github/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /linkedin/i })).not.toBeInTheDocument();
  });

  it('does not render a github link for http:// URLs (https only)', () => {
    render(<Links links={{ github: 'http://github.com/test' }} />);
    expect(screen.queryByRole('link', { name: /github/i })).not.toBeInTheDocument();
  });

  it('does not render an email link for invalid email addresses', () => {
    render(<Links links={{ email: 'not-an-email' }} />);
    expect(screen.queryByRole('link', { name: /email/i })).not.toBeInTheDocument();
  });

  it('renders all three links when all fields are present', () => {
    render(
      <Links
        links={{
          github: 'https://github.com/test',
          linkedin: 'https://linkedin.com/in/test',
          email: 'test@test.com',
        }}
      />,
    );
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /email/i })).toBeInTheDocument();
  });
});
