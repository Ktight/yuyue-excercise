import type { components } from '@/generated/api-types';
export type MockAttendance = components['schemas']['Attendance'];
export const MOCK_ATTENDANCES: MockAttendance[] = [
  {
    id: 1,
    company: 1,
    booking: 1,
    schedule: 1,
    student: 6,
    student_name: '演示学员',
    schedule_name: '流瑜伽基础',
    check_in_time: null,
    status: 'absent',
    checked_by: null,
    checked_by_name: null,
    created_at: '2026-07-22T10:00:00+08:00',
    updated_at: '2026-07-22T10:00:00+08:00',
  },
];
