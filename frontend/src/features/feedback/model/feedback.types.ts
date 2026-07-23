export type FeedbackFeeling = 'easy' | 'moderate' | 'hard';

export interface StudentFeedback {
  id: number;
  classRecordId: number;
  studentName: string;
  feeling: FeedbackFeeling;
  comment: string;
  photoUrls: string[];
  canEdit: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackWriteInput {
  classRecordId: number;
  feeling: FeedbackFeeling;
  comment: string;
  photoUrls: string[];
}
