import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import CourseTemplateForm from './CourseTemplateForm.vue';

describe('CourseTemplateForm', () => {
  it('locks private capacity to one before submitting', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const wrapper = mount(CourseTemplateForm, { props: { onSubmit } });
    const selects = wrapper.findAll('select');
    await selects[0]?.setValue('private');
    await nextTick();
    await wrapper.findAll('input')[0]?.setValue('私教课程');
    await wrapper.get('form').trigger('submit');
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'private', maxCapacity: 1 }),
    );
  });

  it('does not expose submit actions in readonly mode', () => {
    const wrapper = mount(CourseTemplateForm, {
      props: { readonly: true, onSubmit: vi.fn().mockResolvedValue(undefined) },
    });
    expect(wrapper.find('button[type="submit"]').exists()).toBe(false);
  });
});
