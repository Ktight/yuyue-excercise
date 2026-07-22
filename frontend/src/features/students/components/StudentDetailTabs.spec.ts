import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import StudentDetailTabs from './StudentDetailTabs.vue';
describe('StudentDetailTabs', () => {
  it('marks the active tab and emits a tab change', async () => {
    const wrapper = mount(StudentDetailTabs, { props: { modelValue: 'info' } });
    expect(wrapper.get('.active').text()).toBe('档案信息');
    await wrapper.get('button:nth-child(2)').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([['membership']]);
  });
});
