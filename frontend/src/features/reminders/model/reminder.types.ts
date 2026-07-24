export type ReminderPriority = 'high' | 'normal' | 'low';
export type ReminderCategory = 'booking' | 'attendance' | 'membership' | 'training' | 'system';
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
