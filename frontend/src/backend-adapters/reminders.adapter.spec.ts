import { beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/shared/mocks/server';
import { remindersHandlers } from '@/features/reminders';
import { resetReminderMockState } from '@/features/reminders/mocks/reminders.handlers';
import { dismissReminder, listReminders, markReminderRead } from './reminders.adapter';

describe('reminders adapter', () => {
  beforeEach(() => {
    resetReminderMockState();
    server.use(...remindersHandlers);
  });

  it('maps official pagination and authoritative action responses', async () => {
    const initial = await listReminders({ page: 1, pageSize: 2 });
    expect(initial).toMatchObject({ page: 1, pageSize: 2, total: 3 });
    expect(initial.items).toHaveLength(2);
    const first = initial.items[0];
    expect(first).toBeDefined();
    if (!first) throw new Error('fixture reminder is missing');

    const updated = await markReminderRead(first.id);
    expect(updated.read).toBe(true);
    const unread = await listReminders({ unreadOnly: true });
    expect(unread.items.some((item) => item.id === first.id)).toBe(false);

    const dismissed = await dismissReminder(first.id);
    expect(dismissed.dismissed).toBe(true);
    const afterDismiss = await listReminders();
    expect(afterDismiss.total).toBe(2);
    expect(afterDismiss.items.some((item) => item.id === first.id)).toBe(false);
  });

  it('drops action links outside the contract route allowlist', async () => {
    server.use(
      http.get('/api/reminders/', () =>
        HttpResponse.json({
          code: 'OK',
          message: '',
          data: {
            items: [
              {
                id: 99,
                title: '不安全跳转',
                message: '适配器不得向页面暴露任意地址。',
                category: 'system',
                priority: 'high',
                created_at: '2026-07-24T10:00:00+08:00',
                is_read: false,
                is_dismissed: false,
                action_label: '立即处理',
                action_to: 'https://example.com/phishing',
              },
            ],
            page: 1,
            page_size: 20,
            total: 1,
          },
        }),
      ),
    );
    const result = await listReminders();
    expect(result.items[0]).not.toHaveProperty('actionTo');
    expect(result.items[0]).not.toHaveProperty('actionLabel');
  });
});
