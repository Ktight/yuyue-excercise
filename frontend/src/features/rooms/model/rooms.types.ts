export interface RoomDto {
  id: string;
  name: string;
  store_id: string;
  capacity?: number;
  status: 'active' | 'inactive';
  created_at?: string;
}
export interface RoomCreateRequestDto {
  name: string;
  store_id: string;
  capacity?: number;
}
