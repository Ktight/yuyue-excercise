type RecoveryHandler = () => Promise<void>;

let handler: RecoveryHandler | null = null;
let activeRecovery: Promise<void> | null = null;

export function configureSessionRecovery(nextHandler: RecoveryHandler | null): void {
  handler = nextHandler;
}

export function canRecoverSession(): boolean {
  return handler !== null;
}

/** All concurrent unauthorized requests share the same recovery attempt. */
export async function recoverSession(): Promise<void> {
  if (!handler) throw new Error('Session recovery is not configured');
  if (!activeRecovery) {
    activeRecovery = handler().finally(() => {
      activeRecovery = null;
    });
  }
  return activeRecovery;
}
