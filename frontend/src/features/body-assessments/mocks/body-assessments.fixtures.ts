import type { BodyAssessmentDto } from '@/features/body-assessments/model';
export const MOCK_ASSESSMENTS: Record<string, BodyAssessmentDto[]> = {
  'stu-001': [
    {
      id: 'ba-001',
      student_id: 'stu-001',
      height: 165,
      weight: 55,
      body_fat_pct: 24,
      bmi: 20.2,
      notes: '初次评估',
      assessed_at: '2026-01-15T00:00:00Z',
      created_at: '2026-01-15T00:00:00Z',
    },
    {
      id: 'ba-002',
      student_id: 'stu-001',
      height: 165,
      weight: 53,
      body_fat_pct: 22,
      bmi: 19.5,
      notes: '柔韧性改善',
      assessed_at: '2026-04-15T00:00:00Z',
      created_at: '2026-04-15T00:00:00Z',
    },
    {
      id: 'ba-003',
      student_id: 'stu-001',
      height: 165,
      weight: 52,
      body_fat_pct: 21,
      bmi: 19.1,
      assessed_at: '2026-07-01T00:00:00Z',
      created_at: '2026-07-01T00:00:00Z',
    },
  ],
};
