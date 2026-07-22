import type { RoomWriteInput } from './rooms.types';
export function validateRoom(value: RoomWriteInput): string[] {
  const errors: string[] = [];
  if (!Number.isInteger(value.storeId) || value.storeId < 1) errors.push('请选择门店');
  if (!value.name.trim()) errors.push('请输入场地名称');
  if (!Number.isInteger(value.capacity) || value.capacity < 1)
    errors.push('容量必须是大于 0 的整数');
  return errors;
}
