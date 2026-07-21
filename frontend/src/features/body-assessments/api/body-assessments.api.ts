import { httpClient } from '@/shared/api';
import type {
  BodyAssessmentDto,
  BodyAssessmentCreateRequestDto,
} from '@/features/body-assessments/model';
interface PaginatedData<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}

export async function fetchAssessments(params: { student_id: string }) {
  const r = await httpClient.get<{ code: string; data: PaginatedData<BodyAssessmentDto> }>(
    '/body-assessments',
    { params },
  );
  return r.data;
}
export async function createAssessment(dto: BodyAssessmentCreateRequestDto) {
  const r = await httpClient.post<{ code: string; data: BodyAssessmentDto }>(
    '/body-assessments',
    dto,
  );
  return r.data;
}
