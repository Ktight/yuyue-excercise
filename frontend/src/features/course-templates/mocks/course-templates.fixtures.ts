import type { components } from '@/generated/api-types';

export type MockCourseTemplate = components['schemas']['CourseTemplate'];

export const MOCK_TEMPLATES: MockCourseTemplate[] = [
  {
    id: 1,
    company: 1,
    name: '肩颈理疗私教',
    category: 'private',
    duration_minutes: 60,
    max_capacity: 1,
    difficulty: 'beginner',
    description: '肩颈放松与体态改善',
    cover_image: 'https://example.com/covers/neck-care.jpg',
    status: 'active',
    created_at: '2026-07-21T11:00:00+08:00',
    updated_at: '2026-07-21T11:00:00+08:00',
  },
  {
    id: 2,
    company: 1,
    name: '流瑜伽进阶小班',
    category: 'small_group',
    duration_minutes: 75,
    max_capacity: 8,
    difficulty: 'intermediate',
    description: '动态体式串联与呼吸训练',
    cover_image: '',
    status: 'active',
    created_at: '2026-07-21T12:00:00+08:00',
    updated_at: '2026-07-21T12:00:00+08:00',
  },
  {
    id: 3,
    company: 1,
    name: '瑜伽基础团课',
    category: 'group',
    duration_minutes: 60,
    max_capacity: 20,
    difficulty: 'beginner',
    description: '适合初学者的基础课程',
    cover_image: '',
    status: 'inactive',
    created_at: '2026-07-21T13:00:00+08:00',
    updated_at: '2026-07-21T13:00:00+08:00',
  },
];
