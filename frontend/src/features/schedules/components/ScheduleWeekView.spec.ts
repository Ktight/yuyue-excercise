import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ScheduleWeekView from './ScheduleWeekView.vue';
import type { Schedule } from '../model';

const schedule: Schedule = {
  id: 1,
  companyId: 1,
  storeId: 1,
  roomId: 1,
  courseTemplateId: 1,
  trainerId: 2,
  courseDate: '2026-07-23',
  startTime: '10:00:00',
  endTime: '11:00:00',
  capacity: 8,
  bookingDeadline: null,
  scheduleMode: 'single',
  recurringRule: null,
  status: 'published',
  bookingsCount: 1,
  remainingCapacity: 7,
  courseTemplateName: '流瑜伽基础',
  trainerName: '演示教练',
  roomName: '一号教室',
  createdAt: '',
  updatedAt: '',
};

describe('ScheduleWeekView', () => {
  it('places courses in the selected week and emits the selected schedule', async () => {
    const wrapper = mount(ScheduleWeekView, {
      props: { schedules: [schedule], startDate: '2026-07-23' },
    });
    expect(wrapper.text()).toContain('流瑜伽基础');
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('select')?.[0]).toEqual([schedule]);
  });
});
