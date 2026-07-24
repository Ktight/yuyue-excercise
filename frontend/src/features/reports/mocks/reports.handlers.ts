import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';
type S = components['schemas'];

export const reportsHandlers = [
  http.get('/api/reports/', ({ request }) => {
    const query = new URL(request.url).searchParams;
    const studentId = Number(query.get('student_id'));
    const start = query.get('start') ?? '2026-07-01';
    const end = query.get('end') ?? '2026-07-23';
    const data: S['ReportPreview'] = {
      student: { id: studentId, name: `演示学员 ${studentId}`, avatar: null },
      trainer: { id: 2, name: '张教练', avatar: null },
      range_start: start,
      range_end: end,
      generated_at: new Date().toISOString(),
      total_sessions: 12,
      train_count: 12,
      attendance_rate: 0.917,
      average_rating: 4.3,
      rating_trend: [
        { date: '2026-07-01', class_record_id: 1, rating: 3 },
        { date: '2026-07-08', class_record_id: 2, rating: 4 },
        { date: '2026-07-15', class_record_id: 3, rating: 5 },
      ],
      body_comparison: {
        before: {
          id: 1,
          date: '2026-07-01',
          height_cm: 165,
          weight_kg: 60.2,
          posture_spine: '轻微侧弯',
          posture_pelvis: '前倾',
          posture_shoulder: '圆肩',
          flexibility_score: 6,
          core_strength_score: 5,
          notes: '阶段开始',
        },
        after: {
          id: 2,
          date: '2026-07-22',
          height_cm: 165,
          weight_kg: 58.9,
          posture_spine: '改善',
          posture_pelvis: '中立',
          posture_shoulder: '改善',
          flexibility_score: 8,
          core_strength_score: 8,
          notes: '阶段复测',
        },
        changes: {
          height_cm: 0,
          weight_kg: -1.3,
          flexibility_score: 2,
          core_strength_score: 3,
        },
        reason: null,
      },
      feedback_summary: {
        total: 8,
        distribution: { easy: 2, moderate: 5, hard: 1 },
        representative_comments: [
          {
            date: '2026-07-15',
            class_record_id: 3,
            improvement_note: '肩颈比之前放松',
            comment: '核心动作更稳定',
          },
        ],
        reason: null,
      },
      trainer_comments: [
        {
          date: '2026-07-15',
          class_record_id: 3,
          trainer_id: 2,
          trainer_name: '张教练',
          theme: '核心稳定',
          comment: '动作控制明显改善。',
        },
      ],
      training_plan: {
        id: 1,
        title: '核心提升计划',
        status: 'active',
        start_date: start,
        end_date: end,
        target_frequency_per_week: 2,
        focus_tags: ['核心'],
        total_sessions: 20,
        completed_sessions: 12,
        progress_percentage: 60,
      },
      data_notes: [],
    };
    return HttpResponse.json({ code: 'OK', message: '', data });
  }),
];
