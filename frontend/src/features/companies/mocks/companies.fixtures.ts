import type { CompanyDto } from '@/features/companies/model';

export const MOCK_COMPANIES: CompanyDto[] = [
  {
    id: 'c-001',
    name: '静心瑜伽馆',
    address: '北京市朝阳区',
    phone: '010-12345678',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c-002',
    name: '莲花瑜伽中心',
    address: '上海市浦东新区',
    phone: '021-87654321',
    status: 'active',
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'c-003',
    name: '禅瑜伽会所',
    address: '广州市天河区',
    status: 'inactive',
    created_at: '2026-03-01T00:00:00Z',
  },
];
