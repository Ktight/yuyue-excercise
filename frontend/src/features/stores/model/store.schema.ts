import type { StoreWriteInput } from './stores.types';
export function validateStore(value: StoreWriteInput): string[] {
  const errors: string[] = [];
  if (!Number.isInteger(value.companyId) || value.companyId < 1) errors.push('请选择公司');
  if (!value.name.trim()) errors.push('请输入门店名称');
  if (value.name.trim().length > 100) errors.push('门店名称不能超过 100 个字符');
  return errors;
}
