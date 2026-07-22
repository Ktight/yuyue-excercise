import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TrainerLayout from './TrainerLayout.vue';

describe('TrainerLayout', () => {
  const global = {
    stubs: {
      RouterLink: { template: '<a><slot /></a>' },
      RouterView: { template: '<div data-test="router-view" />' },
      AccountActions: { template: '<div data-test="account-actions" />' },
    },
  };

  it('renders brand name', () => {
    const wrapper = mount(TrainerLayout, { global });
    expect(wrapper.text()).toContain('瑜悦练 · 训练师');
  });

  it('renders navigation items', () => {
    const wrapper = mount(TrainerLayout, { global });
    expect(wrapper.text()).toContain('学员管理');
    expect(wrapper.text()).toContain('课时档案');
  });

  it('renders nested route outlet', () => {
    const wrapper = mount(TrainerLayout, { global });
    expect(wrapper.find('[data-test="router-view"]').exists()).toBe(true);
  });

  it('renders header-extra slot', () => {
    const wrapper = mount(TrainerLayout, {
      global,
      slots: { 'header-extra': '<span>通知</span>' },
    });
    expect(wrapper.html()).toContain('<span>通知</span>');
  });

  it('has working title', () => {
    const wrapper = mount(TrainerLayout, { global });
    expect(wrapper.text()).toContain('训练师工作台');
  });
});
