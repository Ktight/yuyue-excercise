export type ResourceStatus = 'active' | 'inactive';

export interface Company {
  id: number;
  name: string;
  address: string;
  contactName: string;
  contactPhone: string;
  status: ResourceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyWriteInput {
  name: string;
  address: string;
  contactName: string;
  contactPhone: string;
}

export interface CompanyListQuery {
  page?: number;
  page_size?: number;
  search?: string;
  status?: ResourceStatus;
}

export interface CompanyListResult {
  items: Company[];
  page: number;
  pageSize: number;
  total: number;
}
