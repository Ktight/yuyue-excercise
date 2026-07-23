import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { dashboardHandlers } from '@/features/dashboard';
import { getAdminDashboard } from './dashboard.adapter';

describe('dashboard adapter', () => {
  beforeEach(() => server.use(...dashboardHandlers));
  it('maps provisional data into the stable dashboard view model', async () => {
    const summary = await getAdminDashboard();
    expect(summary.metrics.map((item) => item.value)).toEqual([8, 46, 128, 5]);
    expect(summary.bookingTrend).toHaveLength(7);
    expect(summary.todaySchedules[0]).toMatchObject({
      courseName: '晨间流瑜伽',
      trainerName: '林澜',
    });
  });
});
