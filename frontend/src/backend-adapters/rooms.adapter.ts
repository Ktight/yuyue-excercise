import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type { Room, RoomListQuery, RoomListResult, RoomWriteInput } from '@/features/rooms/model';
import type { ApiEnvelope, ApiPage } from './organization.types';
type Wire = components['schemas']['Room'];
const map = (v: Wire): Room => ({
  id: v.id,
  companyId: v.company_id,
  storeId: v.store_id,
  name: v.name,
  capacity: v.capacity,
  description: v.description,
  status: v.status,
});
export async function fetchRooms(q: RoomListQuery = {}): Promise<RoomListResult> {
  const { data } = await httpClient.get<ApiEnvelope<ApiPage<Wire>>>('/rooms/', {
    params: { page: q.page, page_size: q.pageSize, store_id: q.storeId },
  });
  return {
    items: data.data.items.map(map),
    page: data.data.page,
    pageSize: data.data.page_size,
    total: data.data.total,
  };
}
export async function fetchRoom(id: number): Promise<Room> {
  const { data } = await httpClient.get<ApiEnvelope<Wire>>(`/rooms/${id}/`);
  return map(data.data);
}
export async function createRoom(v: RoomWriteInput): Promise<Room> {
  const { data } = await httpClient.post<ApiEnvelope<Wire>>('/rooms/', {
    store_id: v.storeId,
    name: v.name,
    capacity: v.capacity,
    description: v.description,
  });
  return map(data.data);
}
export async function updateRoom(
  id: number,
  v: Partial<Omit<RoomWriteInput, 'storeId'>>,
): Promise<Room> {
  const { data } = await httpClient.patch<ApiEnvelope<Wire>>(`/rooms/${id}/`, v);
  return map(data.data);
}
export async function setRoomActive(id: number, active: boolean): Promise<Room> {
  const action = active ? 'activate' : 'deactivate';
  const { data } = await httpClient.post<ApiEnvelope<Wire>>(`/rooms/${id}/${action}/`, {});
  return map(data.data);
}
