import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type {
  Membership,
  MembershipUpdateInput,
  Student,
  StudentCreateInput,
  StudentEligibility,
  StudentListResult,
  StudentQuery,
  StudentUpdateInput,
} from '@/features/students/model';

type WireStudent = components['schemas']['Student'];
type WireCreate = components['schemas']['StudentCreateRequest'];
type WireUpdate = components['schemas']['StudentUpdateRequest'];
type WireStudentSuccess = components['schemas']['StudentSuccessResponse'];
type WireListSuccess = components['schemas']['StudentListSuccessResponse'];
type WireMembership = components['schemas']['Membership'];
type WireMembershipUpdate = components['schemas']['MembershipUpdateRequest'];
type WireMembershipSuccess = components['schemas']['MembershipSuccessResponse'];
type WireEligibility = components['schemas']['StudentEligibility'];
type WireEligibilitySuccess = components['schemas']['StudentEligibilitySuccessResponse'];

export function mapStudent(value: WireStudent): Student {
  return {
    id: value.id,
    user: {
      id: value.user.id,
      name: value.user.name,
      phone: value.user.phone,
      avatar: value.user.avatar,
      isActive: value.user.is_active,
    },
    companyId: value.company,
    homeStoreId: value.home_store,
    primaryTrainerId: value.primary_trainer,
    gender: value.gender,
    birthDate: value.birth_date,
    emergencyContact: value.emergency_contact,
    membershipType: value.member_card_type,
    membershipStartsOn: value.member_card_start,
    membershipExpiresOn: value.member_card_expire,
    membershipBalance: value.member_card_balance,
    membershipActive: value.member_card_active,
    membershipStatus: {
      status: value.member_card_status.status,
      isValid: value.member_card_status.is_valid,
      reason: value.member_card_status.reason,
    },
    healthNotes: value.health_notes,
    injuryHistory: value.injury_history,
    contraindications: value.contraindications,
    trainingGoal: value.training_goal,
    preferredStyle: value.preferred_style,
    status: value.status,
    createdAt: value.created_at,
    updatedAt: value.updated_at,
  };
}

function mapMembership(value: WireMembership): Membership {
  return {
    cardType: value.card_type,
    status: value.status,
    startsOn: value.starts_on,
    expiresOn: value.expires_on,
    remainingCount: value.remaining_count,
    balanceMinor: value.balance_minor,
    active: value.active,
  };
}

export async function fetchStudents(query: StudentQuery = {}): Promise<StudentListResult> {
  const { data } = await httpClient.get<WireListSuccess>('/students/', {
    params: {
      page: query.page,
      page_size: query.pageSize,
      search: query.search,
      ordering: query.ordering,
      status: query.status,
      membership_status: query.membershipStatus,
      store_id: query.storeId,
      trainer_id: query.trainerId,
      expiring_days: query.expiringDays,
    },
  });
  return {
    items: data.data.items.map(mapStudent),
    page: data.data.page,
    pageSize: data.data.page_size,
    total: data.data.total,
  };
}

export async function fetchStudent(id: number): Promise<Student> {
  const { data } = await httpClient.get<WireStudentSuccess>(`/students/${id}/`);
  return mapStudent(data.data);
}

export async function createStudent(value: StudentCreateInput): Promise<Student> {
  const body: WireCreate = {
    user: { name: value.name, phone: value.phone, password: value.password || undefined },
    home_store: value.homeStoreId,
    primary_trainer: value.primaryTrainerId,
    gender: value.gender,
    birth_date: value.birthDate,
    emergency_contact: value.emergencyContact,
    member_card_type: value.membershipType,
    member_card_start: value.membershipStartsOn,
    member_card_expire: value.membershipExpiresOn,
    member_card_balance: value.membershipBalance,
    member_card_active: value.membershipActive,
    health_notes: value.healthNotes,
    injury_history: value.injuryHistory,
    contraindications: value.contraindications,
    training_goal: value.trainingGoal,
    preferred_style: value.preferredStyle,
  };
  const { data } = await httpClient.post<WireStudentSuccess>('/students/', body);
  return mapStudent(data.data);
}

export async function updateStudent(id: number, value: StudentUpdateInput): Promise<Student> {
  const body: WireUpdate = {
    home_store: value.homeStoreId,
    primary_trainer: value.primaryTrainerId,
    gender: value.gender,
    birth_date: value.birthDate,
    emergency_contact: value.emergencyContact,
    health_notes: value.healthNotes,
    injury_history: value.injuryHistory,
    contraindications: value.contraindications,
    training_goal: value.trainingGoal,
    preferred_style: value.preferredStyle,
  };
  const { data } = await httpClient.patch<WireStudentSuccess>(`/students/${id}/`, body);
  return mapStudent(data.data);
}

export async function fetchMembership(id: number): Promise<Membership> {
  const { data } = await httpClient.get<WireMembershipSuccess>(`/students/${id}/membership/`);
  return mapMembership(data.data);
}

export async function updateMembership(
  id: number,
  value: MembershipUpdateInput,
): Promise<Membership> {
  const body: WireMembershipUpdate = {
    card_type: value.cardType,
    starts_on: value.startsOn,
    expires_on: value.expiresOn,
    remaining_count: value.remainingCount ?? undefined,
    balance_minor: value.balanceMinor ?? undefined,
    active: value.active,
  };
  const { data } = await httpClient.patch<WireMembershipSuccess>(
    `/students/${id}/membership/`,
    body,
  );
  return mapMembership(data.data);
}

export async function fetchEligibility(id: number): Promise<StudentEligibility> {
  const { data } = await httpClient.get<WireEligibilitySuccess>(`/students/${id}/eligibility/`);
  const value: WireEligibility = data.data;
  return {
    isEligible: value.is_eligible,
    canBook: value.can_book,
    canCheckIn: value.can_check_in,
    canConsume: value.can_consume,
    reasonCode: value.reason_code,
    reason: value.reason,
  };
}
