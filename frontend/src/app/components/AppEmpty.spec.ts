import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppEmpty from './AppEmpty.vue';

describe('AppEmpty', () => {
  it('renders default description', () => {
    const wrapper = mount(AppEmpty);
    expect(wrapper.text()).toContain('暂无数据');
  });

  it('renders custom description', () => {
    const wrapper = mount(AppEmpty, { props: { description: '还没有学员' } });
    expect(wrapper.text()).toContain('还没有学员');
  });

  it('renders slot content', () => {
    const wrapper = mount(AppEmpty, {
      slots: { default: '<button>新建</button>' },
    });
    expect(wrapper.html()).toContain('<button>新建</button>');
  });
});
