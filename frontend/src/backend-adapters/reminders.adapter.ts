import { httpClient } from '@/shared/api';
import type { ReminderItem, ReminderPage, ReminderQuery } from '@/features/reminders/model';
import type { components } from '@/generated/api-types';

type ContractReminder = components['schemas']['Reminder'];
type ReminderListSuccessResponse = components['schemas']['ReminderListSuccessResponse'];
type ReminderSuccessResponse = components['schemas']['ReminderSuccessResponse'];

const SAFE_ACTION_ROUTE =
  /^\/admin\/(?:schedules|attendance|students|training-plans|class-records)(?:\/\d+)?$/;

function mapReminder(item: ContractReminder): ReminderItem {
  const hasSafeAction =
    !!item.action_label && !!item.action_to && SAFE_ACTION_ROUTE.test(item.action_to);
  return {
    id: item.id,
    title: item.title,
    message: item.message,
    category: item.category,
    priority: item.priority,
    createdAt: item.created_at,
    read: item.is_read,
    dismissed: item.is_dismissed,
    ...(hasSafeAction ? { actionLabel: item.action_label, actionTo: item.action_to } : {}),
  };
}

export async function listReminders(query: ReminderQuery = {}): Promise<ReminderPage> {
  const response = await httpClient.get<ReminderListSuccessResponse>('/reminders/', {
    params: {
      page: query.page ?? 1,
      page_size: query.pageSize ?? 20,
      unread_only: query.unreadOnly ?? false,
    },
  });
  const data = response.data.data;
  return {
    items: data.items.map(mapReminder),
    page: data.page,
    pageSize: data.page_size,
    total: data.total,
  };
}

export async function markReminderRead(id: number): Promise<ReminderItem> {
  const response = await httpClient.post<ReminderSuccessResponse>(`/reminders/${id}/read/`, {});
  return mapReminder(response.data.data);
}

export async function dismissReminder(id: number): Promise<ReminderItem> {
  const response = await httpClient.post<ReminderSuccessResponse>(`/reminders/${id}/dismiss/`, {});
  return mapReminder(response.data.data);
}
