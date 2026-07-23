import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { classRecordsHandlers } from '@/features/class-records';
import { attachClassMedia, deleteClassMedia, fetchClassMedia } from './class-media.adapter';
describe('class media adapter', () => {
  beforeEach(() => server.use(...classRecordsHandlers));
  it('attaches, lists and removes media metadata', async () => {
    const x = await attachClassMedia(1, {
      mediaType: 'image',
      fileUrl: 'https://example.com/a.jpg',
      thumbnailUrl: '',
      caption: '体式',
      sortOrder: 0,
    });
    expect((await fetchClassMedia(1)).some((v) => v.id === x.id)).toBe(true);
    await deleteClassMedia(1, x.id);
    expect((await fetchClassMedia(1)).some((v) => v.id === x.id)).toBe(false);
  });
});
