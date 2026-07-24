import { http, HttpResponse } from 'msw';

export const dashboardHandlers = [
  http.get('/api/dashboards/admin/', () =>
    HttpResponse.json({
      code: 'OK',
      message: '',
      data: {
        generated_at: new Date().toISOString(),
        metrics: {
          today_classes: 8,
          today_bookings: 46,
          active_students: 128,
          pending_items: 5,
        },
        booking_trend: [
          { label: '周一', value: 31 },
          { label: '周二', value: 38 },
          { label: '周三', value: 34 },
          { label: '周四', value: 45 },
          { label: '周五', value: 42 },
          { label: '周六', value: 57 },
          { label: '周日', value: 46 },
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
