import type { ClassRecord } from '@/features/class-records';
export type TrainingPlanStatus = 'active' | 'completed' | 'paused';
export interface TrainingPlan {
  id: number;
  companyId: number;
  studentId: number;
  studentName: string;
  trainerId: number;
  trainerName: string;
  title: string;
  startDate: string;
  endDate: string;
  targetFrequencyPerWeek: number;
  goalDescription: string;
  focusTags: string[];
  status: TrainingPlanStatus;
  completedSessionsCount: number;
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
}
export interface TrainingPlanDetail extends TrainingPlan {
  linkedRecords: ClassRecord[];
  linkedRecordsPage: number;
  linkedRecordsPageSize: number;
  linkedRecordsTotal: number;
}
export interface TrainingPlanWriteInput {
  studentId: number;
  title: string;
  startDate: string;
  endDate: string;
  targetFrequencyPerWeek: number;
  goalDescription: string;
  focusTags: string[];
  status: TrainingPlanStatus;
}
export interface TrainingPlanQuery {
  page?: number;
  pageSize?: number;
  studentId?: number;
  trainerId?: number;
  status?: TrainingPlanStatus;
  companyId?: number;
}
export interface TrainingPlanListResult {
  items: TrainingPlan[];
  page: number;
  pageSize: number;
  total: number;
}
