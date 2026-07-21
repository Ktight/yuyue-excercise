import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppPage from './AppPage.vue';

describe('AppPage', () => {
  it('renders title', () => {
    const wrapper = mount(AppPage, { props: { title: '学员管理' } });
    expect(wrapper.text()).toContain('学员管理');
  });

  it('does not render header when no title or extra', () => {
    const wrapper = mount(AppPage);
    expect(wrapper.find('header').exists()).toBe(false);
  });

  it('renders header-extra slot', () => {
    const wrapper = mount(AppPage, {
      props: { title: '页面' },
      slots: { 'header-extra': '<button>新建</button>' },
    });
    expect(wrapper.html()).toContain('<button>新建</button>');
  });

  it('renders default slot content', () => {
    const wrapper = mount(AppPage, {
      slots: { default: '<p>正文内容</p>' },
    });
    expect(wrapper.html()).toContain('<p>正文内容</p>');
  });
});
