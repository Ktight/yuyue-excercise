import type {
  ReminderCategory as ContractReminderCategory,
  ReminderPriority as ContractReminderPriority,
} from '@/generated/enums';

export { REMINDER_CATEGORY_LABELS, REMINDER_PRIORITY_LABELS } from '@/generated/enums';

export type ReminderPriority = ContractReminderPriority;
export type ReminderCategory = ContractReminderCategory;

export interface ReminderItem {
  id: number;
  title: string;
  message: string;
  category: ReminderCategory;
  priority: ReminderPriority;
  createdAt: string;
  read: boolean;
  dismissed: boolean;
  actionLabel?: string;
  actionTo?: string;
}

export interface ReminderQuery {
  page?: number;
  pageSize?: number;
  unreadOnly?: boolean;
}

export interface ReminderPage {
  items: ReminderItem[];
  page: number;
  pageSize: number;
  total: number;
}
