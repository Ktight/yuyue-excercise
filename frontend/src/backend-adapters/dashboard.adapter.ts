import { httpClient } from '@/shared/api';
import type { AdminDashboardSummary } from '@/features/dashboard/model';

interface DraftDashboardPayload {
  generated_at: string;
  metrics: Record<string, number>;
  booking_trend: Array<{ label: string; value: number }>;
  today_schedules: Array<{
    id: number;
    time: string;
    course_name: string;
    trainer_name: string;
    room_name: string;
    booked: number;
    capacity: number;
  }>;
}

function isDraftPayload(value: unknown): value is DraftDashboardPayload {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<DraftDashboardPayload>;
  return (
    typeof candidate.generated_at === 'string' &&
    !!candidate.metrics &&
    Array.isArray(candidate.booking_trend) &&
    Array.isArray(candidate.today_schedules)
  );
}

export async function getAdminDashboard(): Promise<AdminDashboardSummary> {
  const response = await httpClient.get<{ data: unknown }>('/dashboards/admin/');
  if (!isDraftPayload(response.data.data)) {
    throw new Error('DASHBOARD_CONTRACT_MISMATCH');
  }
  const value = response.data.data;
  const metric = (key: keyof DraftDashboardPayload['metrics']) => value.metrics[key] ?? 0;
  return {
    generatedAt: value.generated_at,
    metrics: [
      {
        key: 'todayClasses',
        label: '今日课程',
        value: metric('today_classes'),
        unit: '节',
        hint: '按当前门店时区',
      },
      {
        key: 'todayBookings',
        label: '今日预约',
        value: metric('today_bookings'),
        unit: '人次',
        hint: '不含已取消预约',
      },
      {
        key: 'activeStudents',
        label: '活跃学员',
        value: metric('active_students'),
        unit: '人',
        hint: '统计口径待契约冻结',
      },
      {
        key: 'pendingItems',
        label: '待处理事项',
        value: metric('pending_items'),
        unit: '项',
        hint: '来自提醒中心',
      },
    ],
    bookingTrend: value.booking_trend,
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
