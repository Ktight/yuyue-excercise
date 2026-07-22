<script setup lang="ts">
import type { Student } from '@/features/students/model';
import { MEMBERSHIP_LABELS } from '@/features/students/model';
defineProps<{ student: Student }>();
defineEmits<{ select: [] }>();
</script>
<template>
  <button class="student-card" type="button" @click="$emit('select')">
    <span class="avatar">{{ student.user.name.slice(0, 1) }}</span>
    <span class="content"
      ><strong>{{ student.user.name }}</strong
      ><small>{{ student.user.phone }} · {{ MEMBERSHIP_LABELS[student.membershipType] }}</small
      ><small :class="{ warning: !student.membershipStatus.isValid }">{{
        student.membershipStatus.isValid
          ? `有效至 ${student.membershipExpiresOn}`
          : student.membershipStatus.reason
      }}</small></span
    >
    <span aria-hidden="true">›</span>
  </button>
</template>
<style scoped>
.student-card {
  display: flex;
  width: 100%;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  text-align: left;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
}
.student-card:hover {
  border-color: var(--color-primary-200);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}
.avatar {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  color: var(--color-text-inverse);
  background: linear-gradient(145deg, var(--color-primary-400), var(--color-brand));
  border-radius: 50%;
}
@media (max-width: 640px) {
  .student-card {
    padding-inline: 0;
    border-inline: 0;
    border-radius: 0;
  }
}
.content {
  display: grid;
  flex: 1;
  gap: var(--space-1);
}
small {
  color: var(--color-text-secondary);
}
.warning {
  color: var(--color-danger);
}
</style>
