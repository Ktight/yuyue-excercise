import { describe, expect, it } from 'vitest';
import { toLocalDateInputValue } from './local-date';

describe('toLocalDateInputValue', () => {
  it('uses the local calendar instead of the UTC date', () => {
    const value = new Date(2026, 6, 23, 0, 30);
    expect(toLocalDateInputValue(value)).toBe('2026-07-23');
  });
});
