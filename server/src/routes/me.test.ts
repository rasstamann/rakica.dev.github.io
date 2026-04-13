import { describe, it, expect, mock, beforeEach } from 'bun:test';
import type { Request, Response } from 'express';

// --- mock profile data (locale-keyed shape, as stored in DB) ---
const mockProfileData = {
  name: 'Test User',
  tagline: { en: 'EN tagline', de: 'DE Tagline' },
  summary: { en: 'EN summary', de: 'DE Zusammenfassung' },
  links: { github: 'https://github.com/test', email: 'test@test.com' },
  skills: ['TypeScript', 'Bun'],
  experience: [
    {
      company: 'Acme Corp',
      role: { en: 'Software Engineer', de: 'Software-Ingenieur' },
      startDate: '2023-01',
      endDate: null,
      bullets: [
        { en: 'Did EN things', de: 'Hat DE Dinge gemacht' },
      ],
    },
  ],
  education: [
    {
      institution: 'Test University',
      degree: { en: 'BSc Computer Science', de: 'B.Sc. Informatik' },
      field: { en: 'Computer Science', de: 'Informatik' },
      startDate: '2020-09',
      endDate: '2024-06',
    },
  ],
};

// Mutable so individual tests can override the resolved value
let mockResult: typeof mockProfileData | null = mockProfileData;
let mockDbError: Error | null = null;

const leanSpy = mock(() =>
  mockDbError ? Promise.reject(mockDbError) : Promise.resolve(mockResult),
);
const selectSpy = mock(() => ({ lean: leanSpy }));
const findOneSpy = mock(() => ({ select: selectSpy }));

// Must be called before the module under test is imported
mock.module('../models/Profile', () => ({
  default: { findOne: findOneSpy },
}));

const { getMeHandler, resolveLocale, flattenProfile } = await import('./me');

// --- helpers ---
function makeMockReq(lang?: string): Request {
  return { query: lang !== undefined ? { lang } : {} } as unknown as Request;
}

function makeMockRes() {
  const res = {} as unknown as Response;
  (res as unknown as Record<string, unknown>).json = mock(() => res);
  (res as unknown as Record<string, unknown>).status = mock(() => res);
  return res as Response & {
    json: ReturnType<typeof mock>;
    status: ReturnType<typeof mock>;
  };
}

// --- unit tests for locale helpers ---
describe('resolveLocale', () => {
  it('returns "en" for undefined', () => {
    expect(resolveLocale(undefined)).toBe('en');
  });

  it('returns "en" for an unknown locale string', () => {
    expect(resolveLocale('fr')).toBe('en');
  });

  it('returns "en" for non-string values', () => {
    expect(resolveLocale(42)).toBe('en');
  });

  it('returns "en" for the "en" locale', () => {
    expect(resolveLocale('en')).toBe('en');
  });

  it('returns "de" for the "de" locale', () => {
    expect(resolveLocale('de')).toBe('de');
  });
});

describe('flattenProfile', () => {
  it('flattens locale strings to English by default', () => {
    const result = flattenProfile(mockProfileData, 'en');
    expect(result.tagline).toBe('EN tagline');
    expect(result.summary).toBe('EN summary');
    expect(result.experience[0].role).toBe('Software Engineer');
    expect(result.experience[0].bullets[0]).toBe('Did EN things');
    expect(result.education[0].degree).toBe('BSc Computer Science');
    expect(result.education[0].field).toBe('Computer Science');
  });

  it('flattens locale strings to German when locale is "de"', () => {
    const result = flattenProfile(mockProfileData, 'de');
    expect(result.tagline).toBe('DE Tagline');
    expect(result.summary).toBe('DE Zusammenfassung');
    expect(result.experience[0].role).toBe('Software-Ingenieur');
    expect(result.experience[0].bullets[0]).toBe('Hat DE Dinge gemacht');
    expect(result.education[0].degree).toBe('B.Sc. Informatik');
    expect(result.education[0].field).toBe('Informatik');
  });

  it('preserves non-localised fields unchanged', () => {
    const result = flattenProfile(mockProfileData, 'en');
    expect(result.name).toBe('Test User');
    expect(result.links).toEqual({ github: 'https://github.com/test', email: 'test@test.com' });
    expect(result.skills).toEqual(['TypeScript', 'Bun']);
    expect(result.experience[0].company).toBe('Acme Corp');
    expect(result.experience[0].startDate).toBe('2023-01');
    expect(result.experience[0].endDate).toBeNull();
    expect(result.education[0].institution).toBe('Test University');
  });

  it('omits field from education entry when not present in source', () => {
    const entryWithoutField = {
      ...mockProfileData,
      education: [{ ...mockProfileData.education[0], field: undefined }],
    };
    const result = flattenProfile(entryWithoutField, 'en');
    expect(result.education[0].field).toBeUndefined();
  });
});

// --- integration tests for getMeHandler ---
describe('getMeHandler', () => {
  beforeEach(() => {
    mockResult = mockProfileData;
    mockDbError = null;
    findOneSpy.mockClear();
    selectSpy.mockClear();
    leanSpy.mockClear();
  });

  it('returns the profile flattened to English by default', async () => {
    const res = makeMockRes();
    await getMeHandler(makeMockReq(), res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ tagline: 'EN tagline', summary: 'EN summary' }),
    );
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns the profile flattened to English when ?lang=en', async () => {
    const res = makeMockRes();
    await getMeHandler(makeMockReq('en'), res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ tagline: 'EN tagline' }),
    );
  });

  it('returns the profile flattened to German when ?lang=de', async () => {
    const res = makeMockRes();
    await getMeHandler(makeMockReq('de'), res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ tagline: 'DE Tagline', summary: 'DE Zusammenfassung' }),
    );
  });

  it('falls back to English for an unsupported ?lang value', async () => {
    const res = makeMockRes();
    await getMeHandler(makeMockReq('fr'), res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ tagline: 'EN tagline' }),
    );
  });

  it('strips _id and __v from the query projection', async () => {
    const res = makeMockRes();
    await getMeHandler(makeMockReq(), res);

    expect(selectSpy).toHaveBeenCalledWith('-_id -__v');
  });

  it('returns 404 when no profile exists in the database', async () => {
    mockResult = null;
    const res = makeMockRes();
    await getMeHandler(makeMockReq(), res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Profile not found' });
  });

  it('returns 500 when the database throws', async () => {
    mockDbError = new Error('DB connection failed');
    const res = makeMockRes();
    await getMeHandler(makeMockReq(), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
