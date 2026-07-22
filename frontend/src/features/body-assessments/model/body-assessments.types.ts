export type TrendMetric = 'height' | 'weight' | 'flexibility_score' | 'core_strength_score';

export interface BodyAssessment {
  id: number;
  studentId: number;
  assessDate: string;
  height: number | null;
  weight: number | null;
  postureSpine: string;
  posturePelvis: string;
  postureShoulder: string;
  flexibilityScore: number | null;
  coreStrengthScore: number | null;
  photos: string[];
  notes: string;
  createdAt: string;
}

export interface BodyAssessmentWriteInput {
  studentId: number;
  assessDate: string;
  height?: number | null;
  weight?: number | null;
  postureSpine?: string;
  posturePelvis?: string;
  postureShoulder?: string;
  flexibilityScore?: number | null;
  coreStrengthScore?: number | null;
  notes?: string;
}

export interface AssessmentQuery {
  page?: number;
  pageSize?: number;
  studentId?: number;
  ordering?: 'assess_date' | '-assess_date';
}

export interface AssessmentListResult {
  items: BodyAssessment[];
  page: number;
  pageSize: number;
  total: number;
}

export interface AssessmentTrendData {
  studentId: number;
  metric: TrendMetric;
  unit: 'cm' | 'kg' | 'score_1_10';
  hasTrend: boolean;
  points: Array<{ assessmentId: number; assessDate: string; value: number }>;
}
