<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchStudents, type Student } from '@/features/students';
import { fetchUsers, type UserDto } from '@/features/users';
import type { ClassRecordQuery } from '@/features/class-records/model';

defineProps<{ modelValue: ClassRecordQuery }>();
const emit = defineEmits<{
  'update:modelValue': [ClassRecordQuery];
  submit: [];
  reset: [];
}>();

const students = ref<Student[]>([]);
const trainers = ref<UserDto[]>([]);
const error = ref('');

function patch(value: Partial<ClassRecordQuery>) {
  emit('update:modelValue', { ...value });
}

onMounted(async () => {
  try {
    const [studentResult, trainerResult] = await Promise.all([
      fetchStudents({ pageSize: 100, status: 'active' }),
      fetchUsers({ page_size: 100, role: 'trainer', is_active: true }),
    ]);
    students.value = studentResult.items;
    trainers.value = trainerResult.items;
  } catch {
    error.value = '筛选选项加载失败，仍可按日期筛选';
  }
});
</script>

<template>
  <form class="filters" @submit.prevent="$emit('submit')">
    <label>
      学员
      <select
        :value="modelValue.studentId ?? ''"
        @change="
          patch({
            ...modelValue,
            studentId: Number(($event.target as HTMLSelectElement).value) || undefined,
          })
        "
      >
        <option value="">全部学员</option>
        <option v-for="item in students" :key="item.user.id" :value="item.user.id">
          {{ item.user.name }} · {{ item.user.phone }}
        </option>
      </select>
    </label>
    <label>
      教练
      <select
        :value="modelValue.trainerId ?? ''"
        @change="
          patch({
            ...modelValue,
            trainerId: Number(($event.target as HTMLSelectElement).value) || undefined,
          })
        "
      >
        <option value="">全部教练</option>
        <option v-for="item in trainers" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select>
    </label>
    <label>
      开始日期
      <input
        type="date"
        :max="modelValue.dateTo"
        :value="modelValue.dateFrom ?? ''"
        @input="
          patch({ ...modelValue, dateFrom: ($event.target as HTMLInputElement).value || undefined })
        "
      />
    </label>
    <label>
      结束日期
      <input
        type="date"
        :min="modelValue.dateFrom"
        :value="modelValue.dateTo ?? ''"
        @input="
          patch({ ...modelValue, dateTo: ($event.target as HTMLInputElement).value || undefined })
        "
      />
    </label>
    <div class="actions">
      <button>查询</button>
      <button type="button" @click="$emit('reset')">重置</button>
    </div>
    <small v-if="error" role="alert">{{ error }}</small>
  </form>
</template>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
label {
  display: grid;
  gap: var(--space-1);
}
input,
select {
  padding: var(--space-2);
}
.actions {
  display: flex;
  align-items: end;
  gap: var(--space-2);
}
[role='alert'] {
  grid-column: 1 / -1;
  color: var(--color-danger);
}
@media (max-width: 800px) {
  .filters {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 520px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
