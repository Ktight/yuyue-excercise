import { httpClient } from '@/shared/api';
import type { AdminDashboardSummary } from '@/features/dashboard/model';
import type { components } from '@/generated/api-types';

type AdminDashboardSuccessResponse = components['schemas']['AdminDashboardSuccessResponse'];

export async function getAdminDashboard(): Promise<AdminDashboardSummary> {
  const response = await httpClient.get<AdminDashboardSuccessResponse>('/dashboards/admin/');
  const value = response.data.data;
  return {
    generatedAt: value.generated_at,
    timezone: value.timezone,
    metrics: [
      {
        key: 'todayClasses',
        label: '今日课程',
        value: value.metrics.today_classes,
        unit: '节',
        hint: '按上海时区自然日',
      },
      {
        key: 'todayBookings',
        label: '今日预约',
        value: value.metrics.today_bookings,
        unit: '人次',
        hint: '不含已取消预约',
      },
      {
        key: 'activeStudents',
        label: '活跃学员',
        value: value.metrics.active_students,
        unit: '人',
        hint: '有效会员且余额可用',
      },
      {
        key: 'pendingItems',
        label: '待处理事项',
        value: value.metrics.pending_items,
        unit: '项',
        hint: '当前未读且未忽略',
      },
    ],
    bookingTrend: value.booking_trend.map((item) => ({
      label: item.label.slice(5).replace('-', '/'),
      value: item.value,
    })),
    todaySchedules: value.today_schedules.map((item) => ({
      id: item.id,
      time: item.time,
      courseName: item.course_name,
      trainerName: item.trainer_name,
      roomName: item.room_name,
      booked: item.booked,
      capacity: item.capacity,
    })),
  };
}
