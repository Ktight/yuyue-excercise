import { http, HttpResponse } from 'msw';
const items = [
  {
    id: 1,
    title: '晚课即将满员',
    message: '19:00 进阶核心已满员，请关注候补学员。',
    category: 'booking',
    priority: 'high',
    created_at: '2026-07-23T09:20:00+08:00',
    is_read: false,
    is_dismissed: false,
    action_label: '查看排课',
    action_to: '/admin/schedules/103',
  },
  {
    id: 2,
    title: '3 位学员待补签到',
    message: '今天已有课程结束，但仍存在未确认的考勤记录。',
    category: 'attendance',
    priority: 'normal',
    created_at: '2026-07-23T11:30:00+08:00',
    is_read: false,
    is_dismissed: false,
    action_label: '处理考勤',
    action_to: '/admin/attendance',
  },
  {
    id: 3,
    title: '会员即将到期',
    message: '未来 7 天有 6 位学员会员到期。',
    category: 'membership',
    priority: 'normal',
    created_at: '2026-07-23T08:00:00+08:00',
    is_read: true,
    is_dismissed: false,
    action_label: '查看学员',
    action_to: '/admin/students',
  },
];
export const remindersHandlers = [
  http.get('/api/reminders/', () =>
    HttpResponse.json({
      code: 'OK',
      message: '',
      data: items.filter((item) => !item.is_dismissed),
    }),
  ),
  http.post('/api/reminders/:id/read/', ({ params }) => {
    const item = items.find((v) => v.id === Number(params.id));
    if (item) item.is_read = true;
    return HttpResponse.json({ code: 'OK', message: '', data: item ?? null });
  }),
  http.post('/api/reminders/:id/dismiss/', ({ params }) => {
    const item = items.find((v) => v.id === Number(params.id));
    if (item) item.is_dismissed = true;
    return HttpResponse.json({ code: 'OK', message: '', data: item ?? null });
  }),
];
