import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { usersHandlers } from '@/features/users/mocks/users.handlers';
import { createUser, fetchUser, fetchUsers, resetUserPassword, updateUser } from './users.api';

describe('users backend adapter', () => {
  beforeEach(() => server.use(...usersHandlers));
  it('maps list pagination and users', async () => {
    const result = await fetchUsers({ role: 'trainer' });
    expect(result.items.every((user) => user.role === 'trainer')).toBe(true);
    expect(result.pageSize).toBe(20);
  });
  it('maps create input and response', async () => {
    const result = await createUser({
      name: '新用户',
      phone: '13900000001',
      password: '12345678',
      role: 'trainer',
    });
    expect(result.id).toBe(6);
    expect(result.companyId).toBe(1);
  });
  it('retrieves, updates and resets a managed user', async () => {
    const current = await fetchUser(2);
    expect(current.role).toBe('trainer');
    const updated = await updateUser(2, { name: '更新教练', isActive: false });
    expect(updated.name).toBe('更新教练');
    expect(updated.isActive).toBe(false);
    await expect(resetUserPassword(2, { newPassword: '87654321' })).resolves.toBeUndefined();
  });
});
