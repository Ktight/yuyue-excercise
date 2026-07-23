import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type { Room, RoomListQuery, RoomListResult, RoomWriteInput } from '@/features/rooms/model';
type Wire = components['schemas']['Room'];
type WireCreate = components['schemas']['RoomCreateRequest'];
type WireUpdate = components['schemas']['RoomUpdateRequest'];
type Success = components['schemas']['RoomSuccessResponse'];
type ListSuccess = components['schemas']['RoomListSuccessResponse'];
const map = (value: Wire): Room => ({
  id: value.id,
  storeId: value.store,
  name: value.name,
  capacity: value.capacity,
  facilities: value.facilities ?? [],
  status: value.status,
});
const toWire = (value: RoomWriteInput): WireCreate => ({
  store: value.storeId,
  name: value.name,
  capacity: value.capacity,
  facilities: value.facilities,
  status: value.status,
});
export async function fetchRooms(query: RoomListQuery = {}): Promise<RoomListResult> {
  const { data } = await httpClient.get<ListSuccess>('/rooms/', {
    params: { page: query.page, page_size: query.pageSize, store_id: query.storeId },
  });
  return {
    items: data.data.items.map(map),
    page: data.data.page,
    pageSize: data.data.page_size,
    total: data.data.total,
  };
}
export async function fetchRoom(id: number): Promise<Room> {
  const { data } = await httpClient.get<Success>(`/rooms/${id}/`);
  return map(data.data);
}
export async function createRoom(value: RoomWriteInput): Promise<Room> {
  const { data } = await httpClient.post<Success>('/rooms/', toWire(value));
  return map(data.data);
}
export async function updateRoom(id: number, value: Partial<RoomWriteInput>): Promise<Room> {
  const body: WireUpdate = {
    store: value.storeId,
    name: value.name,
    capacity: value.capacity,
    facilities: value.facilities,
    status: value.status,
  };
  const { data } = await httpClient.patch<Success>(`/rooms/${id}/`, body);
  return map(data.data);
}
export function setRoomActive(id: number, active: boolean): Promise<Room> {
  return updateRoom(id, { status: active ? 'active' : 'inactive' });
}
export async function deleteRoom(id: number): Promise<void> {
  await httpClient.delete(`/rooms/${id}/`);
}
