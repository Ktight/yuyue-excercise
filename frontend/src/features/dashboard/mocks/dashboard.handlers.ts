import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';

type AdminDashboardSuccessResponse = components['schemas']['AdminDashboardSuccessResponse'];

function recentDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const dashboardHandlers = [
  http.get('/api/dashboards/admin/', () =>
    HttpResponse.json<AdminDashboardSuccessResponse>({
      code: 'OK',
      message: '',
      data: {
        generated_at: new Date().toISOString(),
        timezone: 'Asia/Shanghai',
        metrics: {
          today_classes: 8,
          today_bookings: 46,
          active_students: 128,
          pending_items: 5,
        },
        booking_trend: [
          { label: recentDate(6), value: 31 },
          { label: recentDate(5), value: 38 },
          { label: recentDate(4), value: 34 },
          { label: recentDate(3), value: 45 },
          { label: recentDate(2), value: 42 },
          { label: recentDate(1), value: 57 },
          { label: recentDate(0), value: 46 },
        ],
        today_schedules: [
          {
            id: 101,
            time: '09:00',
            course_name: '晨间流瑜伽',
            trainer_name: '林澜',
            room_name: '静心教室',
            booked: 10,
            capacity: 12,
          },
          {
            id: 102,
            time: '14:30',
            course_name: '肩颈舒缓',
            trainer_name: '周瑜',
            room_name: '云水教室',
            booked: 8,
            capacity: 10,
          },
          {
            id: 103,
            time: '19:00',
            course_name: '进阶核心',
            trainer_name: '林澜',
            room_name: '静心教室',
            booked: 12,
            capacity: 12,
          },
        ],
      },
    }),
  ),
];
