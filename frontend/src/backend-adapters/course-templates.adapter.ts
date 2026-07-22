import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type {
  CourseTemplate,
  CourseTemplateListResult,
  CourseTemplateQuery,
  CourseTemplateWriteInput,
} from '@/features/course-templates/model';

type WireCourseTemplate = components['schemas']['CourseTemplate'];
type WireCreate = components['schemas']['CourseTemplateCreateRequest'];
type WireUpdate = components['schemas']['CourseTemplateUpdateRequest'];
type WireSuccess = components['schemas']['CourseTemplateSuccessResponse'];
type WireListSuccess = components['schemas']['CourseTemplateListSuccessResponse'];

function mapCourseTemplate(value: WireCourseTemplate): CourseTemplate {
  return {
    id: value.id,
    companyId: value.company,
    name: value.name,
    category: value.category,
    durationMinutes: value.duration_minutes,
    maxCapacity: value.max_capacity,
    difficulty: value.difficulty,
    description: value.description,
    coverImage: value.cover_image,
    status: value.status,
    createdAt: value.created_at,
    updatedAt: value.updated_at,
  };
}

function toWire(value: CourseTemplateWriteInput): WireCreate {
  return {
    name: value.name,
    category: value.category,
    duration_minutes: value.durationMinutes,
    max_capacity: value.category === 'private' ? 1 : value.maxCapacity,
    difficulty: value.difficulty,
    description: value.description,
    status: value.status,
  };
}

export async function fetchCourseTemplates(
  query: CourseTemplateQuery = {},
): Promise<CourseTemplateListResult> {
  const { data } = await httpClient.get<WireListSuccess>('/course-templates/', {
    params: {
      page: query.page,
      page_size: query.pageSize,
      search: query.search,
      ordering: query.ordering,
      category: query.category,
      difficulty: query.difficulty,
      status: query.status,
      company_id: query.companyId,
    },
  });
  return {
    items: data.data.items.map(mapCourseTemplate),
    page: data.data.page,
    pageSize: data.data.page_size,
    total: data.data.total,
  };
}

export async function fetchCourseTemplate(id: number): Promise<CourseTemplate> {
  const { data } = await httpClient.get<WireSuccess>(`/course-templates/${id}/`);
  return mapCourseTemplate(data.data);
}

export async function createCourseTemplate(
  value: CourseTemplateWriteInput,
): Promise<CourseTemplate> {
  const { data } = await httpClient.post<WireSuccess>('/course-templates/', toWire(value));
  return mapCourseTemplate(data.data);
}

export async function updateCourseTemplate(
  id: number,
  value: Partial<CourseTemplateWriteInput>,
): Promise<CourseTemplate> {
  const body: WireUpdate = {
    name: value.name,
    category: value.category,
    duration_minutes: value.durationMinutes,
    max_capacity: value.category === 'private' ? 1 : value.maxCapacity,
    difficulty: value.difficulty,
    description: value.description,
    status: value.status,
  };
  const { data } = await httpClient.patch<WireSuccess>(`/course-templates/${id}/`, body);
  return mapCourseTemplate(data.data);
}

export async function setCourseTemplateActive(
  id: number,
  active: boolean,
): Promise<CourseTemplate> {
  return updateCourseTemplate(id, { status: active ? 'active' : 'inactive' });
}

export async function deleteCourseTemplate(id: number): Promise<void> {
  await httpClient.delete(`/course-templates/${id}/`);
}
