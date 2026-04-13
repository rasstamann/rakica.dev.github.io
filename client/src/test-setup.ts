import { afterEach, beforeAll } from 'bun:test';
import { cleanup, configure } from '@testing-library/react';

// Suppress act() warnings for async state updates in React 19
beforeAll(() => {
  configure({ asyncUtilTimeout: 2000 });
});

afterEach(() => {
  cleanup();
});
