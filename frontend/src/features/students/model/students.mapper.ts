import type { StudentDto, MembershipType } from './students.types';

export interface Student {
  id: string;
  name: string;
  phone: string;
  gender: string;
  birthday: string;
  avatar?: string;
  membershipType: MembershipType;
  membershipExpireDate: string;
  trainingGoal: string;
  notes: string;
  createdAt: string;
}

export function mapStudent(dto: StudentDto): Student {
  return {
    id: dto.id,
    name: dto.name,
    phone: dto.phone,
    gender: dto.gender || '',
    birthday: dto.birthday || '',
    avatar: dto.avatar,
    membershipType: dto.membership_type,
    membershipExpireDate: dto.membership_expire_date || '',
    trainingGoal: dto.training_goal || '',
    notes: dto.notes || '',
    createdAt: dto.created_at || '',
  };
}
