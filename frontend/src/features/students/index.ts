export { fetchStudents, fetchStudent, createStudent, updateStudent } from './api';
export { StudentCard, StudentForm, StudentDetailTabs } from './components';
export type { StudentDetailTab } from './components';
export {
  studentsRoutes,
  getStudentsBasePath,
  getStudentCreatePath,
  getStudentDetailPath,
} from './routes';
export { mapStudent, MEMBERSHIP_LABELS } from './model';
export type {
  StudentDto,
  StudentListRequestDto,
  StudentCreateRequestDto,
  Student,
  MembershipType,
} from './model';
export { studentsHandlers } from './mocks/students.handlers';
