import { httpClient } from '@/shared/api';
import type { FeedbackWriteInput, StudentFeedback } from '@/features/feedback/model';

interface FeedbackWire {
  id: number;
  class_record_id: number;
  student_name: string;
  feeling: 'easy' | 'moderate' | 'hard';
  comment: string;
  photo_urls: string[];
  can_edit: boolean;
  created_at: string;
  updated_at: string;
}

interface Success<T> {
  code: string;
  message: string;
  data: T;
}

const map = (value: FeedbackWire): StudentFeedback => ({
  id: value.id,
  classRecordId: value.class_record_id,
  studentName: value.student_name,
  feeling: value.feeling,
  comment: value.comment,
  photoUrls: value.photo_urls,
  canEdit: value.can_edit,
  createdAt: value.created_at,
  updatedAt: value.updated_at,
});

export async function fetchClassRecordFeedback(
  classRecordId: number,
): Promise<StudentFeedback | null> {
  const { data } = await httpClient.get<Success<{ items: FeedbackWire[] }>>('/feedback/', {
    params: { class_record_id: classRecordId },
  });
  return data.data.items[0] ? map(data.data.items[0]) : null;
}

export async function createStudentFeedback(input: FeedbackWriteInput): Promise<StudentFeedback> {
  const { data } = await httpClient.post<Success<FeedbackWire>>('/student/feedback/', {
    class_record_id: input.classRecordId,
    feeling: input.feeling,
    comment: input.comment,
    photo_urls: input.photoUrls,
  });
  return map(data.data);
}
