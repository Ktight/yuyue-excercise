from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ReminderState',
            fields=[
                (
                    'id',
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID',
                    ),
                ),
                ('source_key', models.CharField(max_length=120)),
                ('is_read', models.BooleanField(default=False)),
                ('is_dismissed', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                (
                    'user',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='reminder_states',
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                'db_table': 'reminder_states',
                'ordering': ('-created_at', '-id'),
            },
        ),
        migrations.AddConstraint(
            model_name='reminderstate',
            constraint=models.UniqueConstraint(
                fields=('user', 'source_key'),
                name='unique_reminder_source_per_user',
            ),
        ),
    ]
