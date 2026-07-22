import type { ScheduleStatus } from '@/features/schedules';
export interface BookingSchedule {
  id: number;
  courseTemplateName: string;
  trainerName: string;
  roomName: string;
  courseDate: string;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
}
export interface BookingStudent {
  id: number;
  name: string;
  phone: string;
}
export interface Booking {
  id: number;
  companyId: number;
  schedule: BookingSchedule;
  student: BookingStudent;
  bookingTime: string;
  status: 'booked' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
export interface BookingListResult {
  items: Booking[];
  page: number;
  pageSize: number;
  total: number;
}
export interface BookingQuery {
  page?: number;
  pageSize?: number;
  status?: 'booked' | 'cancelled';
  scheduleId?: number;
  studentId?: number;
}
export interface BookingCreateInput {
  scheduleId: number;
  studentId?: number;
}
