import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';

type ContractReminder = components['schemas']['Reminder'];
type ReminderListSuccessResponse = components['schemas']['ReminderListSuccessResponse'];
type ReminderSuccessResponse = components['schemas']['ReminderSuccessResponse'];

const initialItems: ContractReminder[] = [
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

let items: ContractReminder[] = [];

export function resetReminderMockState(): void {
  items = initialItems.map((item) => ({ ...item }));
}

resetReminderMockState();

export const remindersHandlers = [
  http.get('/api/reminders/', ({ request }) => {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const pageSize = Math.max(1, Number(url.searchParams.get('page_size')) || 20);
    const unreadOnly = url.searchParams.get('unread_only') === 'true';
    const visible = items.filter((item) => !item.is_dismissed && (!unreadOnly || !item.is_read));
    const start = (page - 1) * pageSize;
    return HttpResponse.json<ReminderListSuccessResponse>({
      code: 'OK',
      message: '',
      data: {
        items: visible.slice(start, start + pageSize),
        page,
        page_size: pageSize,
        total: visible.length,
      },
    });
  }),
  http.post('/api/reminders/:id/read/', ({ params }) => {
    const item = items.find((value) => value.id === Number(params.id) && !value.is_dismissed);
    if (!item) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: '提醒不存在或已被忽略', data: null },
        { status: 404 },
      );
    }
    item.is_read = true;
    return HttpResponse.json<ReminderSuccessResponse>({
      code: 'OK',
      message: '',
      data: item,
    });
  }),
  http.post('/api/reminders/:id/dismiss/', ({ params }) => {
    const item = items.find((value) => value.id === Number(params.id) && !value.is_dismissed);
    if (!item) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: '提醒不存在或已被忽略', data: null },
        { status: 404 },
      );
    }
    item.is_dismissed = true;
    return HttpResponse.json<ReminderSuccessResponse>({
      code: 'OK',
      message: '',
      data: item,
    });
  }),
];
