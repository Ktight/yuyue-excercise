import { readonly, reactive } from 'vue';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  danger?: boolean;
}

const state = reactive({
  visible: false,
  options: null as ConfirmOptions | null,
});

let settle: ((confirmed: boolean) => void) | null = null;

export const confirmState = readonly(state);

export function confirmAction(options: ConfirmOptions): Promise<boolean> {
  if (settle) settle(false);
  state.options = options;
  state.visible = true;
  return new Promise<boolean>((resolve) => {
    settle = resolve;
  });
}

export function settleConfirmation(confirmed: boolean): void {
  const resolve = settle;
  settle = null;
  state.visible = false;
  state.options = null;
  resolve?.(confirmed);
}
