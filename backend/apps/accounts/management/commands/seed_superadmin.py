"""Create the initial project super administrator."""

import os

from django.core.management.base import BaseCommand

from apps.accounts.models import User
from core.constants import UserRole


class Command(BaseCommand):
    help = 'Create the initial super administrator if it does not exist.'

    def handle(self, *args, **options):
        phone = os.getenv('SUPERADMIN_PHONE', '13900000000')
        password = os.getenv('SUPERADMIN_PASSWORD', 'admin123')

        if User.objects.filter(phone=phone).exists():
            self.stdout.write(
                self.style.WARNING(f'超级管理员 {phone} 已存在，跳过创建。')
            )
            return

        User.objects.create_superuser(
            phone=phone,
            password=password,
            name='超级管理员',
            role=UserRole.SUPER_ADMIN,
        )
        self.stdout.write(self.style.SUCCESS(f'超级管理员 {phone} 创建成功。'))
