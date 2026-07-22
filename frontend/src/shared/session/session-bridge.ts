import { readonly, ref } from 'vue';

export interface SessionSummary {
  name: string;
  role: string;
}

type LogoutHandler = () => void | Promise<void>;

const summary = ref<SessionSummary | null>(null);
let logoutHandler: LogoutHandler | null = null;

export const sessionSummary = readonly(summary);

export function publishSession(value: SessionSummary | null): void {
  summary.value = value;
}

export function configureSessionLogout(handler: LogoutHandler): void {
  logoutHandler = handler;
}

export async function logoutSession(): Promise<void> {
  await logoutHandler?.();
}
