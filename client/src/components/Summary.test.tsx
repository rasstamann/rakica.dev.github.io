import { describe, it, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Summary } from './Summary';

describe('Summary', () => {
  it('renders the summary text', () => {
    render(<Summary summary="An experienced engineer." />);
    expect(screen.getByText('An experienced engineer.')).toBeInTheDocument();
  });

  it('renders inside a landmark section', () => {
    render(<Summary summary="Test summary." />);
    expect(screen.getByRole('region', { name: /about me/i })).toBeInTheDocument();
  });
});
