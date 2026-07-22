export type {
  CourseTemplate,
  CourseTemplateQuery,
  CourseTemplateListResult,
  CourseTemplateWriteInput,
  CourseCategory,
  CourseDifficulty,
  CourseStatus,
} from './course-templates.types';
export { CATEGORY_LABELS, DIFFICULTY_LABELS, STATUS_LABELS } from './course-templates.types';
export { validateCourseTemplate } from './course-template.schema';
export type { CourseTemplateValidationError } from './course-template.schema';
