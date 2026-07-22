import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import StoreSelect from './StoreSelect.vue';
describe('StoreSelect', () => {
  it('emits a numeric id and disables inactive stores', async () => {
    const wrapper = mount(StoreSelect, {
      props: {
        modelValue: null,
        stores: [
          {
            id: 2,
            companyId: 1,
            name: '门店',
            address: '',
            status: 'active',
            createdAt: '',
            updatedAt: '',
          },
          {
            id: 3,
            companyId: 1,
            name: '停用门店',
            address: '',
            status: 'inactive',
            createdAt: '',
            updatedAt: '',
          },
        ],
      },
    });
    await wrapper.get('select').setValue('2');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2]);
    expect(wrapper.findAll('option')[2]?.attributes('disabled')).toBeDefined();
  });
});
