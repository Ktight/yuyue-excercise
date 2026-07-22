import { attendanceAdapter } from '@/backend-adapters';
export const fetchAttendances = attendanceAdapter.fetchAttendances;
export const fetchAttendance = attendanceAdapter.fetchAttendance;
export const checkInAttendance = attendanceAdapter.checkInAttendance;
export const markAttendanceLeave = attendanceAdapter.markAttendanceLeave;
export const batchCheckInAttendances = attendanceAdapter.batchCheckInAttendances;
export const autoCreateAttendances = attendanceAdapter.autoCreateAttendances;
export const fetchAttendanceStats = attendanceAdapter.fetchAttendanceStats;
