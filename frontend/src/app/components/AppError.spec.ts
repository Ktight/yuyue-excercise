import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppError from './AppError.vue';

describe('AppError', () => {
  it('renders default message', () => {
    const wrapper = mount(AppError);
    expect(wrapper.text()).toContain('加载失败');
  });

  it('renders custom message', () => {
    const wrapper = mount(AppError, { props: { message: '网络连接失败' } });
    expect(wrapper.text()).toContain('网络连接失败');
  });

  it('does not show retry button by default', () => {
    const wrapper = mount(AppError);
    expect(wrapper.find('button').exists()).toBe(false);
  });

  it('shows retry button when showRetry is true', () => {
    const wrapper = mount(AppError, { props: { showRetry: true } });
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('emits retry event on button click', async () => {
    const wrapper = mount(AppError, { props: { showRetry: true } });
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('retry')).toBeTruthy();
  });

  it('has role="alert"', () => {
    const wrapper = mount(AppError);
    expect(wrapper.attributes('role')).toBe('alert');
  });
});
