import { httpClient } from '@/shared/api';
import type { RoomDto, RoomCreateRequestDto } from '@/features/rooms/model';
interface PaginatedData<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}
export async function fetchRooms(params: { store_id?: string } = {}) {
  const r = await httpClient.get<{ code: string; data: PaginatedData<RoomDto> }>('/rooms', {
    params,
  });
  return r.data;
}
export async function createRoom(dto: RoomCreateRequestDto) {
  const r = await httpClient.post<{ code: string; data: RoomDto }>('/rooms', dto);
  return r.data;
}
