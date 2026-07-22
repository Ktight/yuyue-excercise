<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { Schedule, ScheduleWriteInput } from '@/features/schedules/model';
const props = defineProps<{
  initial?: Schedule;
  onSubmit: (value: ScheduleWriteInput) => Promise<void>;
}>();
const saving = ref(false),
  error = ref('');
const form = reactive({
  storeId: props.initial?.storeId ?? 1,
  roomId: props.initial?.roomId ?? 1,
  courseTemplateId: props.initial?.courseTemplateId ?? 1,
  trainerId: props.initial?.trainerId ?? 1,
  courseDate: props.initial?.courseDate ?? new Date().toISOString().slice(0, 10),
  startTime: props.initial?.startTime.slice(0, 5) ?? '10:00',
  endTime: props.initial?.endTime.slice(0, 5) ?? '11:00',
  capacity: props.initial?.capacity ?? 8,
  bookingDeadline: props.initial?.bookingDeadline?.slice(0, 16) ?? '',
  scheduleMode: props.initial?.scheduleMode ?? 'single',
  weekdays: props.initial?.recurringRule?.weekdays ?? [1],
  weeks: props.initial?.recurringRule?.weeks ?? 1,
  status: props.initial?.status ?? 'published',
});
async function submit() {
  saving.value = true;
  error.value = '';
  try {
    await props.onSubmit({
      storeId: Number(form.storeId),
      roomId: Number(form.roomId),
      courseTemplateId: Number(form.courseTemplateId),
      trainerId: Number(form.trainerId),
      courseDate: form.courseDate,
      startTime: `${form.startTime}:00`,
      endTime: `${form.endTime}:00`,
      capacity: Number(form.capacity),
      bookingDeadline: form.bookingDeadline ? new Date(form.bookingDeadline).toISOString() : null,
      scheduleMode: form.scheduleMode,
      recurringRule:
        form.scheduleMode === 'recurring'
          ? { weekdays: form.weekdays.map(Number), weeks: Number(form.weeks) }
          : null,
      status: form.status,
    });
  } catch {
    error.value = '保存失败，请检查冲突、时间和容量';
  } finally {
    saving.value = false;
  }
}
</script>
<template>
  <form class="form" @submit.prevent="submit">
    <label>门店 ID<input v-model.number="form.storeId" type="number" min="1" required /></label
    ><label>教室 ID<input v-model.number="form.roomId" type="number" min="1" required /></label
    ><label
      >课程模板 ID<input
        v-model.number="form.courseTemplateId"
        type="number"
        min="1"
        required /></label
    ><label>教练 ID<input v-model.number="form.trainerId" type="number" min="1" required /></label
    ><label>课程日期<input v-model="form.courseDate" type="date" required /></label
    ><label>开始时间<input v-model="form.startTime" type="time" required /></label
    ><label>结束时间<input v-model="form.endTime" type="time" required /></label
    ><label>容量<input v-model.number="form.capacity" type="number" min="1" required /></label
    ><label>预约截止<input v-model="form.bookingDeadline" type="datetime-local" /></label
    ><label v-if="!initial"
      >排课模式<select v-model="form.scheduleMode">
        <option value="single">单次</option>
        <option value="recurring">周期</option>
      </select></label
    ><template v-if="form.scheduleMode === 'recurring' && !initial"
      ><label
        >ISO 星期（逗号分隔，周一为 1）<input
          :value="form.weekdays.join(',')"
          @input="
            form.weekdays = ($event.target as HTMLInputElement).value
              .split(',')
              .filter(Boolean)
              .map(Number)
          " /></label
      ><label
        >重复周数<input
          v-model.number="form.weeks"
          type="number"
          min="1"
          max="52" /></label></template
    ><label
      >状态<select v-model="form.status">
        <option value="published">已发布</option>
        <option value="cancelled">已取消</option>
        <option value="completed">已完成</option>
      </select></label
    >
    <p v-if="error" class="error">{{ error }}</p>
    <button :disabled="saving">{{ saving ? '保存中…' : '保存排课' }}</button>
  </form>
</template>
<style scoped>
.form {
  display: grid;
  gap: var(--space-3);
  max-width: 720px;
}
label {
  display: grid;
  gap: var(--space-1);
}
input,
select,
button {
  padding: var(--space-3);
  font: inherit;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
.error {
  color: var(--color-danger);
}
</style>
