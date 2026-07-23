import { httpClient } from '@/shared/api';
import type { components } from '@/generated/api-types';
import type { FeedbackWriteInput, StudentFeedback } from '@/features/feedback/model';
type S = components['schemas'];

const map = (value: S['Feedback']): StudentFeedback => ({
  id: value.id,
  classRecordId: value.class_record,
  studentName: value.student.name,
  feeling: value.feeling,
  improvementNote: value.improvement_note,
  comment: value.comment,
  photoUrls: value.photos,
  canEdit: value.is_editable,
  createdAt: value.created_at,
  updatedAt: value.updated_at,
});

export async function fetchClassRecordFeedback(
  classRecordId: number,
): Promise<StudentFeedback | null> {
  const { data } = await httpClient.get<S['FeedbackListSuccessResponse']>('/feedback/', {
    params: { class_record_id: classRecordId, page: 1, page_size: 1 },
  });
  return data.data.items[0] ? map(data.data.items[0]) : null;
}

export async function createStudentFeedback(input: FeedbackWriteInput): Promise<StudentFeedback> {
  const body: S['FeedbackCreateRequest'] = {
    class_record: input.classRecordId,
    feeling: input.feeling,
    improvement_note: input.improvementNote,
    comment: input.comment,
  };
  const { data } = await httpClient.post<S['FeedbackSuccessResponse']>('/feedback/', body);
  return map(data.data);
}
