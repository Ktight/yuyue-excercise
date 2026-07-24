<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  createAssessment,
  deleteAssessment,
  fetchAssessments,
  fetchAssessmentTrend,
  updateAssessment,
} from '@/features/body-assessments/api';
import type {
  AssessmentTrendData,
  BodyAssessment,
  BodyAssessmentWriteInput,
} from '@/features/body-assessments/model';
import AssessmentForm from './AssessmentForm.vue';
import AssessmentHistory from './AssessmentHistory.vue';
import AssessmentTrend from './AssessmentTrend.vue';
import { confirmAction } from '@/app/components';
const props = withDefaults(defineProps<{ studentId: number; canDelete?: boolean }>(), {
  canDelete: false,
});
const items = ref<BodyAssessment[]>([]),
  trend = ref<AssessmentTrendData | null>(null),
  editing = ref<BodyAssessment | null>(null),
  showForm = ref(false),
  error = ref('');
async function load() {
  try {
    items.value = (
      await fetchAssessments({ studentId: props.studentId, ordering: '-assess_date' })
    ).items;
    trend.value = await fetchAssessmentTrend(props.studentId, 'weight');
  } catch {
    error.value = '身体评估加载失败';
  }
}
async function save(value: BodyAssessmentWriteInput) {
  if (editing.value) await updateAssessment(editing.value.id, value);
  else await createAssessment(value);
  editing.value = null;
  showForm.value = false;
  await load();
}
async function remove(id: number) {
  if (
    !(await confirmAction({
      title: '删除身体评估',
      message: '确认删除这条身体评估记录？该操作无法恢复。',
      confirmText: '确认删除',
      danger: true,
    }))
  )
    return;
  await deleteAssessment(id);
  await load();
}
onMounted(load);
</script>
<template>
  <section>
    <div class="toolbar">
      <h3>身体评估</h3>
      <button
        @click="
          showForm = !showForm;
          editing = null;
        "
      >
        {{ showForm ? '取消' : '新增评估' }}
      </button>
    </div>
    <p v-if="error">{{ error }}</p>
    <AssessmentForm
      v-if="showForm || editing"
      :key="editing?.id ?? 'new'"
      :student-id="studentId"
      :initial="editing"
      :on-submit="save"
    /><AssessmentTrend :trend="trend" /><AssessmentHistory
      :assessments="items"
      :can-delete="canDelete"
      @edit="
        editing = $event;
        showForm = false;
      "
      @remove="remove"
    />
  </section>
</template>
<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.toolbar button {
  padding: var(--space-2) var(--space-4);
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border: 0;
  border-radius: var(--radius-button);
}
</style>
