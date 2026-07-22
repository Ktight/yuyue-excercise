import { describe, expect, it } from 'vitest';
import { validateCompany } from './company.schema';
describe('validateCompany', () => {
  it('validates required identity and contract fields', () => {
    expect(
      validateCompany({
        name: '',
        contactPerson: '',
        contactPhone: '',
        contractStart: '',
        contractEnd: '',
      }),
    ).toEqual(
      expect.arrayContaining([
        { field: 'name', message: '请输入公司名称' },
        { field: 'contactPerson', message: '请输入联系人' },
      ]),
    );
  });
});
