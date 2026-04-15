import { describe, it, expect, mock, beforeEach } from 'bun:test';
import type { Request, Response, NextFunction } from 'express';

// Mock mongoose before importing the module under test
mock.module('mongoose', () => ({
  default: {
    connection: { readyState: 0 },
    connect: mock(() => Promise.resolve()),
  },
}));

// Must import after mock is set up
const mongoose = (await import('mongoose')).default;
const { requireDb } = await import('../index');

function makeMockRes() {
  const res = {} as unknown as Response;
  (res as unknown as Record<string, unknown>).json = mock(() => res);
  (res as unknown as Record<string, unknown>).status = mock(() => res);
  return res as Response & {
    json: ReturnType<typeof mock>;
    status: ReturnType<typeof mock>;
  };
}

const mockReq = {} as Request;

describe('requireDb middleware', () => {
  beforeEach(() => {
    (mongoose.connection as unknown as Record<string, unknown>).readyState = 0;
  });

  it('returns 503 when DB is not connected (readyState 0)', () => {
    const res = makeMockRes();
    const next = mock(() => {});
    requireDb(mockReq, res, next as unknown as NextFunction);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database unavailable' });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() when DB is connected (readyState 1)', () => {
    (mongoose.connection as unknown as Record<string, unknown>).readyState = 1;
    const res = makeMockRes();
    const next = mock(() => {});
    requireDb(mockReq, res, next as unknown as NextFunction);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 503 when DB is connecting (readyState 2)', () => {
    (mongoose.connection as unknown as Record<string, unknown>).readyState = 2;
    const res = makeMockRes();
    const next = mock(() => {});
    requireDb(mockReq, res, next as unknown as NextFunction);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(next).not.toHaveBeenCalled();
  });
});
