import { computed, onMounted, onUnmounted, ref, toValue } from 'vue';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { confirmAction } from '../components/confirm.service';

export interface UnsavedChangesGuardOptions {
  source: () => unknown;
  enabled?: MaybeRefOrGetter<boolean>;
  title?: string;
  message?: string;
}

export interface UnsavedChangesGuard {
  dirty: ComputedRef<boolean>;
  markSaved: () => void;
  runGuardedSubmit: <Result>(action: () => Promise<Result>) => Promise<Result>;
}

function snapshot(source: () => unknown): string {
  return JSON.stringify(source()) ?? 'undefined';
}

export function useUnsavedChangesGuard(options: UnsavedChangesGuardOptions): UnsavedChangesGuard {
  const savedSnapshot = ref(snapshot(options.source));
  const bypass = ref(false);
  const enabled = computed(() => (options.enabled === undefined ? true : toValue(options.enabled)));
  const dirty = computed(
    () => enabled.value && !bypass.value && snapshot(options.source) !== savedSnapshot.value,
  );

  function markSaved(): void {
    savedSnapshot.value = snapshot(options.source);
  }

  async function runGuardedSubmit<Result>(action: () => Promise<Result>): Promise<Result> {
    bypass.value = true;
    try {
      const result = await action();
      markSaved();
      return result;
    } finally {
      bypass.value = false;
    }
  }

  onBeforeRouteLeave(async () => {
    if (!dirty.value) return true;
    return confirmAction({
      title: options.title ?? '离开当前页面？',
      message: options.message ?? '当前填写内容尚未保存，离开后这些修改将丢失。',
      confirmText: '放弃修改',
      danger: true,
    });
  });

  const handleBeforeUnload = (event: unknown) => {
    if (!dirty.value) return;
    const beforeUnloadEvent = event as {
      preventDefault: () => void;
      returnValue: string;
    };
    beforeUnloadEvent.preventDefault();
    beforeUnloadEvent.returnValue = '';
  };

  onMounted(() => globalThis.addEventListener('beforeunload', handleBeforeUnload));
  onUnmounted(() => globalThis.removeEventListener('beforeunload', handleBeforeUnload));

  return { dirty, markSaved, runGuardedSubmit };
}
