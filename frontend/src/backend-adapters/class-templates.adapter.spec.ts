import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { classTemplatesHandlers } from '@/features/class-templates';
import {
  createClassTemplate,
  fetchClassTemplate,
  fetchClassTemplates,
  updateClassTemplate,
} from './class-templates.adapter';
const poseSequence = {
  warmup: [{ name: '猫牛式', duration: 5, notes: '', variations: '', assists: '' }],
  main: [{ name: '下犬式', duration: 8, notes: '', variations: '', assists: '' }],
  cooldown: [{ name: '挺尸式', duration: 6, notes: '', variations: '', assists: '' }],
};
describe('class templates adapter', () => {
  beforeEach(() => server.use(...classTemplatesHandlers));
  it('maps list and pose sequence', async () => {
    const result = await fetchClassTemplates({ scope: 'company_shared' });
    expect(result.items[0]).toMatchObject({
      trainerId: 4,
      poseSequence: { warmup: [{ name: '猫牛式' }] },
    });
  });
  it('creates, retrieves and updates', async () => {
    const created = await createClassTemplate({
      trainerId: 4,
      name: '新模板',
      scope: 'personal',
      courseTemplateId: null,
      poseSequence,
      notesTemplate: '',
      isActive: true,
    });
    expect((await fetchClassTemplate(created.id)).scope).toBe('personal');
    expect((await updateClassTemplate(created.id, { name: '更新模板' })).name).toBe('更新模板');
  });
});
