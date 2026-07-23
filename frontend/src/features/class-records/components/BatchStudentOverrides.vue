<script setup lang="ts">
import { ref, watch } from 'vue';
import { fetchAttendances } from '@/features/attendance';
import type { Attendance } from '@/features/attendance';
import type { BatchStudentOverride } from '@/features/class-records/model';

const props = defineProps<{
  scheduleId?: number;
  modelValue: Record<string, BatchStudentOverride>;
}>();
const emit = defineEmits<{
  'update:modelValue': [Record<string, BatchStudentOverride>];
}>();

const students = ref<Attendance[]>([]);
const error = ref('');
const tags = ref<Record<string, string>>({});

function update(studentId: number, patch: BatchStudentOverride) {
  const key = String(studentId);
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: { ...props.modelValue[key], ...patch },
  });
}

function updateTags(studentId: number, value: string) {
  tags.value[String(studentId)] = value;
  update(studentId, {
    improvementTags: value
      .split(/[、,，]/)
      .map((item) => item.trim())
      .filter(Boolean),
  });
}

watch(
  () => props.scheduleId,
  async (scheduleId) => {
    students.value = [];
    error.value = '';
    emit('update:modelValue', {});
    if (!scheduleId) return;
    try {
      students.value = (await fetchAttendances({ scheduleId, pageSize: 100 })).items.filter(
        (item) => ['present', 'late'].includes(item.status),
      );
    } catch {
      error.value = '该排课的到课学员加载失败';
    }
  },
  { immediate: true },
);
</script>

<template>
  <section class="overrides">
    <div>
      <h2>学员个性化记录</h2>
      <p>共同内容会应用给所有已到课学员，这里只填写需要覆盖的内容。</p>
    </div>
    <p v-if="!scheduleId">选择排课后显示到课学员。</p>
    <p v-else-if="error" role="alert">{{ error }}</p>
    <p v-else-if="!students.length">当前排课暂无已到课或迟到学员。</p>
    <article v-for="student in students" :key="student.studentId">
      <h3>{{ student.studentName }}</h3>
      <div class="grid">
        <label>
          完成评分
          <select
            :value="modelValue[String(student.studentId)]?.completionRating ?? ''"
            @change="
              update(student.studentId, {
                completionRating: Number(($event.target as HTMLSelectElement).value) || undefined,
              })
            "
          >
            <option value="">沿用空值</option>
            <option v-for="rating in 5" :key="rating" :value="rating">{{ rating }} 分</option>
          </select>
        </label>
        <label>
          改进标签
          <input
            :value="tags[String(student.studentId)] ?? ''"
            placeholder="以逗号分隔"
            @input="updateTags(student.studentId, ($event.target as HTMLInputElement).value)"
          />
        </label>
        <label>
          个性化教练记录
          <textarea
            rows="2"
            :value="modelValue[String(student.studentId)]?.trainerNotes ?? ''"
            @input="
              update(student.studentId, {
                trainerNotes: ($event.target as HTMLTextAreaElement).value,
              })
            "
          />
        </label>
        <label>
          个性化作业
          <textarea
            rows="2"
            :value="modelValue[String(student.studentId)]?.homework ?? ''"
            @input="
              update(student.studentId, {
                homework: ($event.target as HTMLTextAreaElement).value,
              })
            "
          />
        </label>
      </div>
    </article>
  </section>
</template>

<style scoped>
.overrides,
article {
  display: grid;
  gap: var(--space-3);
}
.overrides {
  padding-block: var(--space-3);
}
article {
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}
label {
  display: grid;
  gap: var(--space-1);
}
input,
select,
textarea {
  padding: var(--space-2);
}
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
