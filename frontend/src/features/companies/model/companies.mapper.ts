/** DTO → 内部模型映射 */
import type { CompanyDto } from './companies.types';

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  logo?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export function mapCompany(dto: CompanyDto): Company {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address || '',
    phone: dto.phone || '',
    logo: dto.logo,
    status: dto.status,
    createdAt: dto.created_at || '',
  };
}
