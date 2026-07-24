import type { components } from '@/generated/api-types';
export type MockSchedule = components['schemas']['Schedule'];
export const MOCK_SCHEDULES: MockSchedule[] = [
  {
    id: 1,
    company: 1,
    store: 1,
    room: 1,
    course_template: 1,
    trainer: 4,
    course_date: '2026-07-23',
    start_time: '10:00:00',
    end_time: '11:00:00',
    capacity: 8,
    booking_deadline: '2026-07-23T09:00:00+08:00',
    schedule_mode: 'single',
    recurring_rule: null,
    status: 'published',
    bookings_count: 1,
    remaining_capacity: 7,
    course_template_name: '流瑜伽基础',
    trainer_name: '演示教练',
    room_name: '一号教室',
    created_at: '2026-07-22T10:00:00+08:00',
    updated_at: '2026-07-22T10:00:00+08:00',
  },
];
