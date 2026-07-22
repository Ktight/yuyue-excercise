"""Create deterministic Phase 1-5 local integration accounts and tenant data."""

from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.accounts.models import User
from apps.companies.models import Company, Store
from apps.members.models import StudentProfile
from core.constants import MemberCardType, UserRole


class Command(BaseCommand):
    help = 'Create deterministic local demo tenants and accounts.'

    password = 'DemoPass123!'

    @transaction.atomic
    def handle(self, *args, **options):
        today = date.today()
        company, _ = Company.objects.update_or_create(
            name='瑜悦演示公司',
            defaults={
                'contact_person': '演示管理员',
                'contact_phone': '13810000000',
                'contract_start': today,
                'contract_end': today + timedelta(days=365),
                'status': 'active',
            },
        )
        store, _ = Store.objects.update_or_create(
            company=company,
            name='瑜悦演示门店',
            defaults={
                'address': '上海市示例路 1 号',
                'phone': '021-60000000',
                'business_hours': '07:00-22:00',
                'status': 'active',
            },
        )
        company_two, _ = Company.objects.update_or_create(
            name='Demo Company B',
            defaults={
                'contact_person': 'Demo Admin B',
                'contact_phone': '13820000000',
                'contract_start': today,
                'contract_end': today + timedelta(days=365),
                'status': 'active',
            },
        )
        store_two, _ = Store.objects.update_or_create(
            company=company_two,
            name='Demo Store B',
            defaults={
                'address': 'Shanghai Demo Road 2',
                'phone': '021-60000002',
                'business_hours': '07:00-22:00',
                'status': 'active',
            },
        )

        super_admin = self.upsert_user(
            '13910000000', '演示超管', UserRole.SUPER_ADMIN,
            is_staff=True, is_superuser=True,
        )
        company_admin = self.upsert_user(
            '13910000001', '演示公司管理员', UserRole.COMPANY_ADMIN,
            company=company,
        )
        store_manager = self.upsert_user(
            '13910000002', '演示店长', UserRole.STORE_MANAGER,
            company=company, store=store,
        )
        trainer = self.upsert_user(
            '13910000003', '演示教练', UserRole.TRAINER,
            company=company, store=store,
        )
        student = self.upsert_user(
            '13910000004', '演示学员', UserRole.STUDENT,
            company=company, store=store,
        )
        StudentProfile.objects.update_or_create(
            user=student,
            defaults={
                'company': company,
                'home_store': store,
                'primary_trainer': trainer,
                'gender': 'female',
                'birth_date': date(2000, 1, 1),
                'emergency_contact': '演示家属 13810000001',
                'member_card_type': MemberCardType.MONTH,
                'member_card_start': today,
                'member_card_expire': today + timedelta(days=30),
                'member_card_balance': 0,
                'health_notes': '无',
                'injury_history': '无',
                'contraindications': '无',
                'training_goal': '改善体态',
                'preferred_style': '私教',
            },
        )
        trainer_two = self.upsert_user(
            '13910000005', 'Demo Trainer B', UserRole.TRAINER,
            company=company_two, store=store_two,
        )
        student_two = self.upsert_user(
            '13910000006', 'Demo Student B', UserRole.STUDENT,
            company=company_two, store=store_two,
        )
        StudentProfile.objects.update_or_create(
            user=student_two,
            defaults={
                'company': company_two,
                'home_store': store_two,
                'primary_trainer': trainer_two,
                'gender': 'male',
                'birth_date': date(1998, 1, 1),
                'emergency_contact': 'Demo Family B 13820000001',
                'member_card_type': MemberCardType.COUNT,
                'member_card_start': today,
                'member_card_expire': today + timedelta(days=30),
                'member_card_balance': 10,
                'health_notes': '',
                'injury_history': '',
                'contraindications': '',
                'training_goal': 'Mobility',
                'preferred_style': 'Private',
            },
        )

        self.stdout.write(self.style.SUCCESS(
            f'Demo data ready. Password for all accounts: {self.password}'
        ))
        for user in [
            super_admin, company_admin, store_manager, trainer, student,
            trainer_two, student_two,
        ]:
            self.stdout.write(f'{user.role}: {user.phone}')

    def upsert_user(self, phone, name, role, **defaults):
        user, _ = User.objects.update_or_create(
            phone=phone,
            defaults={
                'name': name,
                'role': role,
                'is_active': True,
                'is_staff': defaults.pop('is_staff', False),
                'is_superuser': defaults.pop('is_superuser', False),
                **defaults,
            },
        )
        user.set_password(self.password)
        user.save(update_fields=['password'])
        return user
