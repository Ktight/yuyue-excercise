import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { classRecordsHandlers } from '@/features/class-records';
import {
  completeClassRecord,
  createClassRecord,
  fetchClassRecords,
  unlinkClassRecordPlan,
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
  it('passes list filters and pagination through the adapter', async () => {
    const matching = await fetchClassRecords({
      page: 1,
      pageSize: 10,
      studentId: 5,
      trainerId: 4,
      dateFrom: '2026-07-01',
      dateTo: '2026-07-31',
    });
    const missing = await fetchClassRecords({ studentId: 999 });
    expect(matching.items).toHaveLength(1);
    expect(matching.pageSize).toBe(10);
    expect(missing.items).toHaveLength(0);
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
  it('maps the plan summary and unlinks it through the dedicated action', async () => {
    const x = await createClassRecord({
      attendanceId: 1,
      planId: 1,
      theme: '计划关联课堂',
      poseSequence,
      trainerNotes: '',
      homework: '',
      completionRating: null,
      improvementTags: [],
      nextFocus: '',
    });
    expect(x.plan).toMatchObject({ id: 1, title: '演示训练计划' });
    expect((await unlinkClassRecordPlan(x.id)).plan).toBeNull();
  });
});
