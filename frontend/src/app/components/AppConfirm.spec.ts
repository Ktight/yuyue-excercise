import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import AppConfirm from './AppConfirm.vue';

describe('AppConfirm', () => {
  afterEach(() => {
    // Clean up teleported content from document.body
    document.body.innerHTML = '';
  });

  it('does not render when visible is false', () => {
    mount(AppConfirm, { props: { visible: false } });
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders when visible is true', () => {
    mount(AppConfirm, { props: { visible: true, title: '确认删除' } });
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog?.textContent).toContain('确认删除');
  });

  it('emits confirm on confirm button click', () => {
    const wrapper = mount(AppConfirm, { props: { visible: true } });
    const buttons = document.querySelectorAll('button');
    const confirmBtn = buttons[buttons.length - 1] as HTMLButtonElement | undefined;
    confirmBtn?.click();
    expect(wrapper.emitted('confirm')).toBeTruthy();
  });

  it('emits cancel on cancel button click', () => {
    const wrapper = mount(AppConfirm, { props: { visible: true } });
    const cancelBtn = document.querySelector('button') as HTMLButtonElement | undefined;
    cancelBtn?.click();
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });

  it('applies danger class when danger is true', () => {
    mount(AppConfirm, { props: { visible: true, danger: true } });
    const buttons = document.querySelectorAll('button');
    const confirmBtn = buttons[buttons.length - 1] as HTMLButtonElement | undefined;
    expect(confirmBtn?.className).toContain('app-confirm__btn--danger');
  });
});
