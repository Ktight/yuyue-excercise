import { describe, expect, it } from 'vitest';
import { feedbackFeelingLabel, feedbackFeelingOptions } from './feedback.mapper';

describe('feedback feeling mapping', () => {
  it('keeps the provisional enum and labels centralized', () => {
    expect(feedbackFeelingOptions.map((item) => item.value)).toEqual(['easy', 'moderate', 'hard']);
    expect(feedbackFeelingLabel('moderate')).toBe('适中');
  });
});
