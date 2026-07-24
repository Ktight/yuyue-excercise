export interface DashboardMetric {
  key: 'todayClasses' | 'todayBookings' | 'activeStudents' | 'pendingItems';
  label: string;
  value: number;
  unit: string;
  hint: string;
}

export interface DashboardTrendPoint {
  label: string;
  value: number;
}

export interface DashboardScheduleItem {
  id: number;
  time: string;
  courseName: string;
  trainerName: string;
  roomName: string;
  booked: number;
  capacity: number;
}

export interface AdminDashboardSummary {
  generatedAt: string;
  timezone: 'Asia/Shanghai';
  metrics: DashboardMetric[];
  bookingTrend: DashboardTrendPoint[];
  todaySchedules: DashboardScheduleItem[];
}
