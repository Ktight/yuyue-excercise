export type ClassTemplateScope = 'personal' | 'company_shared';
export interface PoseItem {
  name: string;
  duration: number;
  notes: string;
  variations: string;
  assists: string;
}
export interface PoseSequence {
  warmup: PoseItem[];
  main: PoseItem[];
  cooldown: PoseItem[];
}
export interface ClassTemplate {
  id: number;
  companyId: number;
  trainerId: number;
  trainerName: string;
  name: string;
  scope: ClassTemplateScope;
  courseTemplateId: number | null;
  courseTemplateName: string | null;
  poseSequence: PoseSequence;
  notesTemplate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface ClassTemplateListQuery {
  page?: number;
  pageSize?: number;
  scope?: ClassTemplateScope;
  companyId?: number;
}
export interface ClassTemplateListResult {
  items: ClassTemplate[];
  page: number;
  pageSize: number;
  total: number;
}
export interface ClassTemplateWriteInput {
  trainerId: number;
  name: string;
  scope: ClassTemplateScope;
  courseTemplateId: number | null;
  poseSequence: PoseSequence;
  notesTemplate: string;
  isActive: boolean;
}
export type ClassTemplateUpdateInput = Partial<ClassTemplateWriteInput>;
