import { httpClient } from '@/shared/api';
import type {
  StudentDto,
  StudentListRequestDto,
  StudentCreateRequestDto,
} from '@/features/students/model';
interface PaginatedData<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}

export async function fetchStudents(params: StudentListRequestDto = {}) {
  const r = await httpClient.get<{ code: string; data: PaginatedData<StudentDto> }>('/students', {
    params,
  });
  return r.data;
}
export async function fetchStudent(id: string) {
  const r = await httpClient.get<{ code: string; data: StudentDto }>(`/students/${id}`);
  return r.data;
}
export async function createStudent(dto: StudentCreateRequestDto) {
  const r = await httpClient.post<{ code: string; data: StudentDto }>('/students', dto);
  return r.data;
}
export async function updateStudent(id: string, dto: Partial<StudentCreateRequestDto>) {
  const r = await httpClient.put<{ code: string; data: StudentDto }>(`/students/${id}`, dto);
  return r.data;
}
