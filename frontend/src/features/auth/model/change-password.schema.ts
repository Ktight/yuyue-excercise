export interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function validateChangePassword(data: ChangePasswordFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.oldPassword) errors.oldPassword = '请输入当前密码';
  if (data.newPassword.length < 8) errors.newPassword = '新密码至少 8 位';
  if (data.confirmPassword !== data.newPassword) errors.confirmPassword = '两次输入的新密码不一致';
  return errors;
}
