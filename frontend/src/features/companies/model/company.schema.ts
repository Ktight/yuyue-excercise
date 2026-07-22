import type { CompanyWriteInput } from './companies.types';
export type CompanyField = keyof CompanyWriteInput;
export interface CompanyFieldError {
  field: CompanyField;
  message: string;
}
export function validateCompany(value: CompanyWriteInput): CompanyFieldError[] {
  const errors: CompanyFieldError[] = [];
  if (!value.name.trim()) errors.push({ field: 'name', message: '请输入公司名称' });
  if (value.name.trim().length > 100)
    errors.push({ field: 'name', message: '公司名称不能超过 100 个字符' });
  if (value.contactPhone && !/^1[3-9]\d{9}$/.test(value.contactPhone.trim()))
    errors.push({ field: 'contactPhone', message: '请输入正确的联系人手机号' });
  return errors;
}
