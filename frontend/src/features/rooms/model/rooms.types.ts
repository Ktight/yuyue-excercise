export type ResourceStatus = 'active' | 'inactive';
export interface Room {
  id: number;
  storeId: number;
  name: string;
  capacity: number;
  facilities: string[];
  status: ResourceStatus;
}
export interface RoomWriteInput {
  storeId: number;
  name: string;
  capacity: number;
  facilities: string[];
  status?: ResourceStatus;
}
export interface RoomListQuery {
  page?: number;
  pageSize?: number;
  storeId?: number;
}
export interface RoomListResult {
  items: Room[];
  page: number;
  pageSize: number;
  total: number;
}
