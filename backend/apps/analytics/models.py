from django.conf import settings
from django.db import models


class ReminderState(models.Model):
    """Per-user state for a reminder derived from current business data."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reminder_states',
    )
    source_key = models.CharField(max_length=120)
    is_read = models.BooleanField(default=False)
    is_dismissed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'reminder_states'
        constraints = [
            models.UniqueConstraint(
                fields=('user', 'source_key'),
                name='unique_reminder_source_per_user',
            ),
        ]
        ordering = ('-created_at', '-id')
