import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type {
  Store,
  StoreListQuery,
  StoreListResult,
  StoreWriteInput,
} from '@/features/stores/model';
import type { ApiEnvelope, ApiPage } from './organization.types';
type Wire = components['schemas']['Store'];
const map = (v: Wire): Store => ({
  id: v.id,
  companyId: v.company_id,
  name: v.name,
  address: v.address,
  status: v.status,
  createdAt: v.created_at,
  updatedAt: v.updated_at,
});
export async function fetchStores(q: StoreListQuery = {}): Promise<StoreListResult> {
  const { data } = await httpClient.get<ApiEnvelope<ApiPage<Wire>>>('/stores/', {
    params: {
      page: q.page,
      page_size: q.pageSize,
      search: q.search,
      status: q.status,
      company_id: q.companyId,
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
  const { data } = await httpClient.get<ApiEnvelope<Wire>>(`/stores/${id}/`);
  return map(data.data);
}
export async function createStore(v: StoreWriteInput): Promise<Store> {
  const { data } = await httpClient.post<ApiEnvelope<Wire>>('/stores/', {
    company_id: v.companyId,
    name: v.name,
    address: v.address,
  });
  return map(data.data);
}
export async function updateStore(
  id: number,
  v: Partial<Omit<StoreWriteInput, 'companyId'>>,
): Promise<Store> {
  const { data } = await httpClient.patch<ApiEnvelope<Wire>>(`/stores/${id}/`, v);
  return map(data.data);
}
export async function setStoreActive(id: number, active: boolean): Promise<Store> {
  const action = active ? 'activate' : 'deactivate';
  const { data } = await httpClient.post<ApiEnvelope<Wire>>(`/stores/${id}/${action}/`, {});
  return map(data.data);
}
