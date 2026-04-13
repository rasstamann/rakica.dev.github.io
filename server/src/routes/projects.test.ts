import { describe, it, expect, mock, beforeEach } from 'bun:test';
import type { Request, Response } from 'express';

// --- mock project data (locale-keyed shape, as stored in DB) ---
const mockProjectData = [
  {
    slug: 'test-project',
    title: 'Test Project',
    description: { en: 'EN description', de: 'DE Beschreibung' },
    techStack: ['TypeScript', 'Bun'],
    githubUrl: 'https://github.com/test/test-project',
    status: 'Active',
    order: 0,
  },
  {
    slug: 'another-project',
    title: 'Another Project',
    description: { en: 'EN another', de: 'DE andere' },
    techStack: ['React'],
    order: 1,
  },
];

let mockResult: typeof mockProjectData | null = mockProjectData;
let mockDbError: Error | null = null;

const leanSpy = mock(() =>
  mockDbError ? Promise.reject(mockDbError) : Promise.resolve(mockResult),
);
const selectSpy = mock(() => ({ lean: leanSpy }));
const sortSpy = mock(() => ({ select: selectSpy }));
const findSpy = mock(() => ({ sort: sortSpy }));

mock.module('../models/Project', () => ({
  default: { find: findSpy },
}));

const { getProjectsHandler, flattenProject } = await import('./projects');

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

// --- unit tests for flattenProject ---
describe('flattenProject', () => {
  const project = mockProjectData[0];

  it('flattens description to English', () => {
    const result = flattenProject(project as Parameters<typeof flattenProject>[0], 'en');
    expect(result.description).toBe('EN description');
  });

  it('flattens description to German', () => {
    const result = flattenProject(project as Parameters<typeof flattenProject>[0], 'de');
    expect(result.description).toBe('DE Beschreibung');
  });

  it('preserves non-localised fields', () => {
    const result = flattenProject(project as Parameters<typeof flattenProject>[0], 'en');
    expect(result.slug).toBe('test-project');
    expect(result.title).toBe('Test Project');
    expect(result.techStack).toEqual(['TypeScript', 'Bun']);
    expect(result.githubUrl).toBe('https://github.com/test/test-project');
    expect(result.status).toBe('Active');
    expect(result.order).toBe(0);
  });

  it('omits optional fields when absent', () => {
    const result = flattenProject(
      mockProjectData[1] as Parameters<typeof flattenProject>[0],
      'en',
    );
    expect(result.githubUrl).toBeUndefined();
    expect(result.liveUrl).toBeUndefined();
    expect(result.screenshotUrl).toBeUndefined();
    expect(result.status).toBeUndefined();
  });
});

// --- integration tests for getProjectsHandler ---
describe('getProjectsHandler', () => {
  beforeEach(() => {
    mockResult = mockProjectData;
    mockDbError = null;
    findSpy.mockClear();
    sortSpy.mockClear();
    selectSpy.mockClear();
    leanSpy.mockClear();
  });

  it('returns projects flattened to English by default', async () => {
    const res = makeMockRes();
    await getProjectsHandler(makeMockReq(), res);

    const [arg] = (res.json as ReturnType<typeof mock>).mock.calls[0] as [unknown[]];
    expect(Array.isArray(arg)).toBe(true);
    expect((arg as Array<{ description: string }>)[0].description).toBe('EN description');
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns projects flattened to German when ?lang=de', async () => {
    const res = makeMockRes();
    await getProjectsHandler(makeMockReq('de'), res);

    const [arg] = (res.json as ReturnType<typeof mock>).mock.calls[0] as [unknown[]];
    expect((arg as Array<{ description: string }>)[0].description).toBe('DE Beschreibung');
  });

  it('returns empty array when no projects exist', async () => {
    mockResult = null;
    const res = makeMockRes();
    await getProjectsHandler(makeMockReq(), res);

    expect(res.json).toHaveBeenCalledWith([]);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('sorts by order ascending', async () => {
    const res = makeMockRes();
    await getProjectsHandler(makeMockReq(), res);

    expect(sortSpy).toHaveBeenCalledWith({ order: 1 });
  });

  it('strips _id and __v from the query projection', async () => {
    const res = makeMockRes();
    await getProjectsHandler(makeMockReq(), res);

    expect(selectSpy).toHaveBeenCalledWith('-_id -__v');
  });

  it('returns 500 when the database throws', async () => {
    mockDbError = new Error('DB error');
    const res = makeMockRes();
    await getProjectsHandler(makeMockReq(), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
