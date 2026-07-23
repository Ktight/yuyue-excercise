import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { describe, expect, it, vi } from 'vitest';
import { fetchTrainingPlans } from '../api';
import StudentTrainingPlansPanel from './StudentTrainingPlansPanel.vue';

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('../api', () => ({
  fetchTrainingPlans: vi.fn(),
}));

describe('StudentTrainingPlansPanel', () => {
  it('loads plans using the StudentProfile id', async () => {
    vi.mocked(fetchTrainingPlans).mockResolvedValue({
      items: [
        {
          id: 9,
          companyId: 1,
          studentId: 12,
          studentName: '李学员',
          trainerId: 2,
          trainerName: '张教练',
          title: '基础提升计划',
          startDate: '2026-07-01',
          endDate: '2026-08-31',
          targetFrequencyPerWeek: 3,
          goalDescription: '提升核心稳定性',
          focusTags: ['核心'],
          status: 'active',
          completedSessionsCount: 4,
          progressPercentage: 50,
          createdAt: '2026-07-01T00:00:00Z',
          updatedAt: '2026-07-20T00:00:00Z',
        },
      ],
      page: 1,
      pageSize: 100,
      total: 1,
    });
    const wrapper = mount(StudentTrainingPlansPanel, {
      props: { studentId: 12 },
      global: { plugins: [createPinia()] },
    });

    await vi.waitFor(() => expect(wrapper.text()).toContain('基础提升计划'));
    expect(fetchTrainingPlans).toHaveBeenCalledWith({
      studentId: 12,
      page: 1,
      pageSize: 100,
    });
  });
});
