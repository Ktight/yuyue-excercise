import type { components } from '@/generated/api-types';
export type MockBooking = components['schemas']['Booking'];
export const MOCK_BOOKINGS: MockBooking[] = [
  {
    id: 1,
    company: 1,
    schedule: {
      id: 1,
      course_template_name: '流瑜伽基础',
      trainer_name: '演示教练',
      room_name: '一号教室',
      course_date: '2026-07-23',
      start_time: '10:00:00',
      end_time: '11:00:00',
      status: 'published',
    },
    student: { id: 1, name: '演示学员', phone: '13910000004' },
    booking_time: '2026-07-22T10:00:00+08:00',
    status: 'booked',
    created_at: '2026-07-22T10:00:00+08:00',
    updated_at: '2026-07-22T10:00:00+08:00',
  },
];
