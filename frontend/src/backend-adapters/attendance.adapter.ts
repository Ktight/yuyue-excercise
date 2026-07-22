import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type {
  Attendance,
  AttendanceBatchResult,
  AttendanceListResult,
  AttendanceQuery,
  AttendanceStats,
} from '@/features/attendance/model';
type Wire = components['schemas']['Attendance'];
type WireSuccess = components['schemas']['AttendanceSuccessResponse'];
type WireList = components['schemas']['AttendanceListSuccessResponse'];
type WireBatch = components['schemas']['AttendanceBatchSuccessResponse'];
type WireAuto = components['schemas']['AttendanceAutoCreateSuccessResponse'];
type WireStats = components['schemas']['AttendanceStatsSuccessResponse'];
export function mapAttendance(v: Wire): Attendance {
  return {
    id: v.id,
    companyId: v.company,
    bookingId: v.booking,
    scheduleId: v.schedule,
    studentId: v.student,
    studentName: v.student_name,
    scheduleName: v.schedule_name,
    checkInTime: v.check_in_time,
    status: v.status,
    checkedById: v.checked_by,
    checkedByName: v.checked_by_name,
    createdAt: v.created_at,
    updatedAt: v.updated_at,
  };
}
export async function fetchAttendances(q: AttendanceQuery = {}): Promise<AttendanceListResult> {
  const { data } = await httpClient.get<WireList>('/attendances/', {
    params: {
      page: q.page,
      page_size: q.pageSize,
      schedule_id: q.scheduleId,
      company_id: q.companyId,
    },
  });
  return {
    items: data.data.items.map(mapAttendance),
    page: data.data.page,
    pageSize: data.data.page_size,
    total: data.data.total,
  };
}
export async function fetchAttendance(id: number): Promise<Attendance> {
  const { data } = await httpClient.get<WireSuccess>(`/attendances/${id}/`);
  return mapAttendance(data.data);
}
export async function checkInAttendance(id: number): Promise<Attendance> {
  const { data } = await httpClient.post<WireSuccess>(`/attendances/${id}/check-in/`);
  return mapAttendance(data.data);
}
export async function markAttendanceLeave(id: number): Promise<Attendance> {
  const { data } = await httpClient.post<WireSuccess>(`/attendances/${id}/mark-leave/`);
  return mapAttendance(data.data);
}
export async function batchCheckInAttendances(
  scheduleId: number,
  studentIds: number[],
): Promise<AttendanceBatchResult> {
  const { data } = await httpClient.post<WireBatch>('/attendances/batch-check-in/', {
    schedule_id: scheduleId,
    student_ids: studentIds,
  });
  return { updatedCount: data.data.updated_count, items: data.data.items.map(mapAttendance) };
}
export async function autoCreateAttendances(scheduleId: number): Promise<number> {
  const { data } = await httpClient.post<WireAuto>('/attendances/auto-create/', {
    schedule_id: scheduleId,
  });
  return data.data.created_count;
}
export async function fetchAttendanceStats(query: {
  studentId?: number;
  scheduleId?: number;
}): Promise<AttendanceStats> {
  const { data } = await httpClient.get<WireStats>('/attendances/stats/', {
    params: { student_id: query.studentId, schedule_id: query.scheduleId },
  });
  return {
    studentStats: data.data.student_stats
      ? {
          studentId: data.data.student_stats.student_id,
          totalCount: data.data.student_stats.total_count,
          attendedCount: data.data.student_stats.attended_count,
          attendanceRate: data.data.student_stats.attendance_rate,
          lateCount: data.data.student_stats.late_count,
          leaveCount: data.data.student_stats.leave_count,
          consecutiveAttendance: data.data.student_stats.consecutive_attendance,
        }
      : undefined,
    courseStats: data.data.course_stats
      ? {
          scheduleId: data.data.course_stats.schedule_id,
          bookingCount: data.data.course_stats.booking_count,
          arrivedCount: data.data.course_stats.arrived_count,
          attendanceRate: data.data.course_stats.attendance_rate,
        }
      : undefined,
  };
}
