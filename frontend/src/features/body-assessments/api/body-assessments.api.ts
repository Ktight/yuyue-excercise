import { bodyAssessmentsAdapter } from '@/backend-adapters';

export const fetchAssessments = bodyAssessmentsAdapter.fetchAssessments;
export const fetchAssessment = bodyAssessmentsAdapter.fetchAssessment;
export const createAssessment = bodyAssessmentsAdapter.createAssessment;
export const updateAssessment = bodyAssessmentsAdapter.updateAssessment;
export const deleteAssessment = bodyAssessmentsAdapter.deleteAssessment;
export const fetchAssessmentTrend = bodyAssessmentsAdapter.fetchAssessmentTrend;
