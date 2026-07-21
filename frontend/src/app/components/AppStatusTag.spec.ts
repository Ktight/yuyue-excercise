import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppStatusTag from './AppStatusTag.vue';

describe('AppStatusTag', () => {
  it('renders label', () => {
    const wrapper = mount(AppStatusTag, { props: { label: '已签到' } });
    expect(wrapper.text()).toBe('已签到');
  });

  it('default type is "default"', () => {
    const wrapper = mount(AppStatusTag, { props: { label: '测试' } });
    expect(wrapper.classes()).toContain('app-status-tag--default');
  });

  it('applies success type class', () => {
    const wrapper = mount(AppStatusTag, { props: { label: '成功', type: 'success' } });
    expect(wrapper.classes()).toContain('app-status-tag--success');
  });

  it('applies error type class', () => {
    const wrapper = mount(AppStatusTag, { props: { label: '失败', type: 'error' } });
    expect(wrapper.classes()).toContain('app-status-tag--error');
  });
});
