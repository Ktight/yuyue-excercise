export type AttendanceStatus = 'present' | 'late' | 'absent' | 'leave';
export interface Attendance {
  id: number;
  companyId: number;
  bookingId: number;
  scheduleId: number;
  studentId: number;
  studentName: string;
  scheduleName: string;
  checkInTime: string | null;
  status: AttendanceStatus;
  checkedById: number | null;
  checkedByName: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface AttendanceQuery {
  page?: number;
  pageSize?: number;
  scheduleId?: number;
  companyId?: number;
}
export interface AttendanceListResult {
  items: Attendance[];
  page: number;
  pageSize: number;
  total: number;
}
export interface AttendanceBatchResult {
  updatedCount: number;
  items: Attendance[];
}
export interface StudentAttendanceStats {
  studentId: number;
  totalCount: number;
  attendedCount: number;
  attendanceRate: number;
  lateCount: number;
  leaveCount: number;
  consecutiveAttendance: number;
}
export interface CourseAttendanceStats {
  scheduleId: number;
  bookingCount: number;
  arrivedCount: number;
  attendanceRate: number;
}
export interface AttendanceStats {
  studentStats?: StudentAttendanceStats;
  courseStats?: CourseAttendanceStats;
}
