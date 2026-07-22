import { describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { attendanceHandlers } from '@/features/attendance';
import {
  autoCreateAttendances,
  batchCheckInAttendances,
  checkInAttendance,
  fetchAttendances,
  fetchAttendanceStats,
  markAttendanceLeave,
} from './attendance.adapter';
describe('attendance adapter', () => {
  it('maps list and read-only actor fields', async () => {
    server.use(...attendanceHandlers);
    const result = await fetchAttendances({ scheduleId: 1 });
    expect(result.items[0]).toMatchObject({
      studentId: 6,
      studentName: '演示学员',
      status: 'absent',
      checkedById: null,
    });
  });
  it('supports check-in, leave and batch actions', async () => {
    server.use(...attendanceHandlers);
    expect((await checkInAttendance(1)).status).toBe('present');
    expect((await markAttendanceLeave(1)).status).toBe('leave');
    expect((await batchCheckInAttendances(1, [6])).updatedCount).toBe(1);
  });
  it('maps idempotent creation and both stats dimensions', async () => {
    server.use(...attendanceHandlers);
    expect(await autoCreateAttendances(1)).toBe(0);
    const stats = await fetchAttendanceStats({ studentId: 6, scheduleId: 1 });
    expect(stats.studentStats?.attendanceRate).toBe(100);
    expect(stats.courseStats?.arrivedCount).toBe(1);
  });
});
