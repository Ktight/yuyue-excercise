/** 公司模块类型（契约未冻结，字段待确认） */

export interface CompanyDto {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  logo?: string;
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface CompanyListRequestDto {
  page?: number;
  page_size?: number;
  search?: string;
}

export interface CompanyCreateRequestDto {
  name: string;
  address?: string;
  phone?: string;
}
