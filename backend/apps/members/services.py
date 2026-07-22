from django.utils import timezone

from core.constants import MemberCardType, MembershipStatus


def validate_member_card(student_profile):
    """Return whether a student's membership card can currently be used."""

    today = timezone.localdate()
    if not student_profile.member_card_active:
        return False, '会员卡已停用'
    if student_profile.member_card_start > today:
        return False, '会员卡尚未生效'
    if student_profile.member_card_expire < today:
        return False, '会员卡已过期'
    if (
        student_profile.member_card_type == MemberCardType.COUNT
        and student_profile.member_card_balance <= 0
    ):
        return False, '次卡剩余次数不足'
    if (
        student_profile.member_card_type == MemberCardType.STORED
        and student_profile.member_card_balance <= 0
    ):
        return False, '储值卡余额不足'
    return True, ''


def activate_member_card(student_profile):
    student_profile.member_card_active = True
    student_profile.save(update_fields=['member_card_active', 'updated_at'])
    return student_profile


def deactivate_member_card(student_profile):
    student_profile.member_card_active = False
    student_profile.save(update_fields=['member_card_active', 'updated_at'])
    return student_profile


def get_membership_status(student_profile):
    is_valid, reason = validate_member_card(student_profile)
    if is_valid:
        return MembershipStatus.ACTIVE, reason
    if not student_profile.member_card_active:
        return MembershipStatus.SUSPENDED, reason
    if student_profile.member_card_start > timezone.localdate():
        return MembershipStatus.SUSPENDED, reason
    if student_profile.member_card_expire < timezone.localdate():
        return MembershipStatus.EXPIRED, reason
    return MembershipStatus.EXHAUSTED, reason


def get_student_eligibility(student_profile):
    status, reason = get_membership_status(student_profile)
    is_eligible = status == MembershipStatus.ACTIVE
    reason_code = {
        MembershipStatus.ACTIVE: 'ELIGIBLE',
        MembershipStatus.EXPIRED: 'MEMBERSHIP_EXPIRED',
        MembershipStatus.SUSPENDED: 'MEMBERSHIP_SUSPENDED',
        MembershipStatus.EXHAUSTED: 'MEMBERSHIP_EXHAUSTED',
    }[status]
    return {
        'is_eligible': is_eligible,
        'can_book': is_eligible,
        'can_check_in': is_eligible,
        'can_consume': is_eligible,
        'reason_code': reason_code,
        'reason': reason,
    }
