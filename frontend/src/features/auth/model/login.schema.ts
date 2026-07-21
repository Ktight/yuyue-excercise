/**
 * 登录表单校验规则。
 *
 * 校验逻辑集中于此，组件只调用 validate() 获取结果。
 * 不与任何 UI 框架耦合，可替换校验库。
 */

export interface LoginFormData {
  phone: string;
  password: string;
}

export interface FieldError {
  field: keyof LoginFormData;
  message: string;
}

/** 校验登录表单，返回字段错误列表（空数组 = 通过） */
export function validateLoginForm(data: LoginFormData): FieldError[] {
  const errors: FieldError[] = [];

  // 手机号
  if (!data.phone.trim()) {
    errors.push({ field: 'phone', message: '请输入手机号' });
  } else if (!/^1[3-9]\d{9}$/.test(data.phone.trim())) {
    errors.push({ field: 'phone', message: '请输入正确的手机号' });
  }

  // 密码
  if (!data.password) {
    errors.push({ field: 'password', message: '请输入密码' });
  } else if (data.password.length < 6) {
    errors.push({ field: 'password', message: '密码至少 6 位' });
  }

  return errors;
}
