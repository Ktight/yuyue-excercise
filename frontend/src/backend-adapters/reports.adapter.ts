import { httpClient } from '@/shared/api';
import type { components } from '@/generated/api-types';
import type { ReportRequest, StageReport } from '@/features/reports/model';
type S = components['schemas'];

export async function previewStageReport(input: ReportRequest): Promise<StageReport> {
  const { data } = await httpClient.get<S['ReportPreviewSuccessResponse']>('/reports/', {
    params: { student_id: input.studentId, start: input.rangeStart, end: input.rangeEnd },
  });
  const value = data.data;
  const metrics = [
    ['身高', 'cm', 'height_cm'],
    ['体重', 'kg', 'weight_kg'],
    ['柔韧性', '分', 'flexibility_score'],
    ['核心力量', '分', 'core_strength_score'],
  ] as const;
  return {
    studentId: value.student.id,
    studentName: value.student.name,
    trainerName: value.trainer?.name ?? '暂无负责教练',
    rangeStart: value.range_start,
    rangeEnd: value.range_end,
    generatedAt: value.generated_at,
    trainingCount: value.total_sessions,
    attendanceRate:
      value.attendance_rate == null ? null : Math.round(value.attendance_rate * 10000) / 100,
    averageRating: value.average_rating,
    planProgress: value.training_plan?.progress_percentage ?? null,
    ratingTrend: value.rating_trend.map((point) => ({
      date: point.date,
      rating: point.rating,
    })),
    bodyMetrics: metrics
      .map(([label, unit, key]) => ({
        label,
        unit,
        before: value.body_comparison.before?.[key] ?? null,
        after: value.body_comparison.after?.[key] ?? null,
      }))
      .filter((metric) => metric.before != null || metric.after != null),
    feedbackCount: value.feedback_summary.total,
    feelingDistribution: [
      { label: '轻松', count: value.feedback_summary.distribution.easy },
      { label: '适中', count: value.feedback_summary.distribution.moderate },
      { label: '吃力', count: value.feedback_summary.distribution.hard },
    ],
    feedbackHighlights: value.feedback_summary.representative_comments.map(
      (comment) => comment.improvement_note || comment.comment,
    ),
    trainerComments: value.trainer_comments
      .map((comment) => `${comment.date} ${comment.theme}：${comment.comment}`)
      .join('\n'),
  };
}
