import { describe, expect, it } from 'vitest';
import { validateChangePassword } from './change-password.schema';

describe('validateChangePassword', () => {
  it('accepts a valid password change', () => {
    expect(
      validateChangePassword({
        oldPassword: 'old-password',
        newPassword: 'new-password',
        confirmPassword: 'new-password',
      }),
    ).toEqual({});
  });

  it('reports missing, short and mismatched values', () => {
    const errors = validateChangePassword({
      oldPassword: '',
      newPassword: 'short',
      confirmPassword: 'different',
    });
    expect(errors).toHaveProperty('oldPassword');
    expect(errors).toHaveProperty('newPassword');
    expect(errors).toHaveProperty('confirmPassword');
  });
});
