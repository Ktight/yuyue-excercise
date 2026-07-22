import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UserCreateForm from './UserCreateForm.vue';
const stores = [
  {
    id: 1,
    companyId: 1,
    name: '一店',
    address: '',
    status: 'active' as const,
    createdAt: '',
    updatedAt: '',
  },
];
describe('UserCreateForm store relation', () => {
  it('clears store when role no longer supports it', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const wrapper = mount(UserCreateForm, { props: { stores, onSubmit } });
    const inputs = wrapper.findAll('input');
    const selects = wrapper.findAll('select');
    expect(inputs).toHaveLength(3);
    expect(selects).toHaveLength(2);
    await inputs[0]?.setValue('学员');
    await inputs[1]?.setValue('13800000009');
    await inputs[2]?.setValue('password8');
    const storeSelect = selects.find((item) => item.attributes('aria-label') === '所属门店');
    const roleSelect = selects.find((item) => item.attributes('aria-label') !== '所属门店');
    if (!storeSelect || !roleSelect) throw new Error('角色或门店选择器不存在');
    await storeSelect.setValue('1');
    await roleSelect.setValue('student');
    await wrapper.get('form').trigger('submit');
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'student', storeId: null }),
    );
  });
});
