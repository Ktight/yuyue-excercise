import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { usersHandlers } from '@/features/users/mocks/users.handlers';
import { createUser, fetchUsers } from './users.api';

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
});
