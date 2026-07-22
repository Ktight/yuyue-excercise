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
  if (!value.contactPerson.trim()) errors.push({ field: 'contactPerson', message: '请输入联系人' });
  if (!value.contactPhone.trim()) errors.push({ field: 'contactPhone', message: '请输入联系电话' });
  if (!value.contractStart) errors.push({ field: 'contractStart', message: '请选择合同开始日期' });
  if (!value.contractEnd) errors.push({ field: 'contractEnd', message: '请选择合同结束日期' });
  if (value.contractStart && value.contractEnd && value.contractEnd < value.contractStart)
    errors.push({ field: 'contractEnd', message: '合同结束日期不能早于开始日期' });
  return errors;
}
