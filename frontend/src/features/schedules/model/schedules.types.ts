export type ScheduleStatus = 'published' | 'cancelled' | 'completed';
export type ScheduleMode = 'single' | 'recurring';
export interface RecurringRule {
  weekdays: number[];
  weeks: number;
}
export interface Schedule {
  id: number;
  companyId: number;
  storeId: number;
  roomId: number;
  courseTemplateId: number;
  trainerId: number;
  courseDate: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookingDeadline: string | null;
  scheduleMode: ScheduleMode;
  recurringRule: RecurringRule | null;
  status: ScheduleStatus;
  bookingsCount: number;
  remainingCapacity: number;
  courseTemplateName: string;
  trainerName: string;
  roomName: string;
  createdAt: string;
  updatedAt: string;
}
export interface ScheduleQuery {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  storeId?: number;
  trainerId?: number;
  courseType?: 'private' | 'small_group' | 'group';
  status?: ScheduleStatus;
  companyId?: number;
}
export interface ScheduleListResult {
  items: Schedule[];
  page: number;
  pageSize: number;
  total: number;
}
export interface ScheduleWriteInput {
  storeId: number;
  roomId: number;
  courseTemplateId: number;
  trainerId: number;
  courseDate: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookingDeadline: string | null;
  scheduleMode: ScheduleMode;
  recurringRule: RecurringRule | null;
  endDate?: string;
  status: ScheduleStatus;
}
export type ScheduleUpdateInput = Partial<Omit<ScheduleWriteInput, 'endDate'>>;
export type ScheduleCreateResult =
  { kind: 'single'; schedule: Schedule } | { kind: 'recurring'; createdCount: number };
