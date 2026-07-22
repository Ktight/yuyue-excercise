import { describe, expect, it } from 'vitest';
import {
  getStudentCreatePath,
  getStudentDetailPath,
  getStudentsBasePath,
} from './student-navigation';

describe('student navigation', () => {
  it('keeps admin pages in the admin route group', () => {
    expect(getStudentsBasePath('/admin/students')).toBe('/admin/students');
    expect(getStudentCreatePath('/admin/students')).toBe('/admin/students/new');
    expect(getStudentDetailPath('/admin/students', 12)).toBe('/admin/students/12');
  });

  it('keeps trainer pages in the trainer route group', () => {
    expect(getStudentsBasePath('/trainer/students')).toBe('/trainer/students');
    expect(getStudentCreatePath('/trainer/students')).toBe('/trainer/students/new');
    expect(getStudentDetailPath('/trainer/students', 'student-12')).toBe(
      '/trainer/students/student-12',
    );
  });
});
