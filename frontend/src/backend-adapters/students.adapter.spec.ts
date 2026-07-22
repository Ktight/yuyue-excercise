import { describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { studentsHandlers } from '@/features/students/mocks/students.handlers';
import {
  fetchEligibility,
  fetchMembership,
  fetchStudent,
  fetchStudents,
  updateStudent,
} from './students.adapter';
describe('students adapter', () => {
  it('maps nested student and pagination into the domain model', async () => {
    server.use(...studentsHandlers);
    const result = await fetchStudents({ search: '示例' });
    expect(result.pageSize).toBe(20);
    expect(result.items[0]).toMatchObject({
      id: 1,
      user: { name: '示例学员' },
      homeStoreId: 1,
      membershipType: 'count',
    });
  });
  it('uses PATCH profile without mixing membership fields', async () => {
    server.use(...studentsHandlers);
    const value = await updateStudent(1, { trainingGoal: '提升核心' });
    expect(value.trainingGoal).toBe('提升核心');
    expect(value.membershipType).toBe('count');
  });
  it('maps membership and eligibility endpoints', async () => {
    server.use(...studentsHandlers);
    expect((await fetchMembership(1)).remainingCount).toBe(20);
    expect((await fetchEligibility(1)).canBook).toBe(true);
    expect((await fetchStudent(1)).membershipStatus.isValid).toBe(true);
  });
});
