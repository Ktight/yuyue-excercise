import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';
import { MOCK_SCHEDULES, type MockSchedule } from './schedules.fixtures';
type Create = components['schemas']['ScheduleCreateRequest'];
type Update = components['schemas']['ScheduleUpdateRequest'];
const ok = <T>(data: T, status = 200) =>
  HttpResponse.json({ code: 'OK', message: '', data }, { status });
const missing = () =>
  HttpResponse.json(
    { code: 'NOT_FOUND', message: '排课不存在', errors: {}, request_id: 'req_mock' },
    { status: 404 },
  );
export const schedulesHandlers = [
  http.get('/api/schedules/', ({ request }) => {
    const u = new URL(request.url);
    let items = [...MOCK_SCHEDULES];
    const from = u.searchParams.get('date_from'),
      to = u.searchParams.get('date_to'),
      status = u.searchParams.get('status');
    if (from) items = items.filter((v) => v.course_date >= from);
    if (to) items = items.filter((v) => v.course_date <= to);
    if (status) items = items.filter((v) => v.status === status);
    return ok({ items, page: 1, page_size: 20, total: items.length });
  }),
  http.get('/api/schedules/:id/', ({ params }) => {
    const item = MOCK_SCHEDULES.find((v) => v.id === Number(params.id));
    return item ? ok(item) : missing();
  }),
  http.post('/api/schedules/', async ({ request }) => {
    const b = (await request.json()) as Create;
    if (b.schedule_mode === 'recurring')
      return ok({ created_count: b.recurring_rule?.weekdays.length ?? 0 }, 201);
    const now = new Date().toISOString();
    const item: MockSchedule = {
      id: Math.max(0, ...MOCK_SCHEDULES.map((v) => v.id)) + 1,
      company: 1,
      store: b.store,
      room: b.room,
      course_template: b.course_template,
      trainer: b.trainer,
      course_date: b.course_date,
      start_time: b.start_time,
      end_time: b.end_time,
      capacity: b.capacity,
      booking_deadline: b.booking_deadline ?? null,
      schedule_mode: b.schedule_mode,
      recurring_rule: b.recurring_rule ?? null,
      status: b.status,
      bookings_count: 0,
      course_template_name: 'Mock 课程',
      trainer_name: 'Mock 教练',
      room_name: 'Mock 教室',
      created_at: now,
      updated_at: now,
    };
    MOCK_SCHEDULES.push(item);
    return ok(item, 201);
  }),
  http.patch('/api/schedules/:id/', async ({ params, request }) => {
    const item = MOCK_SCHEDULES.find((v) => v.id === Number(params.id));
    if (!item) return missing();
    Object.assign(item, (await request.json()) as Update, { updated_at: new Date().toISOString() });
    return ok(item);
  }),
  http.delete('/api/schedules/:id/', ({ params }) => {
    const i = MOCK_SCHEDULES.findIndex((v) => v.id === Number(params.id));
    if (i < 0) return missing();
    MOCK_SCHEDULES.splice(i, 1);
    return ok({});
  }),
];
