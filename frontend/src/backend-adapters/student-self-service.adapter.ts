import { httpClient } from '@/shared/api';
import type {
  StudentClassRecordDetail,
  StudentClassRecordSummary,
  StudentHistoryQuery,
  StudentHistoryResult,
  StudentHomeSummary,
  StudentPlanStatus,
  StudentPlanSummary,
  StudentProfileArchive,
} from '@/features/student-self-service/model';

type DraftRecord = {
  id: number;
  class_date: string;
  theme: string;
  trainer_name: string;
  session_number: number;
  completion_rating: number | null;
  improvement_tags: string[];
  homework: string;
  has_feedback: boolean;
};

type DraftPlan = {
  id: number;
  title: string;
  trainer_name: string;
  status: StudentPlanStatus;
  start_date: string;
  end_date: string;
  target_frequency_per_week: number;
  completed_sessions_count: number;
  progress_percentage: number;
  goal_description: string;
  focus_tags: string[];
};

interface DraftHomePayload {
  generated_at: string;
  student_name: string;
  next_class: {
    schedule_id: number;
    course_name: string;
    trainer_name: string;
    room_name: string;
    start_at: string;
  } | null;
  stats: {
    completed_sessions: number;
    attendance_rate: number;
    current_streak_days: number;
    active_plan_count: number;
  };
  active_plan: DraftPlan | null;
  recent_record: DraftRecord | null;
}

interface DraftRecordDetailPayload extends DraftRecord {
  trainer_notes: string;
  next_focus: string;
  poses: Array<{ name: string; duration_minutes: number; notes: string }>;
  media: Array<{
    id: number;
    media_type: 'image' | 'video';
    file_url: string;
    thumbnail_url: string;
    caption: string;
  }>;
}

