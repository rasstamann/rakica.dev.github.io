import { describe, it, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the name as a heading', () => {
    render(<Hero name="Aleksandar Rakić" tagline="C++ developer" />);
    expect(screen.getByRole('heading', { name: 'Aleksandar Rakić' })).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Hero name="Aleksandar Rakić" tagline="C++ developer" />);
    expect(screen.getByText('C++ developer')).toBeInTheDocument();
  });

  it('renders an avatar image with the name as alt text', () => {
    render(<Hero name="Aleksandar Rakić" tagline="C++ developer" />);
    const img = screen.getByRole('img', { name: 'Aleksandar Rakić' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/avatar.png');
  });
});
