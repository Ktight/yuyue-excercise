<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchSchedules } from '@/features/schedules/api';
import type { Schedule } from '@/features/schedules/model';
defineProps<{ modelValue?: number; disabled?: boolean }>();
defineEmits<{ 'update:modelValue': [number | undefined] }>();
const items = ref<Schedule[]>([]),
  error = ref('');
onMounted(async () => {
  try {
    items.value = (await fetchSchedules({ pageSize: 100 })).items;
  } catch {
    error.value = '排课选项加载失败';
  }
});
</script>
<template>
  <label class="schedule-select"
    >排课<select
      :value="modelValue ?? ''"
      :disabled="disabled"
      required
      @change="
        $emit(
          'update:modelValue',
          ($event.target as HTMLSelectElement).value
            ? Number(($event.target as HTMLSelectElement).value)
            : undefined,
        )
      "
    >
      <option value="" disabled>请选择排课</option>
      <option v-for="item in items" :key="item.id" :value="item.id">
        {{ item.courseDate }} {{ item.startTime.slice(0, 5) }} · {{ item.courseTemplateName }} ·
        {{ item.trainerName }}
      </option></select
    ><small v-if="error" role="alert">{{ error }}</small></label
  >
</template>
<style scoped>
.schedule-select {
  display: grid;
  gap: var(--space-1);
  min-width: min(100%, 380px);
}
select {
  padding: var(--space-2) var(--space-3);
}
small {
  color: var(--color-danger);
}
</style>
