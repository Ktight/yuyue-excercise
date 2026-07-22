import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CompanySelect from './CompanySelect.vue';
describe('CompanySelect', () => {
  it('emits numeric company ids', async () => {
    const wrapper = mount(CompanySelect, {
      props: {
        modelValue: null,
        companies: [
          {
            id: 1,
            name: '公司',
            address: '',
            contactName: '',
            contactPhone: '',
            status: 'active',
            createdAt: '',
            updatedAt: '',
          },
        ],
      },
    });
    await wrapper.get('select').setValue('1');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1]);
  });
});
