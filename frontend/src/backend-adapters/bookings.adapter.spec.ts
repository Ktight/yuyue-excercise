import { describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { bookingsHandlers } from '@/features/bookings';
import { bookSchedule, cancelBooking, createBooking, fetchBookings } from './bookings.adapter';
describe('bookings adapter', () => {
  it('maps nested schedule and student summaries', async () => {
    server.use(...bookingsHandlers);
    const result = await fetchBookings();
    expect(result.items[0]).toMatchObject({
      schedule: { courseTemplateName: '流瑜伽基础' },
      student: { name: '演示学员' },
      status: 'booked',
    });
  });
  it('supports staff proxy and student self booking', async () => {
    server.use(...bookingsHandlers);
    expect((await createBooking({ scheduleId: 1, studentId: 1 })).student.id).toBe(1);
    const self = await bookSchedule(1);
    expect(self.schedule.id).toBe(1);
    expect((await cancelBooking(self.id)).status).toBe('cancelled');
  });
});
