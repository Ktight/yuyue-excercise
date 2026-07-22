import type { CourseCategory, CourseDifficulty, ResourceStatus } from '@/generated/enums';
import {
  COURSE_CATEGORY_LABELS,
  COURSE_DIFFICULTY_LABELS,
  RESOURCE_STATUS_LABELS,
} from '@/generated/enums';

export type { CourseCategory, CourseDifficulty, ResourceStatus as CourseStatus };

export interface CourseTemplate {
  id: number;
  companyId: number;
  name: string;
  category: CourseCategory;
  durationMinutes: number;
  maxCapacity: number;
  difficulty: CourseDifficulty;
  description: string;
  coverImage: string;
  status: ResourceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CourseTemplateQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: string;
  category?: CourseCategory;
  difficulty?: CourseDifficulty;
  status?: ResourceStatus;
  companyId?: number;
}

export interface CourseTemplateListResult {
  items: CourseTemplate[];
  page: number;
  pageSize: number;
  total: number;
}

export interface CourseTemplateWriteInput {
  name: string;
  category: CourseCategory;
  durationMinutes: number;
  maxCapacity: number;
  difficulty: CourseDifficulty;
  description: string;
  status?: ResourceStatus;
}

export const CATEGORY_LABELS = COURSE_CATEGORY_LABELS;
export const DIFFICULTY_LABELS = COURSE_DIFFICULTY_LABELS;
export const STATUS_LABELS = RESOURCE_STATUS_LABELS;
