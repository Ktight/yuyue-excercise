import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import StoreSelect from './StoreSelect.vue';
describe('StoreSelect', () => {
  it('emits numeric id and disables inactive stores', async () => {
    const base = {
      companyId: 1,
      address: '',
      phone: '',
      businessHours: '07:00-22:00',
      createdAt: '',
    };
    const wrapper = mount(StoreSelect, {
      props: {
        modelValue: null,
        stores: [
          { ...base, id: 2, name: '门店', status: 'active' },
          { ...base, id: 3, name: '停用门店', status: 'inactive' },
        ],
      },
    });
    await wrapper.get('select').setValue('2');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2]);
    expect(wrapper.findAll('option')[2]?.attributes('disabled')).toBeDefined();
  });
});
