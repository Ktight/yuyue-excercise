import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { feedbackHandlers } from '@/features/feedback';
import {
  createStudentFeedback,
  fetchClassRecordFeedback,
  fetchMyFeedback,
} from './feedback.adapter';

describe('feedback adapter', () => {
  beforeEach(() => server.use(...feedbackHandlers));

  it('maps the frozen feedback response', async () => {
    expect(await fetchClassRecordFeedback(1)).toMatchObject({
      classRecordId: 1,
      studentName: '演示学员',
      feeling: 'moderate',
      improvementNote: '肩颈比上周放松',
      photoUrls: [],
      canEdit: false,
    });
  });

  it('creates immutable feedback without a photo field', async () => {
    const result = await createStudentFeedback({
      classRecordId: 88,
      feeling: 'easy',
      improvementNote: '呼吸更稳定',
      comment: '强度合适',
    });
    expect(result).toMatchObject({
      classRecordId: 88,
      feeling: 'easy',
      photoUrls: [],
      canEdit: false,
    });
  });

  it('loads the current student feedback list', async () => {
    const items = await fetchMyFeedback();
    expect(items[0]).toMatchObject({
      classRecordId: 1,
      studentName: '演示学员',
      feeling: 'moderate',
      canEdit: false,
    });
  });
});
