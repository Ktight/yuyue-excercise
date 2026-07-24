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
  {
    id: 2,
    company: 1,
    booking: 2,
    schedule: 1,
    student: 5,
    student_name: '示例学员',
    schedule_name: '流瑜伽基础',
    check_in_time: '2026-07-22T10:02:00+08:00',
    status: 'present',
    checked_by: 4,
    checked_by_name: 'Mock 教练',
    created_at: '2026-07-22T10:00:00+08:00',
    updated_at: '2026-07-22T10:02:00+08:00',
  },
];
