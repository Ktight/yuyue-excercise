import { httpClient } from '@/shared/api';
import type { ReminderItem, ReminderCategory, ReminderPriority } from '@/features/reminders/model';
interface DraftReminder {
  id: number;
  title: string;
  message: string;
  category: ReminderCategory;
  priority: ReminderPriority;
  created_at: string;
  is_read: boolean;
  is_dismissed: boolean;
  action_label?: string;
  action_to?: string;
}
function isDraftReminder(value: unknown): value is DraftReminder {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<DraftReminder>;
  return (
    typeof item.id === 'number' &&
    typeof item.title === 'string' &&
    typeof item.message === 'string'
  );
}
function mapReminder(item: DraftReminder): ReminderItem {
  return {
    id: item.id,
    title: item.title,
    message: item.message,
    category: item.category,
    priority: item.priority,
    createdAt: item.created_at,
    read: item.is_read,
    dismissed: item.is_dismissed,
    actionLabel: item.action_label,
    actionTo: item.action_to,
  };
}
export async function listReminders(): Promise<ReminderItem[]> {
  const response = await httpClient.get<{ data: unknown }>('/reminders/');
  if (!Array.isArray(response.data.data) || !response.data.data.every(isDraftReminder))
    throw new Error('REMINDER_CONTRACT_MISMATCH');
  return response.data.data.map(mapReminder);
}
export async function markReminderRead(id: number): Promise<void> {
  await httpClient.post(`/reminders/${id}/read/`, {});
}
export async function dismissReminder(id: number): Promise<void> {
  await httpClient.post(`/reminders/${id}/dismiss/`, {});
}
