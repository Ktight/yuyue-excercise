import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';
import { MOCK_BOOKINGS, type MockBooking } from './bookings.fixtures';
type Create = components['schemas']['BookingCreateRequest'];
const ok = <T>(data: T, status = 200) =>
  HttpResponse.json({ code: 'OK', message: '', data }, { status });
const missing = () =>
  HttpResponse.json(
    { code: 'NOT_FOUND', message: '预约不存在', errors: {}, request_id: 'req_mock' },
    { status: 404 },
  );
async function make(request: Request, scheduleId?: number) {
  const b = (await request.json().catch(() => ({}))) as Partial<Create>;
  const now = new Date().toISOString();
  const item: MockBooking = {
    id: Math.max(0, ...MOCK_BOOKINGS.map((v) => v.id)) + 1,
    company: 1,
    schedule: {
      id: scheduleId ?? b.schedule_id ?? 1,
      course_template_name: 'Mock 课程',
      trainer_name: 'Mock 教练',
      room_name: 'Mock 教室',
      course_date: '2026-07-23',
      start_time: '10:00:00',
      end_time: '11:00:00',
      status: 'published',
    },
    student: { id: b.student_id ?? 1, name: 'Mock 学员', phone: '13910000004' },
    booking_time: now,
    status: 'booked',
    created_at: now,
    updated_at: now,
  };
  MOCK_BOOKINGS.push(item);
  return ok(item, 201);
}
export const bookingsHandlers = [
  http.get('/api/bookings/', () =>
    ok({ items: MOCK_BOOKINGS, page: 1, page_size: 20, total: MOCK_BOOKINGS.length }),
  ),
  http.get('/api/bookings/:id/', ({ params }) => {
    const item = MOCK_BOOKINGS.find((v) => v.id === Number(params.id));
    return item ? ok(item) : missing();
  }),
  http.post('/api/bookings/', ({ request }) => make(request)),
  http.post('/api/schedules/:id/book/', ({ params, request }) => make(request, Number(params.id))),
  http.delete('/api/bookings/:id/cancel/', ({ params }) => {
    const item = MOCK_BOOKINGS.find((v) => v.id === Number(params.id));
    if (!item) return missing();
    const cancelled = {
      ...item,
      status: 'cancelled' as const,
      updated_at: new Date().toISOString(),
    };
    MOCK_BOOKINGS.splice(MOCK_BOOKINGS.indexOf(item), 1, cancelled);
    return ok(cancelled);
  }),
];
