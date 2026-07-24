import { defineComponent, h, reactive } from 'vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUnsavedChangesGuard } from './use-unsaved-changes-guard';

const mocks = vi.hoisted(() => ({
  leaveGuard: undefined as undefined | (() => boolean | Promise<boolean>),
  confirm: vi.fn(),
}));

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: (guard: () => boolean | Promise<boolean>) => {
    mocks.leaveGuard = guard;
  },
}));

vi.mock('../components/confirm.service', () => ({
  confirmAction: mocks.confirm,
}));

let form: { name: string };
let protection: ReturnType<typeof useUnsavedChangesGuard>;

const TestHarness = defineComponent({
  setup() {
    form = reactive({ name: '' });
    protection = useUnsavedChangesGuard({ source: () => form });
    return () => h('div');
  },
});

describe('useUnsavedChangesGuard', () => {
  beforeEach(() => {
    mocks.leaveGuard = undefined;
    mocks.confirm.mockReset();
  });

  it('allows clean navigation and confirms dirty navigation', async () => {
    const wrapper = mount(TestHarness);

    expect(await mocks.leaveGuard?.()).toBe(true);
    form.name = '瑜悦练';
    mocks.confirm.mockResolvedValueOnce(false);
    expect(await mocks.leaveGuard?.()).toBe(false);
    expect(mocks.confirm).toHaveBeenCalledWith(
      expect.objectContaining({ confirmText: '放弃修改', danger: true }),
    );

    wrapper.unmount();
  });

  it('bypasses navigation during a successful save and resets the baseline', async () => {
    const wrapper = mount(TestHarness);
    form.name = '新名称';

    await protection.runGuardedSubmit(async () => {
      expect(await mocks.leaveGuard?.()).toBe(true);
    });

    expect(protection.dirty.value).toBe(false);
    expect(mocks.confirm).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('keeps failed submissions dirty', async () => {
    const wrapper = mount(TestHarness);
    form.name = '未保存';

    await expect(
      protection.runGuardedSubmit(async () => {
        throw new Error('save failed');
      }),
    ).rejects.toThrow('save failed');
    expect(protection.dirty.value).toBe(true);
    wrapper.unmount();
  });
});
