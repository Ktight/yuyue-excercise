import type { PoseSequence } from '@/features/class-templates';
export type ClassRecordStatus = 'draft' | 'completed';
export interface ClassRecordMedia {
  id: number;
  classRecordId: number;
  mediaType: 'image' | 'video';
  fileUrl: string;
  thumbnailUrl: string;
  caption: string;
  annotations: Record<string, unknown> | null;
  sortOrder: number;
}
export interface ClassRecordPlanSummary {
  id: number;
  title: string;
  progress: number;
}
export interface ClassRecord {
  id: number;
  companyId: number;
  attendanceId: number | null;
  attendanceStatus: 'present' | 'late' | 'absent' | 'leave' | null;
  scheduleId: number | null;
  studentId: number;
  studentName: string;
  trainerId: number;
  trainerName: string;
  storeId: number;
  plan: ClassRecordPlanSummary | null;
  classDate: string;
  theme: string;
  sessionNumber: number;
  poseSequence: PoseSequence;
  trainerNotes: string;
  homework: string;
  completionRating: number | null;
  improvementTags: string[];
  nextFocus: string;
  status: ClassRecordStatus;
  media: ClassRecordMedia[];
  createdAt: string;
  updatedAt: string;
}
export interface ClassRecordQuery {
  page?: number;
  pageSize?: number;
  studentId?: number;
  trainerId?: number;
  dateFrom?: string;
  dateTo?: string;
  companyId?: number;
}
export interface ClassRecordListResult {
  items: ClassRecord[];
  page: number;
  pageSize: number;
  total: number;
}
export interface ClassRecordWriteInput {
  attendanceId: number;
  planId?: number | null;
  theme: string;
  poseSequence: PoseSequence;
  trainerNotes: string;
  homework: string;
  completionRating: number | null;
  improvementTags: string[];
  nextFocus: string;
}
export type ClassRecordUpdateInput = Partial<
  Omit<ClassRecordWriteInput, 'attendanceId' | 'planId'>
>;
export interface BatchStudentOverride {
  completionRating?: number;
  trainerNotes?: string;
  improvementTags?: string[];
  homework?: string;
}
export interface BatchClassRecordInput {
  scheduleId: number;
  commonData: { theme: string; poseSequence: PoseSequence; trainerNotes: string; homework: string };
  studentOverrides: Record<string, BatchStudentOverride>;
}
export interface BatchClassRecordResult {
  createdCount: number;
  items: ClassRecord[];
}
