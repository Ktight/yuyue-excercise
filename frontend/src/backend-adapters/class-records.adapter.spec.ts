import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { classRecordsHandlers } from '@/features/class-records';
import {
  completeClassRecord,
  createClassRecord,
  fetchClassRecords,
  updateClassRecord,
} from './class-records.adapter';
const poseSequence = {
  warmup: [{ name: '猫牛式', duration: 5, notes: '', variations: '', assists: '' }],
  main: [],
  cooldown: [],
};
describe('class records adapter', () => {
  beforeEach(() => server.use(...classRecordsHandlers));
  it('maps list and nested record data', async () => {
    const r = await fetchClassRecords();
    expect(r.items[0]).toMatchObject({
      studentName: '演示学员',
      status: 'draft',
      completionRating: 4,
    });
  });
  it('creates, edits and completes a record', async () => {
    const x = await createClassRecord({
      attendanceId: 1,
      planId: null,
      theme: '测试课堂',
      poseSequence,
      trainerNotes: '',
      homework: '',
      completionRating: null,
      improvementTags: [],
      nextFocus: '',
    });
    expect((await updateClassRecord(x.id, { theme: '更新课堂' })).theme).toBe('更新课堂');
    expect((await completeClassRecord(x.id)).status).toBe('completed');
  });
});
