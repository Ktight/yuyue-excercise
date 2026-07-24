export interface ReportRequest {
  studentId: number;
  rangeStart: string;
  rangeEnd: string;
}
export interface ReportTrendPoint {
  date: string;
  rating: number;
}
export interface ReportBodyMetric {
  label: string;
  unit: string;
  before: number | null;
  after: number | null;
}
export interface StageReport {
  studentId: number;
  studentName: string;
  trainerName: string;
  rangeStart: string;
  rangeEnd: string;
  generatedAt: string;
  trainingCount: number;
  attendanceRate: number | null;
  averageRating: number | null;
  planProgress: number | null;
  ratingTrend: ReportTrendPoint[];
  bodyMetrics: ReportBodyMetric[];
  feedbackCount: number;
  feelingDistribution: Array<{ label: string; count: number }>;
  feedbackHighlights: string[];
  trainerComments: string;
}
