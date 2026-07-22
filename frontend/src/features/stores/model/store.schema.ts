import type { StoreWriteInput } from './stores.types';
export function validateStore(value: StoreWriteInput): string[] {
  const errors: string[] = [];
  if (!value.name.trim()) errors.push('请输入门店名称');
  if (!value.address.trim()) errors.push('请输入门店地址');
  if (!value.phone.trim()) errors.push('请输入联系电话');
  if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(value.businessHours.trim()))
    errors.push('营业时间格式应为 07:00-22:00');
  return errors;
}
