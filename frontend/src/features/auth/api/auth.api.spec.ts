import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { authHandlers } from '@/features/auth/mocks/auth.handlers';
import { MOCK_REFRESH_TOKEN } from '@/features/auth/mocks/auth.fixtures';
import { tokenManager } from '@/shared/api';
import { changePassword, getProfile, login, refreshToken } from './auth.api';

describe('auth backend adapter', () => {
  beforeEach(() => {
    server.use(...authHandlers);
    tokenManager.clear();
  });
  it('maps login wire data to frontend session data', async () => {
    const result = await login({ phone: '13800000002', password: '12345678' });
    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBe(MOCK_REFRESH_TOKEN);
    expect(result.user.companyId).toBe(1);
  });
  it('refreshes with a body token and maps the rotated pair', async () => {
    const result = await refreshToken({ refresh_token: MOCK_REFRESH_TOKEN });
    expect(result.refreshToken).toBe('mock-rotated-refresh-token');
  });
  it('maps current user data', async () => {
    tokenManager.set('access');
    expect((await getProfile()).name).toBe('张教练');
  });
  it('uses the password-change contract', async () => {
    tokenManager.set('access');
    await expect(
      changePassword({ old_password: '12345678', new_password: 'newpass123' }),
    ).resolves.toBeUndefined();
  });
});
