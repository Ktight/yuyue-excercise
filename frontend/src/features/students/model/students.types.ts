export type MembershipType = 'none' | 'monthly' | 'quarterly' | 'yearly' | 'count';
export const MEMBERSHIP_LABELS: Record<MembershipType, string> = {
  none: '无',
  monthly: '月卡',
  quarterly: '季卡',
  yearly: '年卡',
  count: '次卡',
};

export interface StudentDto {
  id: string;
  name: string;
  phone: string;
  gender?: 'male' | 'female';
  birthday?: string;
  avatar?: string;
  membership_type: MembershipType;
  membership_expire_date?: string;
  training_goal?: string;
  notes?: string;
  created_at?: string;
}

export interface StudentListRequestDto {
  page?: number;
  page_size?: number;
  search?: string;
  membership_type?: MembershipType;
}

export interface StudentCreateRequestDto {
  name: string;
  phone: string;
  gender?: 'male' | 'female';
  birthday?: string;
  membership_type: MembershipType;
  membership_expire_date?: string;
  training_goal?: string;
  notes?: string;
}