interface DraftProfilePayload {
  student_name: string;
  phone: string;
  avatar_url: string | null;
  store_name: string;
  trainer_name: string;
  joined_at: string;
  training_goals: string[];
  membership: {
    type_label: string;
    status: 'active' | 'expired' | 'frozen';
    expires_at: string | null;
    remaining_sessions: number | null;
    balance_cents: number | null;
  } | null;
  latest_assessment: {
    assessed_at: string;
    weight_kg: number | null;
    body_fat_percentage: number | null;
    flexibility_score: number | null;
  } | null;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function assertDraftPayload<T>(value: unknown, requiredKeys: string[], name: string): T {
  if (!isObject(value) || requiredKeys.some((key) => !(key in value))) {
    throw new Error(`${name}_CONTRACT_MISMATCH`);
  }
  return value as T;
}

function mapRecord(value: DraftRecord): StudentClassRecordSummary {
  return {
    id: value.id,
    classDate: value.class_date,
    theme: value.theme,
    trainerName: value.trainer_name,
    sessionNumber: value.session_number,
    completionRating: value.completion_rating,
    improvementTags: value.improvement_tags,
    homework: value.homework,
    hasFeedback: value.has_feedback,
  };
}

function mapPlan(value: DraftPlan): StudentPlanSummary {
  return {
    id: value.id,
    title: value.title,
    trainerName: value.trainer_name,
    status: value.status,
    startDate: value.start_date,
    endDate: value.end_date,
    targetFrequencyPerWeek: value.target_frequency_per_week,
    completedSessionsCount: value.completed_sessions_count,
    progressPercentage: value.progress_percentage,
    goalDescription: value.goal_description,
    focusTags: value.focus_tags,
  };
}

export async function fetchStudentHome(): Promise<StudentHomeSummary> {
  const response = await httpClient.get<{ data: unknown }>('/student/home/');
  const value = assertDraftPayload<DraftHomePayload>(
    response.data.data,
    ['generated_at', 'student_name', 'stats'],
    'STUDENT_HOME',
  );
  return {
    generatedAt: value.generated_at,
    studentName: value.student_name,
    nextClass: value.next_class
      ? {
          scheduleId: value.next_class.schedule_id,
          courseName: value.next_class.course_name,
          trainerName: value.next_class.trainer_name,
          roomName: value.next_class.room_name,
          startAt: value.next_class.start_at,
        }
      : null,
    completedSessions: value.stats.completed_sessions,
    attendanceRate: value.stats.attendance_rate,
    currentStreakDays: value.stats.current_streak_days,
    activePlanCount: value.stats.active_plan_count,
    activePlan: value.active_plan ? mapPlan(value.active_plan) : null,
    recentRecord: value.recent_record ? mapRecord(value.recent_record) : null,
  };
}

export async function fetchStudentHistory(
  query: StudentHistoryQuery = {},
): Promise<StudentHistoryResult> {
  const response = await httpClient.get<{ data: unknown }>('/student/class-records/', {
    params: {
      page: query.page,
      page_size: query.pageSize,
      date_from: query.dateFrom,
      date_to: query.dateTo,
    },
  });
  const value = assertDraftPayload<{
    items: DraftRecord[];
    page: number;
    page_size: number;
    total: number;
  }>(response.data.data, ['items', 'page', 'page_size', 'total'], 'STUDENT_HISTORY');
  if (!Array.isArray(value.items)) throw new Error('STUDENT_HISTORY_CONTRACT_MISMATCH');
  return {
    items: value.items.map(mapRecord),
    page: value.page,
    pageSize: value.page_size,
    total: value.total,
  };
}

export async function fetchStudentRecord(id: number): Promise<StudentClassRecordDetail> {
  const response = await httpClient.get<{ data: unknown }>(`/student/class-records/${id}/`);
  const value = assertDraftPayload<DraftRecordDetailPayload>(
    response.data.data,
    ['id', 'class_date', 'theme', 'poses', 'media'],
    'STUDENT_RECORD',
  );
  return {
    ...mapRecord(value),
    trainerNotes: value.trainer_notes,
    nextFocus: value.next_focus,
    poses: value.poses.map((pose) => ({
      name: pose.name,
      durationMinutes: pose.duration_minutes,
      notes: pose.notes,
    })),
    media: value.media.map((media) => ({
      id: media.id,
      type: media.media_type,
      url: media.file_url,
      thumbnailUrl: media.thumbnail_url,
      caption: media.caption,
    })),
  };
}

export async function fetchStudentPlans(): Promise<StudentPlanSummary[]> {
  const response = await httpClient.get<{ data: unknown }>('/student/training-plans/');
  const value = assertDraftPayload<{ items: DraftPlan[] }>(
    response.data.data,
    ['items'],
    'STUDENT_PLANS',
  );
  if (!Array.isArray(value.items)) throw new Error('STUDENT_PLANS_CONTRACT_MISMATCH');
  return value.items.map(mapPlan);
}

export async function fetchStudentPlan(id: number): Promise<StudentPlanSummary> {
  const response = await httpClient.get<{ data: unknown }>(`/student/training-plans/${id}/`);
  const value = assertDraftPayload<DraftPlan>(
    response.data.data,
    ['id', 'title', 'status', 'progress_percentage'],
    'STUDENT_PLAN',
  );
  return mapPlan(value);
}

export async function fetchStudentProfileArchive(): Promise<StudentProfileArchive> {
  const response = await httpClient.get<{ data: unknown }>('/student/profile/');
  const value = assertDraftPayload<DraftProfilePayload>(
    response.data.data,
    ['student_name', 'phone', 'training_goals'],
    'STUDENT_PROFILE',
  );
  return {
    studentName: value.student_name,
    phone: value.phone,
    avatarUrl: value.avatar_url,
    storeName: value.store_name,
    trainerName: value.trainer_name,
    joinedAt: value.joined_at,
    trainingGoals: value.training_goals,
    membership: value.membership
      ? {
          typeLabel: value.membership.type_label,
          status: value.membership.status,
          expiresAt: value.membership.expires_at,
          remainingSessions: value.membership.remaining_sessions,
          balanceCents: value.membership.balance_cents,
        }
      : null,
    latestAssessment: value.latest_assessment
      ? {
          assessedAt: value.latest_assessment.assessed_at,
          weightKg: value.latest_assessment.weight_kg,
          bodyFatPercentage: value.latest_assessment.body_fat_percentage,
          flexibilityScore: value.latest_assessment.flexibility_score,
        }
      : null,
  };
}
