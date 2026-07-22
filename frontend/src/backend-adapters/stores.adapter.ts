import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type {
  Store,
  StoreListQuery,
  StoreListResult,
  StoreWriteInput,
} from '@/features/stores/model';
type Wire = components['schemas']['Store'];
type WireCreate = components['schemas']['StoreCreateRequest'];
type WireUpdate = components['schemas']['StoreUpdateRequest'];
type Success = components['schemas']['StoreSuccessResponse'];
type ListSuccess = components['schemas']['StoreListSuccessResponse'];
const map = (value: Wire): Store => ({
  id: value.id,
  companyId: value.company,
  name: value.name,
  address: value.address,
  phone: value.phone,
  businessHours: value.business_hours,
  status: value.status,
  createdAt: value.created_at,
});
const toWire = (value: StoreWriteInput): WireCreate => ({
  name: value.name,
  address: value.address,
  phone: value.phone,
  business_hours: value.businessHours,
  status: value.status,
});
export async function fetchStores(query: StoreListQuery = {}): Promise<StoreListResult> {
  const { data } = await httpClient.get<ListSuccess>('/stores/', {
    params: {
      page: query.page,
      page_size: query.pageSize,
      search: query.search,
      status: query.status,
      company_id: query.companyId,
    },
  });
  return {
    items: data.data.items.map(map),
    page: data.data.page,
    pageSize: data.data.page_size,
    total: data.data.total,
  };
}
export async function fetchStore(id: number): Promise<Store> {
  const { data } = await httpClient.get<Success>(`/stores/${id}/`);
  return map(data.data);
}
export async function createStore(value: StoreWriteInput): Promise<Store> {
  const { data } = await httpClient.post<Success>('/stores/', toWire(value));
  return map(data.data);
}
export async function updateStore(id: number, value: Partial<StoreWriteInput>): Promise<Store> {
  const body: WireUpdate = {
    name: value.name,
    address: value.address,
    phone: value.phone,
    business_hours: value.businessHours,
    status: value.status,
  };
  const { data } = await httpClient.patch<Success>(`/stores/${id}/`, body);
  return map(data.data);
}
export function setStoreActive(id: number, active: boolean): Promise<Store> {
  return updateStore(id, { status: active ? 'active' : 'inactive' });
}
