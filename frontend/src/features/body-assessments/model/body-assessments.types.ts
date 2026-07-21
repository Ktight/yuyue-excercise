export interface BodyAssessmentDto {
  id: string;
  student_id: string;
  height: number;
  weight: number;
  body_fat_pct?: number;
  bmi?: number;
  measurements?: Record<string, number>;
  notes?: string;
  assessed_at: string;
  created_at?: string;
}
export interface BodyAssessmentCreateRequestDto {
  student_id: string;
  height: number;
  weight: number;
  body_fat_pct?: number;
  measurements?: Record<string, number>;
  notes?: string;
  assessed_at?: string;
}
