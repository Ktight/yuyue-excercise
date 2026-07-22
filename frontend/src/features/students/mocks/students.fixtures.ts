import type { components } from '@/generated/api-types';

export type MockStudent = components['schemas']['Student'];

export const MOCK_STUDENTS: MockStudent[] = [
  {
    id: 1,
    user: { id: 5, name: '示例学员', phone: '13910000004', avatar: null, is_active: true },
    company: 1,
    home_store: 1,
    primary_trainer: 4,
    gender: 'female',
    birth_date: '1994-05-20',
    emergency_contact: '家属 13800000000',
    member_card_type: 'count',
    member_card_start: '2026-01-01',
    member_card_expire: '2026-12-31',
    member_card_balance: 20,
    member_card_active: true,
    member_card_status: { status: 'active', is_valid: true, reason: '' },
    health_notes: '无特殊情况',
    injury_history: '',
    contraindications: '',
    training_goal: '改善体态',
    preferred_style: '流瑜伽',
    recent_assessment: null,
    status: 'active',
    created_at: '2026-01-01T00:00:00+08:00',
    updated_at: '2026-01-01T00:00:00+08:00',
  },
];
