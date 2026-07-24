import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { dashboardHandlers } from '@/features/dashboard';
import { getAdminDashboard } from './dashboard.adapter';

describe('dashboard adapter', () => {
  beforeEach(() => server.use(...dashboardHandlers));
  it('maps the official contract into the stable dashboard view model', async () => {
    const summary = await getAdminDashboard();
    expect(summary.timezone).toBe('Asia/Shanghai');
    expect(summary.metrics.map((item) => item.value)).toEqual([8, 46, 128, 5]);
    expect(summary.bookingTrend).toHaveLength(7);
    expect(summary.bookingTrend[0]?.label).toMatch(/^\d{2}\/\d{2}$/);
    expect(summary.todaySchedules[0]).toMatchObject({
      courseName: '晨间流瑜伽',
      trainerName: '林澜',
    });
  });
});
