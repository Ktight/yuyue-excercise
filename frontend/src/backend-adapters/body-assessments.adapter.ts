import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type {
  AssessmentListResult,
  AssessmentQuery,
  AssessmentTrendData,
  BodyAssessment,
  BodyAssessmentWriteInput,
  TrendMetric,
} from '@/features/body-assessments/model';

type Wire = components['schemas']['BodyAssessment'];
type WireCreate = components['schemas']['BodyAssessmentCreateRequest'];
type WireUpdate = components['schemas']['BodyAssessmentUpdateRequest'];
type WireSuccess = components['schemas']['BodyAssessmentSuccessResponse'];
type WireList = components['schemas']['BodyAssessmentListSuccessResponse'];
type WireTrend = components['schemas']['BodyAssessmentTrendSuccessResponse'];

export function mapAssessment(value: Wire): BodyAssessment {
  return {
    id: value.id,
    studentId: value.student,
    assessDate: value.assess_date,
    height: value.height,
    weight: value.weight,
    postureSpine: value.posture_spine,
    posturePelvis: value.posture_pelvis,
    postureShoulder: value.posture_shoulder,
    flexibilityScore: value.flexibility_score,
    coreStrengthScore: value.core_strength_score,
    photos: value.photos,
    notes: value.notes,
    createdAt: value.created_at,
  };
}

function toCreate(value: BodyAssessmentWriteInput): WireCreate {
  return {
    student: value.studentId,
    assess_date: value.assessDate,
    height: value.height,
    weight: value.weight,
    posture_spine: value.postureSpine,
    posture_pelvis: value.posturePelvis,
    posture_shoulder: value.postureShoulder,
    flexibility_score: value.flexibilityScore,
    core_strength_score: value.coreStrengthScore,
    notes: value.notes,
  };
}

export async function fetchAssessments(query: AssessmentQuery = {}): Promise<AssessmentListResult> {
  const { data } = await httpClient.get<WireList>('/body-assessments/', {
    params: {
      page: query.page,
      page_size: query.pageSize,
      student_id: query.studentId,
      ordering: query.ordering,
    },
  });
  return {
    items: data.data.items.map(mapAssessment),
    page: data.data.page,
    pageSize: data.data.page_size,
    total: data.data.total,
  };
}

export async function fetchAssessment(id: number): Promise<BodyAssessment> {
  const { data } = await httpClient.get<WireSuccess>(`/body-assessments/${id}/`);
  return mapAssessment(data.data);
}

export async function createAssessment(value: BodyAssessmentWriteInput): Promise<BodyAssessment> {
  const { data } = await httpClient.post<WireSuccess>('/body-assessments/', toCreate(value));
  return mapAssessment(data.data);
}

export async function updateAssessment(
  id: number,
  value: Partial<BodyAssessmentWriteInput>,
): Promise<BodyAssessment> {
  const body: WireUpdate = {
    assess_date: value.assessDate,
    height: value.height,
    weight: value.weight,
    posture_spine: value.postureSpine,
    posture_pelvis: value.posturePelvis,
    posture_shoulder: value.postureShoulder,
    flexibility_score: value.flexibilityScore,
    core_strength_score: value.coreStrengthScore,
    notes: value.notes,
  };
  const { data } = await httpClient.patch<WireSuccess>(`/body-assessments/${id}/`, body);
  return mapAssessment(data.data);
}

export async function deleteAssessment(id: number): Promise<void> {
  await httpClient.delete(`/body-assessments/${id}/`);
}

export async function fetchAssessmentTrend(
  studentId: number,
  metric: TrendMetric = 'weight',
): Promise<AssessmentTrendData> {
  const { data } = await httpClient.get<WireTrend>(
    `/students/${studentId}/body-assessment-trend/`,
    { params: { metric } },
  );
  return {
    studentId: data.data.student_id,
    metric: data.data.metric,
    unit: data.data.unit,
    hasTrend: data.data.has_trend,
    points: data.data.points.map((point) => ({
      assessmentId: point.assessment_id,
      assessDate: point.assess_date,
      value: point.value,
    })),
  };
}
