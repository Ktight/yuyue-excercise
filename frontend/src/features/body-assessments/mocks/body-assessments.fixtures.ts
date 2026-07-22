import type { components } from '@/generated/api-types';
export type MockAssessment = components['schemas']['BodyAssessment'];
export const MOCK_ASSESSMENTS: MockAssessment[] = [
  {
    id: 1,
    student: 1,
    assess_date: '2026-07-01',
    height: 165,
    weight: 55,
    posture_spine: '正常',
    posture_pelvis: '正常',
    posture_shoulder: '轻微高低肩',
    flexibility_score: 7,
    core_strength_score: 6,
    photos: [],
    notes: '基线评估',
    created_at: '2026-07-01T10:00:00+08:00',
  },
];
