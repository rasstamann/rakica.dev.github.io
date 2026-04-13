import { describe, it, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DateRange } from './DateRange';

describe('DateRange', () => {
  it('renders a start–end range', () => {
    render(<DateRange startDate="2020-06" endDate="2022-12" locale="en" />);
    const el = screen.getByText(/Jun 2020/);
    expect(el).toBeInTheDocument();
    expect(el.textContent).toContain('Dec 2022');
  });

  it('renders "Present" for null endDate in English', () => {
    render(<DateRange startDate="2023-01" endDate={null} locale="en" />);
    expect(screen.getByText(/Present/)).toBeInTheDocument();
  });

  it('renders "Heute" for null endDate in German', () => {
    render(<DateRange startDate="2023-01" endDate={null} locale="de" />);
    expect(screen.getByText(/Heute/)).toBeInTheDocument();
  });

  it('renders a range when startDate equals endDate and singleMonthCollapse is false', () => {
    render(<DateRange startDate="2023-01" endDate="2023-01" locale="en" />);
    expect(screen.getByText(/–/)).toBeInTheDocument();
  });

  it('collapses to a single date when singleMonthCollapse is true and startDate equals endDate', () => {
    render(<DateRange startDate="2023-01" endDate="2023-01" locale="en" singleMonthCollapse />);
    expect(screen.queryByText(/–/)).not.toBeInTheDocument();
    expect(screen.getByText(/Jan 2023/)).toBeInTheDocument();
  });

  it('returns the raw string for a malformed startDate', () => {
    render(<DateRange startDate="2023" endDate={null} locale="en" />);
    expect(screen.getByText(/2023/)).toBeInTheDocument();
    expect(screen.queryByText('Invalid Date')).not.toBeInTheDocument();
  });

  it('formats dates in German locale', () => {
    render(<DateRange startDate="2020-01" endDate="2020-01" locale="de" />);
    // de-DE formats January as "Jan." (with dot)
    expect(screen.getByText(/Jan\./)).toBeInTheDocument();
  });
});
