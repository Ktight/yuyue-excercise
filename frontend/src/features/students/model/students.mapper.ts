import type { Student } from './students.types';

export const MEMBERSHIP_LABELS = {
  count: '次卡',
  month: '月卡',
  quarter: '季卡',
  year: '年卡',
  stored: '储值卡',
} as const;

/** @deprecated API 已直接返回领域模型，保留此函数避免旧调用方中断。 */
export function mapStudent(student: Student): Student {
  return student;
}
