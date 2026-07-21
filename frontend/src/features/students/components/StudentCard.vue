<script setup lang="ts">
import type { Student } from '@/features/students/model';
import { MEMBERSHIP_LABELS } from '@/features/students/model';
defineProps<{ student: Student }>();
defineEmits<{ select: [student: Student] }>();
</script>
<template>
  <div class="student-card" @click="$emit('select', student)">
    <div class="student-card__avatar" aria-hidden="true">{{ student.name.slice(0, 1) }}</div>
    <div class="student-card__info">
      <div class="student-card__name">{{ student.name }}</div>
      <div class="student-card__meta">
        {{ student.phone }} ·
        {{ student.gender === 'female' ? '女' : student.gender === 'male' ? '男' : '' }}
      </div>
      <div v-if="student.trainingGoal" class="student-card__goal">{{ student.trainingGoal }}</div>
    </div>
    <span class="student-card__member">{{ MEMBERSHIP_LABELS[student.membershipType] }}</span>
  </div>
</template>
<style scoped>
.student-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition:
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
}
.student-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}
.student-card__avatar {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  color: var(--color-text-inverse);
  font-weight: var(--font-semibold);
  background: linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600));
  border-radius: var(--radius-full);
}
.student-card__info {
  flex: 1;
  min-width: 0;
}
.student-card__name {
  font-weight: var(--font-medium);
}
.student-card__meta {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-top: 2px;
}
.student-card__goal {
  font-size: var(--text-xs);
  color: var(--color-brand);
  margin-top: 2px;
}
.student-card__member {
  font-size: var(--text-xs);
  padding: 2px var(--space-2);
  border-radius: var(--radius-tag);
  background: var(--color-brand-light);
  color: var(--color-brand);
  white-space: nowrap;
}
</style>
