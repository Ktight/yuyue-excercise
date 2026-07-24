// AUTO-GENERATED — DO NOT EDIT
// Source: contracts/enums.json

export const USER_ROLE = {
  SUPER_ADMIN: 'super_admin',
  COMPANY_ADMIN: 'company_admin',
  STORE_MANAGER: 'store_manager',
  TRAINER: 'trainer',
  STUDENT: 'student',
} as const;
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export const USER_ROLE_LABELS: Readonly<Record<UserRole, string>> = {
  super_admin: '超级管理员',
  company_admin: '公司管理员',
  store_manager: '门店经理',
  trainer: '教练',
  student: '学员',
};

export const RESOURCE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;
export type ResourceStatus = (typeof RESOURCE_STATUS)[keyof typeof RESOURCE_STATUS];
export const RESOURCE_STATUS_LABELS: Readonly<Record<ResourceStatus, string>> = {
  active: '启用',
  inactive: '停用',
};

export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
} as const;
export type Gender = (typeof GENDER)[keyof typeof GENDER];
export const GENDER_LABELS: Readonly<Record<Gender, string>> = {
  male: '男',
  female: '女',
};

export const MEMBER_CARD_TYPE = {
  COUNT: 'count',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
  STORED: 'stored',
} as const;
export type MemberCardType = (typeof MEMBER_CARD_TYPE)[keyof typeof MEMBER_CARD_TYPE];
export const MEMBER_CARD_TYPE_LABELS: Readonly<Record<MemberCardType, string>> = {
  count: '次卡',
  month: '月卡',
  quarter: '季卡',
  year: '年卡',
  stored: '储值卡',
};

export const COURSE_CATEGORY = {
  PRIVATE: 'private',
  SMALL_GROUP: 'small_group',
  GROUP: 'group',
} as const;
export type CourseCategory = (typeof COURSE_CATEGORY)[keyof typeof COURSE_CATEGORY];
export const COURSE_CATEGORY_LABELS: Readonly<Record<CourseCategory, string>> = {
  private: '私教课',
  small_group: '小班课',
  group: '团体课',
};

export const COURSE_DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;
export type CourseDifficulty = (typeof COURSE_DIFFICULTY)[keyof typeof COURSE_DIFFICULTY];
export const COURSE_DIFFICULTY_LABELS: Readonly<Record<CourseDifficulty, string>> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
};

export const MEMBERSHIP_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  SUSPENDED: 'suspended',
  EXHAUSTED: 'exhausted',
} as const;
export type MembershipStatus = (typeof MEMBERSHIP_STATUS)[keyof typeof MEMBERSHIP_STATUS];
export const MEMBERSHIP_STATUS_LABELS: Readonly<Record<MembershipStatus, string>> = {
  active: '有效',
  expired: '已过期',
  suspended: '已暂停',
  exhausted: '已耗尽',
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  LATE: 'late',
  ABSENT: 'absent',
  LEAVE: 'leave',
} as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];
export const ATTENDANCE_STATUS_LABELS: Readonly<Record<AttendanceStatus, string>> = {
  present: '已到',
  late: '迟到',
  absent: '缺席',
  leave: '请假',
};

export const CLASS_RECORD_STATUS = {
  DRAFT: 'draft',
  COMPLETED: 'completed',
} as const;
export type ClassRecordStatus = (typeof CLASS_RECORD_STATUS)[keyof typeof CLASS_RECORD_STATUS];
export const CLASS_RECORD_STATUS_LABELS: Readonly<Record<ClassRecordStatus, string>> = {
  draft: '草稿',
  completed: '已完成',
};

export const FEEDBACK_FEELING = {
  EASY: 'easy',
  MODERATE: 'moderate',
  HARD: 'hard',
} as const;
export type FeedbackFeeling = (typeof FEEDBACK_FEELING)[keyof typeof FEEDBACK_FEELING];
export const FEEDBACK_FEELING_LABELS: Readonly<Record<FeedbackFeeling, string>> = {
  easy: '轻松',
  moderate: '适中',
  hard: '吃力',
};

export const REMINDER_CATEGORY = {
  BOOKING: 'booking',
  ATTENDANCE: 'attendance',
  MEMBERSHIP: 'membership',
  TRAINING: 'training',
  SYSTEM: 'system',
} as const;
export type ReminderCategory = (typeof REMINDER_CATEGORY)[keyof typeof REMINDER_CATEGORY];
export const REMINDER_CATEGORY_LABELS: Readonly<Record<ReminderCategory, string>> = {
  booking: '预约',
  attendance: '考勤',
  membership: '会员',
  training: '训练',
  system: '系统',
};

export const REMINDER_PRIORITY = {
  HIGH: 'high',
  NORMAL: 'normal',
  LOW: 'low',
} as const;
export type ReminderPriority = (typeof REMINDER_PRIORITY)[keyof typeof REMINDER_PRIORITY];
export const REMINDER_PRIORITY_LABELS: Readonly<Record<ReminderPriority, string>> = {
  high: '高',
  normal: '普通',
  low: '低',
};
