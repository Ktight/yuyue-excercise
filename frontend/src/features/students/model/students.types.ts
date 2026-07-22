export type StudentGender = 'male' | 'female';
export type MembershipType = 'count' | 'month' | 'quarter' | 'year' | 'stored';
export type MembershipState = 'active' | 'expired' | 'suspended' | 'exhausted';
export type StudentStatus = 'active' | 'inactive';

export interface StudentUser {
  id: number;
  name: string;
  phone: string;
  avatar: string | null;
  isActive: boolean;
}

export interface MembershipStatusDetail {
  status: MembershipState;
  isValid: boolean;
  reason: string;
}

export interface Membership {
  cardType: MembershipType;
  status: MembershipState;
  startsOn: string;
  expiresOn: string;
  remainingCount: number | null;
  balanceMinor: number | null;
  active: boolean;
}

export interface Student {
  id: number;
  user: StudentUser;
  companyId: number;
  homeStoreId: number;
  primaryTrainerId: number | null;
  gender: StudentGender;
  birthDate: string | null;
  emergencyContact: string;
  membershipType: MembershipType;
  membershipStartsOn: string;
  membershipExpiresOn: string;
  membershipBalance: number;
  membershipActive: boolean;
  membershipStatus: MembershipStatusDetail;
  healthNotes: string;
  injuryHistory: string;
  contraindications: string;
  trainingGoal: string;
  preferredStyle: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StudentListResult {
  items: Student[];
  page: number;
  pageSize: number;
  total: number;
}

export interface StudentQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: string;
  status?: StudentStatus;
  membershipStatus?: 'valid' | 'expired' | 'insufficient';
  storeId?: number;
  trainerId?: number;
  expiringDays?: number;
}

export interface StudentCreateInput {
  name: string;
  phone: string;
  password?: string;
  homeStoreId: number;
  primaryTrainerId: number | null;
  gender: StudentGender;
  birthDate: string | null;
  emergencyContact: string;
  membershipType: MembershipType;
  membershipStartsOn: string;
  membershipExpiresOn: string;
  membershipBalance: number;
  membershipActive: boolean;
  healthNotes: string;
  injuryHistory: string;
  contraindications: string;
  trainingGoal: string;
  preferredStyle: string;
}

export type StudentUpdateInput = Partial<
  Pick<
    Student,
    | 'homeStoreId'
    | 'primaryTrainerId'
    | 'gender'
    | 'birthDate'
    | 'emergencyContact'
    | 'healthNotes'
    | 'injuryHistory'
    | 'contraindications'
    | 'trainingGoal'
    | 'preferredStyle'
  >
>;

export type MembershipUpdateInput = Partial<
  Pick<
    Membership,
    'cardType' | 'startsOn' | 'expiresOn' | 'remainingCount' | 'balanceMinor' | 'active'
  >
>;

export interface StudentEligibility {
  isEligible: boolean;
  canBook: boolean;
  canCheckIn: boolean;
  canConsume: boolean;
  reasonCode: 'ELIGIBLE' | 'MEMBERSHIP_EXPIRED' | 'MEMBERSHIP_SUSPENDED' | 'MEMBERSHIP_EXHAUSTED';
  reason: string;
}
