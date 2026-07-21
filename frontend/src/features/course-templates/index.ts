export {
  fetchCourseTemplates,
  fetchCourseTemplate,
  createCourseTemplate,
  updateCourseTemplate,
  toggleCourseTemplateStatus,
} from './api';
export { CourseTemplateList, CourseTemplateForm } from './components';
export { courseTemplatesRoutes } from './routes';
export type {
  CourseTemplateDto,
  CourseTemplateListRequestDto,
  CourseTemplateCreateRequestDto,
  CourseCategory,
  CourseDifficulty,
  CourseStatus,
} from './model';
export { CATEGORY_LABELS, DIFFICULTY_LABELS, STATUS_LABELS } from './model';
export { courseTemplatesHandlers } from './mocks/course-templates.handlers';
