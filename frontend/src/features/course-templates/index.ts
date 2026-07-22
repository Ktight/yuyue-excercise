export {
  fetchCourseTemplates,
  fetchCourseTemplate,
  createCourseTemplate,
  updateCourseTemplate,
  setCourseTemplateActive,
  deleteCourseTemplate,
} from './api';
export { CourseTemplateList, CourseTemplateForm, CourseTemplateFilters } from './components';
export { courseTemplatesRoutes } from './routes';
export type {
  CourseTemplate,
  CourseTemplateQuery,
  CourseTemplateListResult,
  CourseTemplateWriteInput,
  CourseCategory,
  CourseDifficulty,
  CourseStatus,
} from './model';
export { CATEGORY_LABELS, DIFFICULTY_LABELS, STATUS_LABELS } from './model';
export { courseTemplatesHandlers } from './mocks/course-templates.handlers';
