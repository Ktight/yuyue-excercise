import { describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { bodyAssessmentsHandlers } from '@/features/body-assessments/mocks/body-assessments.handlers';
import {
  createAssessment,
  deleteAssessment,
  fetchAssessments,
  fetchAssessmentTrend,
  updateAssessment,
} from './body-assessments.adapter';
describe('body assessments adapter', () => {
  it('maps list and trend values without inventing zero', async () => {
    server.use(...bodyAssessmentsHandlers);
    const result = await fetchAssessments({ studentId: 1 });
    expect(result.items[0]).toMatchObject({
      studentId: 1,
      assessDate: '2026-07-01',
      coreStrengthScore: 6,
    });
    const trend = await fetchAssessmentTrend(1, 'weight');
    expect(trend.points[0]?.value).toBe(55);
  });
  it('supports create, patch and delete through formal paths', async () => {
    server.use(...bodyAssessmentsHandlers);
    const created = await createAssessment({
      studentId: 1,
      assessDate: '2026-07-02',
      weight: 54.5,
    });
    expect(created.weight).toBe(54.5);
    expect((await updateAssessment(created.id, { notes: '复测' })).notes).toBe('复测');
    await deleteAssessment(created.id);
    expect(
      (await fetchAssessments({ studentId: 1 })).items.some((item) => item.id === created.id),
    ).toBe(false);
  });
});
