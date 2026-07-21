import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AdminLayout from './AdminLayout.vue';

describe('AdminLayout', () => {
  const global = {
    stubs: {
      RouterLink: { template: '<a><slot /></a>' },
      RouterView: { template: '<div data-test="router-view" />' },
    },
  };

  it('renders brand name', () => {
    const wrapper = mount(AdminLayout, { global });
    expect(wrapper.text()).toContain('瑜悦练 · 管理');
  });

  it('renders navigation items', () => {
    const wrapper = mount(AdminLayout, { global });
    expect(wrapper.text()).toContain('用户管理');
    expect(wrapper.text()).toContain('数据看板');
  });

  it('renders nested route outlet', () => {
    const wrapper = mount(AdminLayout, { global });
    expect(wrapper.find('[data-test="router-view"]').exists()).toBe(true);
  });

  it('renders header-extra slot', () => {
    const wrapper = mount(AdminLayout, {
      global,
      slots: { 'header-extra': '<span>用户头像</span>' },
    });
    expect(wrapper.html()).toContain('<span>用户头像</span>');
  });
});
