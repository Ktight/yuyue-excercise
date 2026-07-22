import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type {
  Company,
  CompanyListQuery,
  CompanyListResult,
  CompanyWriteInput,
} from '@/features/companies/model';
import type { ApiEnvelope, ApiPage } from './organization.types';

type WireCompany = components['schemas']['Company'];

function mapCompany(value: WireCompany): Company {
  return {
    id: value.id,
    name: value.name,
    address: value.address,
    contactName: value.contact_name,
    contactPhone: value.contact_phone,
    status: value.status,
    createdAt: value.created_at,
    updatedAt: value.updated_at,
  };
}

function toWire(value: CompanyWriteInput) {
  return {
    name: value.name,
    address: value.address,
    contact_name: value.contactName,
    contact_phone: value.contactPhone,
  };
}

export async function fetchCompanies(query: CompanyListQuery = {}): Promise<CompanyListResult> {
  const { data } = await httpClient.get<ApiEnvelope<ApiPage<WireCompany>>>('/companies/', {
    params: query,
  });
  return {
    items: data.data.items.map(mapCompany),
    page: data.data.page,
    pageSize: data.data.page_size,
    total: data.data.total,
  };
}

export async function fetchCompany(id: number): Promise<Company> {
  const { data } = await httpClient.get<ApiEnvelope<WireCompany>>(`/companies/${id}/`);
  return mapCompany(data.data);
}

export async function createCompany(value: CompanyWriteInput): Promise<Company> {
  const { data } = await httpClient.post<ApiEnvelope<WireCompany>>('/companies/', toWire(value));
  return mapCompany(data.data);
}

export async function updateCompany(
  id: number,
  value: Partial<CompanyWriteInput>,
): Promise<Company> {
  const body = {
    name: value.name,
    address: value.address,
    contact_name: value.contactName,
    contact_phone: value.contactPhone,
  };
  const { data } = await httpClient.patch<ApiEnvelope<WireCompany>>(`/companies/${id}/`, body);
  return mapCompany(data.data);
}
export async function setCompanyActive(id: number, active: boolean): Promise<Company> {
  const action = active ? 'activate' : 'deactivate';
  const { data } = await httpClient.post<ApiEnvelope<WireCompany>>(
    `/companies/${id}/${action}/`,
    {},
  );
  return mapCompany(data.data);
}
