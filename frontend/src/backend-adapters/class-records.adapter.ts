import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type {
  BatchClassRecordInput,
  BatchClassRecordResult,
  ClassRecord,
  ClassRecordListResult,
  ClassRecordQuery,
  ClassRecordUpdateInput,
  ClassRecordWriteInput,
} from '@/features/class-records/model';
type S = components['schemas'];
type W = S['ClassRecord'];
export const mapClassRecord = (v: W): ClassRecord => ({
  id: v.id,
  companyId: v.company,
  attendanceId: v.attendance ?? null,
  attendanceStatus: v.attendance_status ?? null,
  scheduleId: v.schedule ?? null,
  studentId: v.student,
  studentName: v.student_name,
  trainerId: v.trainer,
  trainerName: v.trainer_name,
  storeId: v.store,
  plan: v.plan ? { id: v.plan.id, title: v.plan.title, progress: v.plan.progress } : null,
  classDate: v.class_date,
  theme: v.theme,
  sessionNumber: v.session_number,
  poseSequence: {
    warmup: v.pose_sequence.warmup.map((x) => ({
      ...x,
      notes: x.notes ?? '',
      variations: x.variations ?? '',
      assists: x.assists ?? '',
    })),
    main: v.pose_sequence.main.map((x) => ({
      ...x,
      notes: x.notes ?? '',
      variations: x.variations ?? '',
      assists: x.assists ?? '',
    })),
    cooldown: v.pose_sequence.cooldown.map((x) => ({
      ...x,
      notes: x.notes ?? '',
      variations: x.variations ?? '',
      assists: x.assists ?? '',
    })),
  },
  trainerNotes: v.trainer_notes,
  homework: v.homework,
  completionRating: v.completion_rating ?? null,
  improvementTags: v.improvement_tags,
  nextFocus: v.next_focus,
  status: v.status,
  media: v.media.map((m) => ({
    id: m.id,
    classRecordId: m.class_record,
    mediaType: m.media_type,
    fileUrl: m.file_url,
    thumbnailUrl: m.thumbnail_url,
    caption: m.caption,
    annotations: m.annotations ?? null,
    sortOrder: m.sort_order,
  })),
  createdAt: v.created_at,
  updatedAt: v.updated_at,
});
const body = (v: ClassRecordWriteInput): S['ClassRecordCreateRequest'] => ({
  attendance_id: v.attendanceId,
  ...(v.planId !== undefined ? { plan: v.planId } : {}),
  theme: v.theme,
  pose_sequence: v.poseSequence,
  trainer_notes: v.trainerNotes,
  homework: v.homework,
  completion_rating: v.completionRating,
  improvement_tags: v.improvementTags,
  next_focus: v.nextFocus,
});
export async function fetchClassRecords(q: ClassRecordQuery = {}): Promise<ClassRecordListResult> {
  const { data } = await httpClient.get<S['ClassRecordListSuccessResponse']>('/class-records/', {
    params: {
      page: q.page,
      page_size: q.pageSize,
      student_id: q.studentId,
      trainer_id: q.trainerId,
      date_from: q.dateFrom,
      date_to: q.dateTo,
      company_id: q.companyId,
    },
  });
  return {
    items: data.data.items.map(mapClassRecord),
    page: data.data.page,
    pageSize: data.data.page_size,
    total: data.data.total,
  };
}
export async function fetchClassRecord(id: number) {
  const { data } = await httpClient.get<S['ClassRecordSuccessResponse']>(`/class-records/${id}/`);
  return mapClassRecord(data.data);
}
export async function createClassRecord(v: ClassRecordWriteInput) {
  const { data } = await httpClient.post<S['ClassRecordSuccessResponse']>(
    '/class-records/',
    body(v),
  );
  return mapClassRecord(data.data);
}
export async function updateClassRecord(id: number, v: ClassRecordUpdateInput) {
  const b: S['ClassRecordUpdateRequest'] = {
    theme: v.theme,
    pose_sequence: v.poseSequence,
    trainer_notes: v.trainerNotes,
    homework: v.homework,
    completion_rating: v.completionRating,
    improvement_tags: v.improvementTags,
    next_focus: v.nextFocus,
  };
  const { data } = await httpClient.patch<S['ClassRecordSuccessResponse']>(
    `/class-records/${id}/`,
    b,
  );
  return mapClassRecord(data.data);
}
export async function unlinkClassRecordPlan(id: number) {
  const { data } = await httpClient.post<S['ClassRecordSuccessResponse']>(
    `/class-records/${id}/unlink/`,
  );
  return mapClassRecord(data.data);
}
export async function completeClassRecord(id: number) {
  const { data } = await httpClient.post<S['ClassRecordSuccessResponse']>(
    `/class-records/${id}/complete/`,
  );
  return mapClassRecord(data.data);
}
export async function batchCreateClassRecords(
  v: BatchClassRecordInput,
): Promise<BatchClassRecordResult> {
  const { data } = await httpClient.post<S['BatchClassRecordSuccessResponse']>(
    '/training/batch-records/',
    {
      schedule_id: v.scheduleId,
      common_data: {
        theme: v.commonData.theme,
        pose_sequence: v.commonData.poseSequence,
        trainer_notes: v.commonData.trainerNotes,
        homework: v.commonData.homework,
      },
      student_overrides: v.studentOverrides,
    },
  );
  return { createdCount: data.data.created_count, items: data.data.items.map(mapClassRecord) };
}
