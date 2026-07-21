/** 课程模板类型。枚举值待契约冻结，当前为占位定义。 */

export type CourseCategory = 'yoga' | 'pilates' | 'meditation' | 'personal';
export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'active' | 'inactive';

export interface CourseTemplateDto {
  id: string;
  name: string;
  category: CourseCategory;
  duration_minutes: number;
  difficulty: CourseDifficulty;
  capacity: number;
  status: CourseStatus;
  description?: string;
  created_at?: string;
}

export interface CourseTemplateListRequestDto {
  page?: number;
  page_size?: number;
  search?: string;
  category?: CourseCategory;
  difficulty?: CourseDifficulty;
  status?: CourseStatus;
}

export interface CourseTemplateCreateRequestDto {
  name: string;
  category: CourseCategory;
  duration_minutes: number;
  difficulty: CourseDifficulty;
  capacity: number;
  description?: string;
}

export const CATEGORY_LABELS: Record<CourseCategory, string> = {
  yoga: '瑜伽',
  pilates: '普拉提',
  meditation: '冥想',
  personal: '私教',
};
export const DIFFICULTY_LABELS: Record<CourseDifficulty, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
};
export const STATUS_LABELS: Record<CourseStatus, string> = { active: '启用', inactive: '停用' };
