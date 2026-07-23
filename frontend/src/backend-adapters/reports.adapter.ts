import { httpClient } from '@/shared/api';
import type { ReportRequest, StageReport } from '@/features/reports/model';
interface Success<T> {
  code: string;
  message: string;
  data: T;
}
export async function previewStageReport(input: ReportRequest): Promise<StageReport> {
  const { data } = await httpClient.post<Success<StageReport>>('/reports/preview/', {
    student_id: input.studentId,
    range_start: input.rangeStart,
    range_end: input.rangeEnd,
  });
  return data.data;
}
