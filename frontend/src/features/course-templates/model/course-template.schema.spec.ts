import { describe, expect, it } from 'vitest';
import { validateCourseTemplate } from './course-template.schema';

describe('validateCourseTemplate', () => {
  const base = {
    name: '瑜伽基础',
    category: 'group' as const,
    durationMinutes: 60,
    maxCapacity: 12,
    difficulty: 'beginner' as const,
    description: '',
  };

  it('accepts a valid group template', () => {
    expect(validateCourseTemplate(base)).toEqual([]);
  });

  it('requires private course capacity to equal one', () => {
    expect(validateCourseTemplate({ ...base, category: 'private', maxCapacity: 2 })).toContainEqual(
      {
        field: 'maxCapacity',
        message: '私教课容量固定为 1 人',
      },
    );
  });
});
