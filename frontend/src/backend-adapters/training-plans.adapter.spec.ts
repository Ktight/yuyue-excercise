import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { trainingPlansHandlers } from '@/features/training-plans';
import {
  completeTrainingPlan,
  createTrainingPlan,
  deleteTrainingPlan,
  fetchTrainingPlan,
  fetchTrainingPlans,
  pauseTrainingPlan,
  updateTrainingPlan,
} from './training-plans.adapter';

describe('training plans adapter', () => {
  beforeEach(() => server.use(...trainingPlansHandlers));

  it('maps list, detail and progress fields', async () => {
    const list = await fetchTrainingPlans({ status: 'active' });
    expect(list.items[0]).toMatchObject({
      studentId: 1,
      trainerId: 4,
      progressPercentage: 12.5,
    });
    const detail = await fetchTrainingPlan(1);
    expect(detail.linkedRecords).toEqual([]);
    expect(detail.linkedRecordsPageSize).toBe(20);
  });

  it('supports the trainer lifecycle', async () => {
    const created = await createTrainingPlan({
      studentId: 2,
      title: '测试计划',
      startDate: '2026-08-01',
      endDate: '2026-09-01',
      targetFrequencyPerWeek: 2,
      goalDescription: '测试目标',
      focusTags: ['核心'],
      status: 'active',
    });
    expect((await updateTrainingPlan(created.id, { title: '更新计划' })).title).toBe('更新计划');
    expect((await pauseTrainingPlan(created.id)).status).toBe('paused');
    expect((await completeTrainingPlan(created.id)).status).toBe('completed');
    await deleteTrainingPlan(created.id);
    expect((await fetchTrainingPlans()).items.some((item) => item.id === created.id)).toBe(false);
  });
});
