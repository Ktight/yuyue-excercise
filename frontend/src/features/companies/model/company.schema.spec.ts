import { describe, expect, it } from 'vitest';
import { validateCompany } from './company.schema';
describe('validateCompany', () => {
  it('validates name and contact phone', () => {
    expect(
      validateCompany({ name: '', address: '', contactName: '', contactPhone: '123' }),
    ).toEqual(
      expect.arrayContaining([
        { field: 'name', message: '请输入公司名称' },
        { field: 'contactPhone', message: '请输入正确的联系人手机号' },
      ]),
    );
  });
});
