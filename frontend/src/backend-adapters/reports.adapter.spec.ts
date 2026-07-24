import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { reportsHandlers } from '@/features/reports';
import { previewStageReport } from './reports.adapter';

describe('reports adapter', () => {
  beforeEach(() => server.use(...reportsHandlers));

  it('maps the live GET preview and converts the attendance ratio', async () => {
    const report = await previewStageReport({
      studentId: 3,
      rangeStart: '2026-07-01',
      rangeEnd: '2026-07-23',
    });
    expect(report).toMatchObject({
      studentId: 3,
      trainingCount: 12,
      attendanceRate: 91.7,
      averageRating: 4.3,
      planProgress: 60,
      feedbackCount: 8,
    });
    expect(report.bodyMetrics).toHaveLength(4);
    expect(report.trainerComments).toContain('核心稳定');
  });
});
