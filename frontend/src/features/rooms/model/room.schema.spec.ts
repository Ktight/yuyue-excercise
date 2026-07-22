import { describe, expect, it } from 'vitest';
import { validateRoom } from './room.schema';
describe('validateRoom', () => {
  it('rejects invalid capacity', () => {
    expect(validateRoom({ storeId: 1, name: '场地', capacity: 0, description: null })).toContain(
      '容量必须是大于 0 的整数',
    );
  });
});
