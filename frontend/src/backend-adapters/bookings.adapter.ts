import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type {
  Booking,
  BookingCreateInput,
  BookingListResult,
  BookingQuery,
} from '@/features/bookings/model';
type Wire = components['schemas']['Booking'];
type WireSuccess = components['schemas']['BookingSuccessResponse'];
type WireList = components['schemas']['BookingListSuccessResponse'];
type WireCreate = components['schemas']['BookingCreateRequest'];
export function mapBooking(v: Wire): Booking {
  return {
    id: v.id,
    companyId: v.company,
    schedule: {
      id: v.schedule.id,
      courseTemplateName: v.schedule.course_template_name,
      trainerName: v.schedule.trainer_name,
      roomName: v.schedule.room_name,
      courseDate: v.schedule.course_date,
      startTime: v.schedule.start_time,
      endTime: v.schedule.end_time,
      status: v.schedule.status,
    },
    student: { id: v.student.id, name: v.student.name, phone: v.student.phone },
    bookingTime: v.booking_time,
    status: v.status,
    createdAt: v.created_at,
    updatedAt: v.updated_at,
  };
}
export async function fetchBookings(q: BookingQuery = {}): Promise<BookingListResult> {
  const { data } = await httpClient.get<WireList>('/bookings/', {
    params: { page: q.page, page_size: q.pageSize },
  });
  return {
    items: data.data.items.map(mapBooking),
    page: data.data.page,
    pageSize: data.data.page_size,
    total: data.data.total,
  };
}
export async function fetchBooking(id: number): Promise<Booking> {
  const { data } = await httpClient.get<WireSuccess>(`/bookings/${id}/`);
  return mapBooking(data.data);
}
export async function createBooking(v: BookingCreateInput): Promise<Booking> {
  const body: WireCreate = { schedule_id: v.scheduleId, student_id: v.studentId };
  const { data } = await httpClient.post<WireSuccess>('/bookings/', body);
  return mapBooking(data.data);
}
export async function bookSchedule(scheduleId: number, studentId?: number): Promise<Booking> {
  const { data } = await httpClient.post<WireSuccess>(
    `/schedules/${scheduleId}/book/`,
    studentId === undefined ? {} : { student_id: studentId },
  );
  return mapBooking(data.data);
}
export async function cancelBooking(id: number): Promise<Booking> {
  const { data } = await httpClient.delete<WireSuccess>(`/bookings/${id}/cancel/`);
  return mapBooking(data.data);
}
