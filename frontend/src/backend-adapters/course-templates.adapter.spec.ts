import { describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { courseTemplatesHandlers } from '@/features/course-templates/mocks/course-templates.handlers';
import {
  createCourseTemplate,
  fetchCourseTemplate,
  fetchCourseTemplates,
  setCourseTemplateActive,
} from './course-templates.adapter';

describe('course templates adapter', () => {
  it('maps paginated snake_case data into the frontend domain model', async () => {
    server.use(...courseTemplatesHandlers);
    const result = await fetchCourseTemplates({ category: 'private', pageSize: 10 });
    expect(result.total).toBe(1);
    expect(result.items[0]).toMatchObject({
      id: 1,
      companyId: 1,
      category: 'private',
      durationMinutes: 60,
      maxCapacity: 1,
    });
  });

  it('serializes write input and preserves the private capacity invariant', async () => {
    server.use(...courseTemplatesHandlers);
    const created = await createCourseTemplate({
      name: '一对一体态训练',
      category: 'private',
      durationMinutes: 60,
      maxCapacity: 1,
      difficulty: 'intermediate',
      description: '针对性训练',
    });
    expect(created).toMatchObject({ category: 'private', maxCapacity: 1 });
    expect((await fetchCourseTemplate(created.id)).name).toBe('一对一体态训练');
  });

  it('uses status PATCH through the adapter', async () => {
    server.use(...courseTemplatesHandlers);
    expect((await setCourseTemplateActive(2, false)).status).toBe('inactive');
  });
});
