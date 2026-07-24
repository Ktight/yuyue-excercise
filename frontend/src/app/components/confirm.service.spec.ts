import { describe, expect, it } from 'vitest';
import { confirmAction, confirmState, settleConfirmation } from './confirm.service';

describe('confirm service', () => {
  it('resolves the pending confirmation', async () => {
    const pending = confirmAction({ title: '删除', message: '确认删除？', danger: true });
    expect(confirmState.visible).toBe(true);
    settleConfirmation(true);
    await expect(pending).resolves.toBe(true);
    expect(confirmState.visible).toBe(false);
  });

  it('cancels an earlier request when another confirmation opens', async () => {
    const first = confirmAction({ title: '第一个', message: '第一项' });
    const second = confirmAction({ title: '第二个', message: '第二项' });
    await expect(first).resolves.toBe(false);
    settleConfirmation(false);
    await expect(second).resolves.toBe(false);
  });
});
