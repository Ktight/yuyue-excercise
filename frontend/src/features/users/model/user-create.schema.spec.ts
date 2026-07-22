import { describe, expect, it } from 'vitest';
import { validateUserCreateForm, type UserCreateFormData } from './user-create.schema';
const valid: UserCreateFormData = {
  name: '店长',
  phone: '13800000008',
  password: 'password8',
  role: 'store_manager',
  storeId: 1,
};
describe('validateUserCreateForm', () => {
  it('requires a store for store managers', () => {
    expect(validateUserCreateForm({ ...valid, storeId: null })).toContainEqual({
      field: 'storeId',
      message: '店长必须选择所属门店',
    });
  });
  it('allows trainers without a store', () => {
    expect(validateUserCreateForm({ ...valid, role: 'trainer', storeId: null })).toEqual([]);
  });
});
