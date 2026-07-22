export type ResourceStatus = 'active' | 'inactive';
export interface Store {
  id: number;
  companyId: number;
  name: string;
  address: string;
  status: ResourceStatus;
  createdAt: string;
  updatedAt: string;
}
export interface StoreWriteInput {
  companyId: number;
  name: string;
  address: string;
}
export interface StoreListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ResourceStatus;
  companyId?: number;
}
export interface StoreListResult {
  items: Store[];
  page: number;
  pageSize: number;
  total: number;
}
