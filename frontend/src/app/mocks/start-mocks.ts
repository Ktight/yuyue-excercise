import { setupWorker } from 'msw/browser';
import { healthHandlers } from '@/shared/mocks/handlers';
import { authHandlers } from '@/features/auth';
import { usersHandlers } from '@/features/users';
import { companiesHandlers } from '@/features/companies';
import { storesHandlers } from '@/features/stores';
import { roomsHandlers } from '@/features/rooms';
import { courseTemplatesHandlers } from '@/features/course-templates';
import { studentsHandlers } from '@/features/students';
import { bodyAssessmentsHandlers } from '@/features/body-assessments';

const worker = setupWorker(
  ...healthHandlers,
  ...authHandlers,
  ...usersHandlers,
  ...companiesHandlers,
  ...storesHandlers,
  ...roomsHandlers,
  ...courseTemplatesHandlers,
  ...studentsHandlers,
  ...bodyAssessmentsHandlers,
);

export async function startMocks(): Promise<void> {
  await worker.start({ onUnhandledRequest: 'bypass' });
}
