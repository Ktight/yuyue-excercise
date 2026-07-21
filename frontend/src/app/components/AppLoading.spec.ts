import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppLoading from './AppLoading.vue';

describe('AppLoading', () => {
  it('renders default text', () => {
    const wrapper = mount(AppLoading);
    expect(wrapper.text()).toContain('加载中...');
  });

  it('renders custom text', () => {
    const wrapper = mount(AppLoading, { props: { text: '正在获取数据...' } });
    expect(wrapper.text()).toContain('正在获取数据...');
  });

  it('has role="status"', () => {
    const wrapper = mount(AppLoading);
    expect(wrapper.attributes('role')).toBe('status');
  });
});
