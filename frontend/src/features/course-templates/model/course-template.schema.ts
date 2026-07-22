import type { CourseTemplateWriteInput } from './course-templates.types';

export interface CourseTemplateValidationError {
  field: keyof CourseTemplateWriteInput;
  message: string;
}

export function validateCourseTemplate(
  value: CourseTemplateWriteInput,
): CourseTemplateValidationError[] {
  const errors: CourseTemplateValidationError[] = [];
  if (!value.name.trim()) errors.push({ field: 'name', message: '请输入课程名称' });
  if (value.name.trim().length > 100) {
    errors.push({ field: 'name', message: '课程名称不能超过 100 个字符' });
  }
  if (!Number.isInteger(value.durationMinutes) || value.durationMinutes < 1) {
    errors.push({ field: 'durationMinutes', message: '课程时长必须为正整数' });
  }
  if (!Number.isInteger(value.maxCapacity) || value.maxCapacity < 1) {
    errors.push({ field: 'maxCapacity', message: '课程容量必须为正整数' });
  }
  if (value.category === 'private' && value.maxCapacity !== 1) {
    errors.push({ field: 'maxCapacity', message: '私教课容量固定为 1 人' });
  }
  return errors;
}
