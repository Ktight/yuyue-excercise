import { describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { schedulesHandlers } from '@/features/schedules';
import { createSchedule, fetchSchedule, fetchSchedules, updateSchedule } from './schedules.adapter';
const input = {
  storeId: 1,
  roomId: 1,
  courseTemplateId: 1,
  trainerId: 4,
  courseDate: '2026-07-24',
  startTime: '10:00:00',
  endTime: '11:00:00',
  capacity: 8,
  bookingDeadline: null,
  scheduleMode: 'single' as const,
  recurringRule: null,
  status: 'published' as const,
};
describe('schedules adapter', () => {
  it('maps list and nested names', async () => {
    server.use(...schedulesHandlers);
    const result = await fetchSchedules({ status: 'published' });
    expect(result.items[0]).toMatchObject({
      storeId: 1,
      courseTemplateName: '流瑜伽基础',
      bookingsCount: 1,
      remainingCapacity: 7,
    });
  });
  it('distinguishes single and recurring creation responses', async () => {
    server.use(...schedulesHandlers);
    const single = await createSchedule(input);
    expect(single.kind).toBe('single');
    const recurring = await createSchedule({
      ...input,
      scheduleMode: 'recurring',
      recurringRule: { weekdays: [1, 3], weeks: 2 },
    });
    expect(recurring).toEqual({ kind: 'recurring', createdCount: 2 });
  });
  it('uses detail and patch paths', async () => {
    server.use(...schedulesHandlers);
    const first = await fetchSchedule(1);
    expect((await updateSchedule(first.id, { capacity: 10 })).capacity).toBe(10);
  });
});
