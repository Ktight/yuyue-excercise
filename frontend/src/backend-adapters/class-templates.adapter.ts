import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type {
  ClassTemplate,
  ClassTemplateListQuery,
  ClassTemplateListResult,
  ClassTemplateUpdateInput,
  ClassTemplateWriteInput,
  PoseSequence,
} from '@/features/class-templates/model';
type S = components['schemas'];
type Wire = S['ClassTemplate'];
const mapSequence = (v: Wire['pose_sequence']): PoseSequence => ({
  warmup: v.warmup.map((x) => ({
    name: x.name,
    duration: x.duration,
    notes: x.notes ?? '',
    variations: x.variations ?? '',
    assists: x.assists ?? '',
  })),
  main: v.main.map((x) => ({
    name: x.name,
    duration: x.duration,
    notes: x.notes ?? '',
    variations: x.variations ?? '',
    assists: x.assists ?? '',
  })),
  cooldown: v.cooldown.map((x) => ({
    name: x.name,
    duration: x.duration,
    notes: x.notes ?? '',
    variations: x.variations ?? '',
    assists: x.assists ?? '',
  })),
});
export const mapClassTemplate = (v: Wire): ClassTemplate => ({
  id: v.id,
  companyId: v.company,
  trainerId: v.trainer,
  trainerName: v.trainer_name,
  name: v.name,
  scope: v.scope,
  courseTemplateId: v.course_template ?? null,
  courseTemplateName: v.course_template_name ?? null,
  poseSequence: mapSequence(v.pose_sequence),
  notesTemplate: v.notes_template,
  isActive: v.is_active,
  createdAt: v.created_at,
  updatedAt: v.updated_at,
});
const toCreate = (v: ClassTemplateWriteInput): S['ClassTemplateCreateRequest'] => ({
  trainer: v.trainerId,
  name: v.name,
  scope: v.scope,
  course_template: v.courseTemplateId,
  pose_sequence: v.poseSequence,
  notes_template: v.notesTemplate,
  is_active: v.isActive,
});
export async function fetchClassTemplates(
  q: ClassTemplateListQuery = {},
): Promise<ClassTemplateListResult> {
  const { data } = await httpClient.get<S['ClassTemplateListSuccessResponse']>(
    '/class-templates/',
    { params: { page: q.page, page_size: q.pageSize, scope: q.scope, company_id: q.companyId } },
  );
  return {
    items: data.data.items.map(mapClassTemplate),
    page: data.data.page,
    pageSize: data.data.page_size,
    total: data.data.total,
  };
}
export async function fetchClassTemplate(id: number): Promise<ClassTemplate> {
  const { data } = await httpClient.get<S['ClassTemplateSuccessResponse']>(
    `/class-templates/${id}/`,
  );
  return mapClassTemplate(data.data);
}
export async function createClassTemplate(v: ClassTemplateWriteInput): Promise<ClassTemplate> {
  const { data } = await httpClient.post<S['ClassTemplateSuccessResponse']>(
    '/class-templates/',
    toCreate(v),
  );
  return mapClassTemplate(data.data);
}
export async function updateClassTemplate(
  id: number,
  v: ClassTemplateUpdateInput,
): Promise<ClassTemplate> {
  const body: S['ClassTemplateUpdateRequest'] = {
    trainer: v.trainerId,
    name: v.name,
    scope: v.scope,
    course_template: v.courseTemplateId,
    pose_sequence: v.poseSequence,
    notes_template: v.notesTemplate,
    is_active: v.isActive,
  };
  const { data } = await httpClient.patch<S['ClassTemplateSuccessResponse']>(
    `/class-templates/${id}/`,
    body,
  );
  return mapClassTemplate(data.data);
}
export async function deleteClassTemplate(id: number): Promise<void> {
  await httpClient.delete(`/class-templates/${id}/`);
}
