import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import { mapClassRecord } from './class-records.adapter';
import type {
  TrainingPlan,
  TrainingPlanDetail,
  TrainingPlanListResult,
  TrainingPlanQuery,
  TrainingPlanWriteInput,
} from '@/features/training-plans/model';
type S = components['schemas'];
const map = (v: S['TrainingPlan']): TrainingPlan => ({
  id: v.id,
  companyId: v.company,
  studentId: v.student,
  studentName: v.student_name,
  trainerId: v.trainer,
  trainerName: v.trainer_name,
  title: v.title,
  startDate: v.start_date,
  endDate: v.end_date,
  targetFrequencyPerWeek: v.target_frequency_per_week,
  goalDescription: v.goal_description,
  focusTags: v.focus_tags,
  status: v.status,
  completedSessionsCount: v.completed_sessions_count,
  progressPercentage: v.progress_percentage,
  createdAt: v.created_at,
  updatedAt: v.updated_at,
});
const toWire = (v: TrainingPlanWriteInput): S['TrainingPlanCreateRequest'] => ({
  student: v.studentId,
  title: v.title,
  start_date: v.startDate,
  end_date: v.endDate,
  target_frequency_per_week: v.targetFrequencyPerWeek,
  goal_description: v.goalDescription,
  focus_tags: v.focusTags,
  status: v.status,
});
export async function fetchTrainingPlans(
  q: TrainingPlanQuery = {},
): Promise<TrainingPlanListResult> {
  const { data } = await httpClient.get<S['TrainingPlanListSuccessResponse']>('/training-plans/', {
    params: {
      page: q.page,
      page_size: q.pageSize,
      student_id: q.studentId,
      trainer_id: q.trainerId,
      status: q.status,
      company_id: q.companyId,
    },
  });
  return {
    items: data.data.items.map(map),
    page: data.data.page,
    pageSize: data.data.page_size,
    total: data.data.total,
  };
}
export async function fetchTrainingPlan(
  id: number,
  page = 1,
  pageSize = 20,
): Promise<TrainingPlanDetail> {
  const { data } = await httpClient.get<S['TrainingPlanDetailSuccessResponse']>(
    `/training-plans/${id}/`,
    { params: { linked_records_page: page, linked_records_page_size: pageSize } },
  );
  const v = data.data;
  return {
    ...map(v),
    linkedRecords: v.linked_records.items.map(mapClassRecord),
    linkedRecordsPage: v.linked_records.page,
    linkedRecordsPageSize: v.linked_records.page_size,
    linkedRecordsTotal: v.linked_records.total,
  };
}
export async function createTrainingPlan(v: TrainingPlanWriteInput): Promise<TrainingPlan> {
  const { data } = await httpClient.post<S['TrainingPlanSuccessResponse']>(
    '/training-plans/',
    toWire(v),
  );
  return map(data.data);
}
export async function updateTrainingPlan(
  id: number,
  v: Partial<TrainingPlanWriteInput>,
): Promise<TrainingPlan> {
  const body: S['TrainingPlanUpdateRequest'] = {
    student: v.studentId,
    title: v.title,
    start_date: v.startDate,
    end_date: v.endDate,
    target_frequency_per_week: v.targetFrequencyPerWeek,
    goal_description: v.goalDescription,
    focus_tags: v.focusTags,
    status: v.status,
  };
  const { data } = await httpClient.patch<S['TrainingPlanSuccessResponse']>(
    `/training-plans/${id}/`,
    body,
  );
  return map(data.data);
}
export async function deleteTrainingPlan(id: number): Promise<void> {
  await httpClient.delete(`/training-plans/${id}/`);
}
export async function completeTrainingPlan(id: number): Promise<TrainingPlan> {
  const { data } = await httpClient.post<S['TrainingPlanSuccessResponse']>(
    `/training-plans/${id}/complete/`,
  );
  return map(data.data);
}
export async function pauseTrainingPlan(id: number): Promise<TrainingPlan> {
  const { data } = await httpClient.post<S['TrainingPlanSuccessResponse']>(
    `/training-plans/${id}/pause/`,
  );
  return map(data.data);
}
