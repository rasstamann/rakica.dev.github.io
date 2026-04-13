import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'bun:test' {
  // Extend Bun's Matchers with @testing-library/jest-dom custom matchers
  interface Matchers<T>
    extends TestingLibraryMatchers<typeof expect.not.objectContaining, T> {}
  interface AsymmetricMatchers
    extends TestingLibraryMatchers<typeof expect.not.objectContaining, unknown> {}
}
