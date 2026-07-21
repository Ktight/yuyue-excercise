import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import LoginForm from './LoginForm.vue';
import { ApiError } from '@/shared/api';

const noopSubmit = async () => {};

describe('LoginForm', () => {
  it('renders phone and password inputs', () => {
    const wrapper = mount(LoginForm, { props: { onSubmit: noopSubmit } });
    expect(wrapper.findAll('input')).toHaveLength(2);
  });

  it('shows error for empty phone', async () => {
    const wrapper = mount(LoginForm, { props: { onSubmit: noopSubmit } });
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text()).toContain('请输入手机号');
  });

  it('shows error for empty password', async () => {
    const wrapper = mount(LoginForm, { props: { onSubmit: noopSubmit } });
    await wrapper.find('input[type="tel"]').setValue('13800000001');
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text()).toContain('请输入密码');
  });

  it('shows error for invalid phone format', async () => {
    const wrapper = mount(LoginForm, { props: { onSubmit: noopSubmit } });
    await wrapper.find('input[type="tel"]').setValue('12345');
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text()).toContain('请输入正确的手机号');
  });

  it('shows error for short password', async () => {
    const wrapper = mount(LoginForm, { props: { onSubmit: noopSubmit } });
    await wrapper.find('input[type="tel"]').setValue('13800000001');
    await wrapper.find('input[type="password"]').setValue('123');
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text()).toContain('密码至少 6 位');
  });

  it('calls onSubmit with valid data', async () => {
    let capturedPhone = '';
    let capturedPwd = '';
    const wrapper = mount(LoginForm, {
      props: {
        onSubmit: async (phone, password) => {
          capturedPhone = phone;
          capturedPwd = password;
        },
      },
    });
    await wrapper.find('input[type="tel"]').setValue('13800000001');
    await wrapper.find('input[type="password"]').setValue('123456');
    await wrapper.find('form').trigger('submit.prevent');

    expect(capturedPhone).toBe('13800000001');
    expect(capturedPwd).toBe('123456');
  });

  it('shows server error when onSubmit throws ApiError', async () => {
    const wrapper = mount(LoginForm, {
      props: {
        onSubmit: async () => {
          throw new ApiError(401, 'AUTH_INVALID', '手机号或密码错误');
        },
      },
    });
    await wrapper.find('input[type="tel"]').setValue('13800000001');
    await wrapper.find('input[type="password"]').setValue('123456');
    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.text()).toContain('手机号或密码错误');
  });
});
