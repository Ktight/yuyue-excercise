export interface StudentNextClass {
  scheduleId: number;
  courseName: string;
  trainerName: string;
  roomName: string;
  startAt: string;
}

export interface StudentHomeSummary {
  generatedAt: string;
  studentName: string;
  nextClass: StudentNextClass | null;
  completedSessions: number;
  attendanceRate: number;
  currentStreakDays: number;
  activePlanCount: number;
  activePlan: StudentPlanSummary | null;
  recentRecord: StudentClassRecordSummary | null;
}

export interface StudentClassRecordSummary {
  id: number;
  classDate: string;
  theme: string;
  trainerName: string;
  sessionNumber: number;
  completionRating: number | null;
  improvementTags: string[];
  homework: string;
  hasFeedback: boolean;
}

export interface StudentClassRecordDetail extends StudentClassRecordSummary {
  trainerNotes: string;
  nextFocus: string;
  poses: Array<{
    name: string;
    durationMinutes: number;
    notes: string;
  }>;
  media: Array<{
    id: number;
    type: 'image' | 'video';
    url: string;
    thumbnailUrl: string;
    caption: string;
  }>;
}

export interface StudentHistoryQuery {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface StudentHistoryResult {
  items: StudentClassRecordSummary[];
  page: number;
  pageSize: number;
  total: number;
}

export type StudentPlanStatus = 'active' | 'paused' | 'completed';

export interface StudentPlanSummary {
  id: number;
  title: string;
  trainerName: string;
  status: StudentPlanStatus;
  startDate: string;
  endDate: string;
  targetFrequencyPerWeek: number;
  completedSessionsCount: number;
  progressPercentage: number;
  goalDescription: string;
  focusTags: string[];
}

export interface StudentProfileArchive {
  studentName: string;
  phone: string;
  avatarUrl: string | null;
  storeName: string;
  trainerName: string;
  joinedAt: string;
  trainingGoals: string[];
  membership: {
    typeLabel: string;
    status: 'active' | 'expired' | 'frozen';
    expiresAt: string | null;
    remainingSessions: number | null;
    balanceCents: number | null;
  } | null;
  latestAssessment: {
    assessedAt: string;
    weightKg: number | null;
    bodyFatPercentage: number | null;
    flexibilityScore: number | null;
  } | null;
}
