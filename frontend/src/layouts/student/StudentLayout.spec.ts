import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import StudentLayout from './StudentLayout.vue';

describe('StudentLayout', () => {
  const global = {
    stubs: {
      RouterLink: { template: '<a><slot /></a>' },
      RouterView: { template: '<div data-test="router-view" />' },
      AccountActions: { template: '<div data-test="account-actions" />' },
    },
  };

  it('renders brand name', () => {
    const wrapper = mount(StudentLayout, { global });
    expect(wrapper.text()).toContain('瑜悦练');
  });

  it('renders navigation tabs', () => {
    const wrapper = mount(StudentLayout, { global });
    expect(wrapper.text()).toContain('我的课程');
    expect(wrapper.text()).toContain('我的档案');
  });

  it('renders nested route outlet', () => {
    const wrapper = mount(StudentLayout, { global });
    expect(wrapper.find('[data-test="router-view"]').exists()).toBe(true);
  });

  it('renders header-extra slot', () => {
    const wrapper = mount(StudentLayout, {
      global,
      slots: { 'header-extra': '<span>设置</span>' },
    });
    expect(wrapper.html()).toContain('<span>设置</span>');
  });

  it('has hamburger menu button', () => {
    const wrapper = mount(StudentLayout, { global });
    const btn = wrapper.find('button[aria-label="切换菜单"]');
    expect(btn.exists()).toBe(true);
  });
});
