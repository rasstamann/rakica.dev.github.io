import { describe, it, expect } from 'bun:test';
import { connectDb } from './db';

// NOTE: These tests cover the guard and rejection behaviour only.
// We deliberately do not spin up a real or in-memory MongoDB here —
// the happy path (successful connect, readyState short-circuit) is
// covered by the seed script and manual E2E verification.
describe('connectDb', () => {
  it('exports a function', () => {
    expect(typeof connectDb).toBe('function');
  });

  it('rejects when MONGODB_URI is not set', async () => {
    const savedUri = process.env.MONGODB_URI;
    delete process.env.MONGODB_URI;

    await expect(connectDb()).rejects.toThrow('MONGODB_URI environment variable is not set');

    process.env.MONGODB_URI = savedUri;
  });
});
