import { httpClient } from '@/shared/api';
import type {
  CourseTemplateDto,
  CourseTemplateListRequestDto,
  CourseTemplateCreateRequestDto,
} from '@/features/course-templates/model';
interface PaginatedData<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}

export async function fetchCourseTemplates(params: CourseTemplateListRequestDto = {}) {
  const r = await httpClient.get<{ code: string; data: PaginatedData<CourseTemplateDto> }>(
    '/course-templates',
    { params },
  );
  return r.data;
}
export async function fetchCourseTemplate(id: string) {
  const r = await httpClient.get<{ code: string; data: CourseTemplateDto }>(
    `/course-templates/${id}`,
  );
  return r.data;
}
export async function createCourseTemplate(dto: CourseTemplateCreateRequestDto) {
  const r = await httpClient.post<{ code: string; data: CourseTemplateDto }>(
    '/course-templates',
    dto,
  );
  return r.data;
}
export async function updateCourseTemplate(
  id: string,
  dto: Partial<CourseTemplateCreateRequestDto>,
) {
  const r = await httpClient.put<{ code: string; data: CourseTemplateDto }>(
    `/course-templates/${id}`,
    dto,
  );
  return r.data;
}
export async function toggleCourseTemplateStatus(id: string, status: 'active' | 'inactive') {
  const r = await httpClient.patch<{ code: string; data: CourseTemplateDto }>(
    `/course-templates/${id}/status`,
    { status },
  );
  return r.data;
}
