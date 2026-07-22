export type ResourceStatus = 'active' | 'inactive';
export interface Store {
  id: number;
  companyId: number;
  name: string;
  address: string;
  phone: string;
  businessHours: string;
  status: ResourceStatus;
  createdAt: string;
}
export interface StoreWriteInput {
  name: string;
  address: string;
  phone: string;
  businessHours: string;
  status?: ResourceStatus;
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
