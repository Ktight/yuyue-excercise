from django.db import migrations, models
import django.db.models.deletion


def migrate_training_plan_data(apps, schema_editor):
    TrainingPlan = apps.get_model('training', 'TrainingPlan')
    StudentProfile = apps.get_model('members', 'StudentProfile')

    for plan in TrainingPlan.objects.all().iterator():
        profile = StudentProfile.objects.filter(
            user_id=plan.student_id,
            company_id=plan.company_id,
        ).first()
        if profile is None:
            raise RuntimeError(
                'Cannot migrate TrainingPlan without a same-company '
                f'StudentProfile for user_id={plan.student_id}.'
            )
        plan.student_profile_id = profile.id
        if plan.status not in {'active', 'completed'}:
            plan.status = 'paused'
        plan.save(update_fields=['student_profile', 'status'])


def restore_training_plan_data(apps, schema_editor):
    TrainingPlan = apps.get_model('training', 'TrainingPlan')
    StudentProfile = apps.get_model('members', 'StudentProfile')

    profiles = {
        profile.id: profile.user_id
        for profile in StudentProfile.objects.filter(
            id__in=TrainingPlan.objects.values_list(
                'student_profile_id',
                flat=True,
            )
        )
    }
    for plan in TrainingPlan.objects.all().iterator():
        plan.student_id = profiles[plan.student_profile_id]
        if plan.status == 'paused':
            plan.status = 'draft'
        plan.save(update_fields=['student', 'status'])


class Migration(migrations.Migration):

    dependencies = [
        ('members', '0002_studentprofile_member_card_active'),
        ('training', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='trainingplan',
            old_name='name',
            new_name='title',
        ),
        migrations.RenameField(
            model_name='trainingplan',
            old_name='starts_on',
            new_name='start_date',
        ),
        migrations.RenameField(
            model_name='trainingplan',
            old_name='ends_on',
            new_name='end_date',
        ),
        migrations.AlterField(
            model_name='trainingplan',
            name='student',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='training_plans',
                to='accounts.user',
            ),
        ),
        migrations.AddField(
            model_name='trainingplan',
            name='student_profile',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='+',
                to='members.studentprofile',
            ),
        ),
        migrations.AddField(
            model_name='trainingplan',
            name='target_frequency_per_week',
            field=models.PositiveIntegerField(default=2),
        ),
        migrations.AddField(
            model_name='trainingplan',
            name='goal_description',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='trainingplan',
            name='focus_tags',
            field=models.JSONField(default=list),
        ),
        migrations.RunPython(
            migrate_training_plan_data,
            restore_training_plan_data,
        ),
        migrations.RemoveField(
            model_name='trainingplan',
            name='student',
        ),
        migrations.RenameField(
            model_name='trainingplan',
            old_name='student_profile',
            new_name='student',
        ),
        migrations.AlterField(
            model_name='trainingplan',
            name='student',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='training_plans',
                to='members.studentprofile',
            ),
        ),
        migrations.AlterField(
            model_name='trainingplan',
            name='trainer',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='created_plans',
                to='accounts.user',
            ),
        ),
        migrations.AlterField(
            model_name='trainingplan',
            name='status',
            field=models.CharField(
                choices=[
                    ('active', '进行中'),
                    ('completed', '已完成'),
                    ('paused', '已暂停'),
                ],
                max_length=10,
            ),
        ),
        migrations.RemoveField(
            model_name='trainingplan',
            name='stages',
        ),
    ]
