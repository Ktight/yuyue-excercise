export type ResourceStatus = 'active' | 'inactive';
export interface Company {
  id: number;
  name: string;
  contactPerson: string;
  contactPhone: string;
  contractStart: string;
  contractEnd: string;
  status: ResourceStatus;
  createdAt: string;
}
export interface CompanyWriteInput {
  name: string;
  contactPerson: string;
  contactPhone: string;
  contractStart: string;
  contractEnd: string;
  status?: ResourceStatus;
}
export interface CompanyListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ResourceStatus;
}
export interface CompanyListResult {
  items: Company[];
  page: number;
  pageSize: number;
  total: number;
}
