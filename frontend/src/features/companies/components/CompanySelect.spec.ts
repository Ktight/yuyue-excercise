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
            contactPerson: '联系人',
            contactPhone: '13800000000',
            contractStart: '2026-01-01',
            contractEnd: '2027-01-01',
            status: 'active',
            createdAt: '',
          },
        ],
      },
    });
    await wrapper.get('select').setValue('1');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1]);
  });
});
