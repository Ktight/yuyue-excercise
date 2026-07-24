import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { remindersHandlers } from '@/features/reminders';
import { dismissReminder, listReminders, markReminderRead } from './reminders.adapter';

describe('reminders adapter', () => {
  beforeEach(() => server.use(...remindersHandlers));
  it('maps and updates provisional reminder actions', async () => {
    const initial = await listReminders();
    expect(initial.length).toBeGreaterThan(1);
    const first = initial[0];
    expect(first).toBeDefined();
    if (!first) throw new Error('fixture reminder is missing');
    await markReminderRead(first.id);
    expect((await listReminders()).find((item) => item.id === first.id)?.read).toBe(true);
    await dismissReminder(first.id);
    expect((await listReminders()).some((item) => item.id === first.id)).toBe(false);
  });
});
