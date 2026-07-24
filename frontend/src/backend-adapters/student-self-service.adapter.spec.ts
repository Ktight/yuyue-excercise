import { beforeEach, describe, expect, it } from 'vitest';
import { studentSelfServiceHandlers } from '@/features/student-self-service';
import { server } from '@/shared/mocks/server';
import {
  fetchStudentHistory,
  fetchStudentHome,
  fetchStudentPlan,
  fetchStudentPlans,
  fetchStudentProfileArchive,
  fetchStudentRecord,
} from './student-self-service.adapter';

describe('student self-service adapter', () => {
  beforeEach(() => server.use(...studentSelfServiceHandlers));

  it('maps the provisional aggregate home into a stable view model', async () => {
    const result = await fetchStudentHome();
    expect(result.studentName).toBe('李学员');
    expect(result.attendanceRate).toBe(0.92);
    expect(result.nextClass).toMatchObject({ courseName: '肩颈舒缓私教' });
  });

  it('maps filtered history and details without exposing wire fields', async () => {
    const history = await fetchStudentHistory({
      page: 1,
      pageSize: 10,
      dateFrom: '2026-07-15',
    });
    expect(history.total).toBe(2);
    expect(history.items[0]).toMatchObject({ classDate: '2026-07-21', theme: '肩颈舒展与呼吸' });

    const detail = await fetchStudentRecord(801);
    expect(detail.poses[0]).toEqual({
      name: '猫牛式',
      durationMinutes: 6,
      notes: '配合完整呼吸',
    });
  });

  it('maps student-only plans and the privacy-limited profile', async () => {
    const plans = await fetchStudentPlans();
    expect(plans).toHaveLength(2);
    await expect(fetchStudentPlan(701)).resolves.toMatchObject({
      progressPercentage: 58,
      status: 'active',
    });

    const profile = await fetchStudentProfileArchive();
    expect(profile.membership).toMatchObject({ remainingSessions: 9 });
    expect(profile.latestAssessment).toMatchObject({ flexibilityScore: 78 });
  });
});
