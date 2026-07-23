import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import AppImageUploader from './AppImageUploader.vue';

describe('AppImageUploader', () => {
  it('does not invent an upload result when no upload service is configured', async () => {
    const wrapper = mount(AppImageUploader, { props: { modelValue: [] } });
    const input = wrapper.get('input');
    Object.defineProperty(input.element, 'files', {
      value: [new File(['image'], 'pose.png', { type: 'image/png' })],
    });
    await input.trigger('change');
    expect(wrapper.text()).toContain('图片上传服务尚未配置');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('emits only uploaded resource URLs', async () => {
    const upload = vi.fn().mockResolvedValue('https://cdn.example.com/pose.png');
    const wrapper = mount(AppImageUploader, { props: { modelValue: [], upload } });
    const input = wrapper.get('input');
    Object.defineProperty(input.element, 'files', {
      value: [new File(['image'], 'pose.png', { type: 'image/png' })],
    });
    await input.trigger('change');
    await vi.waitFor(() =>
      expect(wrapper.emitted('update:modelValue')).toEqual([
        [['https://cdn.example.com/pose.png']],
      ]),
    );
  });
});
