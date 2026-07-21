import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UserFilters from './UserFilters.vue';

describe('UserFilters', () => {
  it('emits normalized search and role filters', async () => {
    const wrapper = mount(UserFilters);
    await wrapper.get('input').setValue(' 张 ');
    await wrapper.get('select').setValue('trainer');
    await wrapper.get('form').trigger('submit');
    expect(wrapper.emitted('apply')?.[0]).toEqual([{ search: '张', role: 'trainer' }]);
  });

  it('omits empty filter values', async () => {
    const wrapper = mount(UserFilters);
    await wrapper.get('form').trigger('submit');
    expect(wrapper.emitted('apply')?.[0]).toEqual([{ search: undefined, role: undefined }]);
  });
});
