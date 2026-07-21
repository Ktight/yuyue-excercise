import type { StoreDto } from './stores.types';
export interface Store {
  id: string;
  name: string;
  companyId: string;
  address: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
}
export function mapStore(dto: StoreDto): Store {
  return {
    id: dto.id,
    name: dto.name,
    companyId: dto.company_id,
    address: dto.address || '',
    phone: dto.phone || '',
    status: dto.status,
    createdAt: dto.created_at || '',
  };
}
