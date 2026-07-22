import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';
import { MOCK_ATTENDANCES } from './attendance.fixtures';
type Batch = components['schemas']['AttendanceBatchCheckInRequest'];
type ScheduleRequest = components['schemas']['AttendanceScheduleRequest'];
const ok = <T>(data: T) => HttpResponse.json({ code: 'OK', message: '', data });
const missing = () =>
  HttpResponse.json(
    { code: 'NOT_FOUND', message: '考勤不存在', errors: {}, request_id: 'req_mock' },
    { status: 404 },
  );
function change(id: number, status: 'present' | 'leave') {
  const i = MOCK_ATTENDANCES.findIndex((v) => v.id === id);
  if (i < 0) return;
  const old = MOCK_ATTENDANCES[i];
  if (!old) return;
  const now = new Date().toISOString();
  MOCK_ATTENDANCES[i] = {
    ...old,
    status,
    check_in_time: status === 'present' ? now : null,
    checked_by: 4,
    checked_by_name: 'Mock 教练',
    updated_at: now,
  };
  return MOCK_ATTENDANCES[i];
}
export const attendanceHandlers = [
  http.get('/api/attendances/', ({ request }) => {
    const scheduleId = Number(new URL(request.url).searchParams.get('schedule_id')) || undefined;
    const items = MOCK_ATTENDANCES.filter((v) => !scheduleId || v.schedule === scheduleId);
    return ok({ items, page: 1, page_size: 20, total: items.length });
  }),
  http.get('/api/attendances/stats/', ({ request }) => {
    const u = new URL(request.url),
      studentId = Number(u.searchParams.get('student_id')) || undefined,
      scheduleId = Number(u.searchParams.get('schedule_id')) || undefined;
    const data: Record<string, unknown> = {};
    if (studentId)
      data.student_stats = {
        student_id: studentId,
        total_count: 1,
        attended_count: 1,
        attendance_rate: 100,
        late_count: 0,
        leave_count: 0,
        consecutive_attendance: 1,
      };
    if (scheduleId)
      data.course_stats = {
        schedule_id: scheduleId,
        booking_count: 1,
        arrived_count: 1,
        attendance_rate: 100,
      };
    return ok(data);
  }),
  http.get('/api/attendances/:id/', ({ params }) => {
    const v = MOCK_ATTENDANCES.find((x) => x.id === Number(params.id));
    return v ? ok(v) : missing();
  }),
  http.post('/api/attendances/:id/check-in/', ({ params }) => {
    const v = change(Number(params.id), 'present');
    return v ? ok(v) : missing();
  }),
  http.post('/api/attendances/:id/mark-leave/', ({ params }) => {
    const v = change(Number(params.id), 'leave');
    return v ? ok(v) : missing();
  }),
  http.post('/api/attendances/batch-check-in/', async ({ request }) => {
    const b = (await request.json()) as Batch;
    const items = b.student_ids.flatMap((id) => {
      const row = MOCK_ATTENDANCES.find((v) => v.schedule === b.schedule_id && v.student === id);
      const changed = row && change(row.id, 'present');
      return changed ? [changed] : [];
    });
    return ok({ updated_count: items.length, items });
  }),
  http.post('/api/attendances/auto-create/', async ({ request }) => {
    const b = (await request.json()) as ScheduleRequest;
    return ok({
      created_count: MOCK_ATTENDANCES.some((v) => v.schedule === b.schedule_id) ? 0 : 1,
    });
  }),
];
