import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type {
  Company,
  CompanyListQuery,
  CompanyListResult,
  CompanyWriteInput,
} from '@/features/companies/model';

type Wire = components['schemas']['Company'];
type WireCreate = components['schemas']['CompanyCreateRequest'];
type WireUpdate = components['schemas']['CompanyUpdateRequest'];
type Success = components['schemas']['CompanySuccessResponse'];
type ListSuccess = components['schemas']['CompanyListSuccessResponse'];

const map = (value: Wire): Company => ({
  id: value.id,
  name: value.name,
  contactPerson: value.contact_person,
  contactPhone: value.contact_phone,
  contractStart: value.contract_start,
  contractEnd: value.contract_end,
  status: value.status,
  createdAt: value.created_at,
});
const toWire = (value: CompanyWriteInput): WireCreate => ({
  name: value.name,
  contact_person: value.contactPerson,
  contact_phone: value.contactPhone,
  contract_start: value.contractStart,
  contract_end: value.contractEnd,
  status: value.status,
});

export async function fetchCompanies(query: CompanyListQuery = {}): Promise<CompanyListResult> {
  const { data } = await httpClient.get<ListSuccess>('/companies/', {
    params: {
      page: query.page,
      page_size: query.pageSize,
      search: query.search,
      status: query.status,
    },
  });
  return {
    items: data.data.items.map(map),
    page: data.data.page,
    pageSize: data.data.page_size,
    total: data.data.total,
  };
}
export async function fetchCompany(id: number): Promise<Company> {
  const { data } = await httpClient.get<Success>(`/companies/${id}/`);
  return map(data.data);
}
export async function createCompany(value: CompanyWriteInput): Promise<Company> {
  const { data } = await httpClient.post<Success>('/companies/', toWire(value));
  return map(data.data);
}
export async function updateCompany(
  id: number,
  value: Partial<CompanyWriteInput>,
): Promise<Company> {
  const body: WireUpdate = {
    name: value.name,
    contact_person: value.contactPerson,
    contact_phone: value.contactPhone,
    contract_start: value.contractStart,
    contract_end: value.contractEnd,
    status: value.status,
  };
  const { data } = await httpClient.patch<Success>(`/companies/${id}/`, body);
  return map(data.data);
}
export function setCompanyActive(id: number, active: boolean): Promise<Company> {
  return updateCompany(id, { status: active ? 'active' : 'inactive' });
}
