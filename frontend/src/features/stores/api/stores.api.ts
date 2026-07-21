import { httpClient } from '@/shared/api';
import type { StoreDto, StoreListRequestDto, StoreCreateRequestDto } from '@/features/stores/model';
interface PaginatedData<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}
export async function fetchStores(params: StoreListRequestDto = {}) {
  const r = await httpClient.get<{ code: string; data: PaginatedData<StoreDto> }>('/stores', {
    params,
  });
  return r.data;
}
export async function fetchStore(id: string) {
  const r = await httpClient.get<{ code: string; data: StoreDto }>(`/stores/${id}`);
  return r.data;
}
export async function createStore(dto: StoreCreateRequestDto) {
  const r = await httpClient.post<{ code: string; data: StoreDto }>('/stores', dto);
  return r.data;
}
export async function updateStore(id: string, dto: Partial<StoreCreateRequestDto>) {
  const r = await httpClient.put<{ code: string; data: StoreDto }>(`/stores/${id}`, dto);
  return r.data;
}
