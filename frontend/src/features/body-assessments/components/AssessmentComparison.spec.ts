import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AssessmentComparison from './AssessmentComparison.vue';
import type { BodyAssessment } from '../model';

const record = (id: number, date: string, weight: number): BodyAssessment => ({
  id,
  studentId: 1,
  assessDate: date,
  height: 170,
  weight,
  postureSpine: '正常',
  posturePelvis: '中立',
  postureShoulder: '放松',
  flexibilityScore: 6 + id,
  coreStrengthScore: 5 + id,
  photos: [],
  notes: '',
  createdAt: date,
});
describe('AssessmentComparison', () => {
  it('shows before/after values and deltas', () => {
    const wrapper = mount(AssessmentComparison, {
      props: { assessments: [record(2, '2026-07-23', 58), record(1, '2026-06-23', 60)] },
    });
    expect(wrapper.text()).toContain('60 → 58 kg');
    expect(wrapper.text()).toContain('变化 -2.0');
  });
});
