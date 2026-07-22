import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type {
  Schedule,
  ScheduleCreateResult,
  ScheduleListResult,
  ScheduleQuery,
  ScheduleUpdateInput,
  ScheduleWriteInput,
} from '@/features/schedules/model';
type Wire = components['schemas']['Schedule'];
type WireCreate = components['schemas']['ScheduleCreateRequest'];
type WireUpdate = components['schemas']['ScheduleUpdateRequest'];
type WireSuccess = components['schemas']['ScheduleSuccessResponse'];
type WireList = components['schemas']['ScheduleListSuccessResponse'];
type WireCreateSuccess = components['schemas']['ScheduleCreateSuccessResponse'];
export function mapSchedule(v: Wire): Schedule {
  return {
    id: v.id,
    companyId: v.company,
    storeId: v.store,
    roomId: v.room,
    courseTemplateId: v.course_template,
    trainerId: v.trainer,
    courseDate: v.course_date,
    startTime: v.start_time,
    endTime: v.end_time,
    capacity: v.capacity,
    bookingDeadline: v.booking_deadline ?? null,
    scheduleMode: v.schedule_mode,
    recurringRule: v.recurring_rule ?? null,
    status: v.status,
    bookingsCount: v.bookings_count,
    courseTemplateName: v.course_template_name,
    trainerName: v.trainer_name,
    roomName: v.room_name,
    createdAt: v.created_at,
    updatedAt: v.updated_at,
  };
}
function toCreate(v: ScheduleWriteInput): WireCreate {
  return {
    store: v.storeId,
    room: v.roomId,
    course_template: v.courseTemplateId,
    trainer: v.trainerId,
    course_date: v.courseDate,
    start_time: v.startTime,
    end_time: v.endTime,
    capacity: v.capacity,
    booking_deadline: v.bookingDeadline,
    schedule_mode: v.scheduleMode,
    recurring_rule: v.recurringRule,
    end_date: v.endDate,
    status: v.status,
  };
}
export async function fetchSchedules(q: ScheduleQuery = {}): Promise<ScheduleListResult> {
  const { data } = await httpClient.get<WireList>('/schedules/', {
    params: {
      page: q.page,
      page_size: q.pageSize,
      date_from: q.dateFrom,
      date_to: q.dateTo,
      store_id: q.storeId,
      trainer_id: q.trainerId,
      course_type: q.courseType,
      status: q.status,
      company_id: q.companyId,
    },
  });
  return {
    items: data.data.items.map(mapSchedule),
    page: data.data.page,
    pageSize: data.data.page_size,
    total: data.data.total,
  };
}
export async function fetchSchedule(id: number): Promise<Schedule> {
  const { data } = await httpClient.get<WireSuccess>(`/schedules/${id}/`);
  return mapSchedule(data.data);
}
export async function createSchedule(v: ScheduleWriteInput): Promise<ScheduleCreateResult> {
  const { data } = await httpClient.post<WireCreateSuccess>('/schedules/', toCreate(v));
  return 'id' in data.data
    ? { kind: 'single', schedule: mapSchedule(data.data) }
    : { kind: 'recurring', createdCount: data.data.created_count };
}
export async function updateSchedule(id: number, v: ScheduleUpdateInput): Promise<Schedule> {
  const body: WireUpdate = {
    store: v.storeId,
    room: v.roomId,
    course_template: v.courseTemplateId,
    trainer: v.trainerId,
    course_date: v.courseDate,
    start_time: v.startTime,
    end_time: v.endTime,
    capacity: v.capacity,
    booking_deadline: v.bookingDeadline,
    schedule_mode: v.scheduleMode,
    recurring_rule: v.recurringRule,
    status: v.status,
  };
  const { data } = await httpClient.patch<WireSuccess>(`/schedules/${id}/`, body);
  return mapSchedule(data.data);
}
export async function deleteSchedule(id: number): Promise<void> {
  await httpClient.delete(`/schedules/${id}/`);
}
