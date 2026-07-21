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
        (STORE_MANAGER, '门店经理'),
        (TRAINER, '教练'),
        (STUDENT, '学员'),
    )


class ResourceStatus:
    ACTIVE = 'active'
    INACTIVE = 'inactive'

    CHOICES = (
        (ACTIVE, '启用'),
        (INACTIVE, '停用'),
    )


class Gender:
    MALE = 'male'
    FEMALE = 'female'

    CHOICES = (
        (MALE, '男'),
        (FEMALE, '女'),
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
        (GROUP, '团体课'),
    )


class AttendanceStatus:
    PRESENT = 'present'
    LATE = 'late'
    ABSENT = 'absent'
    LEAVE = 'leave'

    CHOICES = (
        (PRESENT, '已到'),
        (LATE, '迟到'),
        (ABSENT, '缺席'),
        (LEAVE, '请假'),
    )


class ClassRecordStatus:
    DRAFT = 'draft'
    COMPLETED = 'completed'

    CHOICES = (
        (DRAFT, '草稿'),
        (COMPLETED, '已完成'),
    )
