import { httpClient } from '@/shared/api';
import type {
  CompanyDto,
  CompanyListRequestDto,
  CompanyCreateRequestDto,
} from '@/features/companies/model';

interface PaginatedData<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}

export async function fetchCompanies(params: CompanyListRequestDto = {}) {
  const r = await httpClient.get<{ code: string; data: PaginatedData<CompanyDto> }>('/companies', {
    params,
  });
  return r.data;
}

export async function fetchCompany(id: string) {
  const r = await httpClient.get<{ code: string; data: CompanyDto }>(`/companies/${id}`);
  return r.data;
}

export async function createCompany(dto: CompanyCreateRequestDto) {
  const r = await httpClient.post<{ code: string; data: CompanyDto }>('/companies', dto);
  return r.data;
}

export async function updateCompany(id: string, dto: Partial<CompanyCreateRequestDto>) {
  const r = await httpClient.put<{ code: string; data: CompanyDto }>(`/companies/${id}`, dto);
  return r.data;
}
