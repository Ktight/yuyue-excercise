"""Global business constants and enumeration choices."""


class UserRole:
    SUPER_ADMIN = 'super_admin'
    COMPANY_ADMIN = 'company_admin'
    STORE_MANAGER = 'store_manager'
    TRAINER = 'trainer'
    STUDENT = 'student'

    CHOICES = (
        (SUPER_ADMIN, '超级管理员'),
        (COMPANY_ADMIN, '公司管理员'),
        (STORE_MANAGER, '门店店长'),
        (TRAINER, '教练'),
        (STUDENT, '学员'),
    )


class MemberCardType:
    COUNT = 'count'
    MONTH = 'month'
    QUARTER = 'quarter'
    YEAR = 'year'
    STORED = 'stored'

    CHOICES = (
        (COUNT, '次卡'),
        (MONTH, '月卡'),
        (QUARTER, '季卡'),
        (YEAR, '年卡'),
        (STORED, '储值卡'),
    )


class CourseCategory:
    PRIVATE = 'private'
    SMALL_GROUP = 'small_group'
    GROUP = 'group'

    CHOICES = (
        (PRIVATE, '私教课'),
        (SMALL_GROUP, '小班课'),
        (GROUP, '团课'),
    )


class AttendanceStatus:
    PRESENT = 'present'
    LATE = 'late'
    ABSENT = 'absent'
    LEAVE = 'leave'

    CHOICES = (
        (PRESENT, '出勤'),
        (LATE, '迟到'),
        (ABSENT, '缺勤'),
        (LEAVE, '请假'),
    )


class ClassRecordStatus:
    DRAFT = 'draft'
    COMPLETED = 'completed'
