export interface StoreDto {
  id: string;
  name: string;
  company_id: string;
  address?: string;
  phone?: string;
  status: 'active' | 'inactive';
  created_at?: string;
}
export interface StoreListRequestDto {
  page?: number;
  page_size?: number;
  company_id?: string;
  search?: string;
}
export interface StoreCreateRequestDto {
  name: string;
  company_id: string;
  address?: string;
  phone?: string;
}
