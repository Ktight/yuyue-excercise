import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

describe('App.vue', () => {
  it('renders router-view based on route', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          component: { template: '<div class="test-home">Home Page</div>' },
        },
      ],
    });

    const wrapper = mount(App, {
      global: { plugins: [router] },
    });

    await router.isReady();
    expect(wrapper.html()).toContain('Home Page');
  });
});
