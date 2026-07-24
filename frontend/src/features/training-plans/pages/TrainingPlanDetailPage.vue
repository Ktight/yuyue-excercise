<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AppError, AppLoading, AppPage, confirmAction } from '@/app/components';
import { useAuthStore } from '@/features/auth';
import { getErrorMessage } from '@/shared/api';
import {
  completeTrainingPlan,
  deleteTrainingPlan,
  fetchTrainingPlan,
  pauseTrainingPlan,
  updateTrainingPlan,
} from '../api';
import { TrainingPlanForm } from '../components';
import type { TrainingPlanDetail, TrainingPlanWriteInput } from '../model';
const route = useRoute(),
  router = useRouter(),
  auth = useAuthStore(),
  item = ref<TrainingPlanDetail | null>(null),
  loading = ref(true),
  error = ref(''),
  actionError = ref(''),
  busy = ref(false),
  id = computed(() => Number(route.params.id));
const editable = computed(
  () => auth.userRole === 'trainer' && auth.user?.id === item.value?.trainerId,
);
async function load() {
  loading.value = true;
  try {
    item.value = await fetchTrainingPlan(id.value);
  } catch {
    error.value = '训练计划不存在或无权访问';
  } finally {
    loading.value = false;
  }
}
async function save(v: TrainingPlanWriteInput) {
  const updated = await updateTrainingPlan(id.value, v);
  if (item.value) item.value = { ...item.value, ...updated };
}
async function action(kind: 'pause' | 'complete' | 'delete') {
  const messages = {
    pause: ['暂停训练计划', '暂停后可通过编辑状态恢复。'],
    complete: ['完成训练计划', '完成后再次操作将产生冲突。'],
    delete: ['删除训练计划', '课堂记录会保留，但计划关联将被清除。'],
  } as const;
  if (
    busy.value ||
    !(await confirmAction({
      title: messages[kind][0],
      message: messages[kind][1],
      confirmText: '确认',
      danger: kind === 'delete',
    }))
  )
    return;
  busy.value = true;
  actionError.value = '';
  try {
    if (kind === 'delete') {
      await deleteTrainingPlan(id.value);
      await router.push('/trainer/training-plans');
      return;
    }
    const updated =
      kind === 'pause' ? await pauseTrainingPlan(id.value) : await completeTrainingPlan(id.value);
    if (item.value) item.value = { ...item.value, ...updated };
  } catch (cause) {
    actionError.value = getErrorMessage(cause, '操作失败，请稍后重试');
  } finally {
    busy.value = false;
  }
}
onMounted(load);
</script>
<template>
  <AppPage :title="item?.title || '训练计划详情'"
    ><template v-if="editable" #header-extra
      ><button :disabled="busy || item?.status !== 'active'" @click="action('pause')">暂停</button
      ><button :disabled="busy || item?.status === 'completed'" @click="action('complete')">
        完成</button
      ><button :disabled="busy" @click="action('delete')">删除</button></template
    >
    <AppLoading v-if="loading" /><AppError v-else-if="error" :message="error" /><template
      v-else-if="item"
    >
      <p v-if="actionError" role="alert">{{ actionError }}</p>
      <section class="summary">
        <strong>完成进度 {{ item.progressPercentage }}%</strong
        ><span>已完成 {{ item.completedSessionsCount }} 节</span>
      </section>
      <TrainingPlanForm
        :key="item.updatedAt"
        :initial="item"
        :readonly="!editable"
        :on-submit="save"
      />
      <h2>关联课时档案</h2>
      <p v-if="!item.linkedRecords.length">暂无关联记录</p>
      <RouterLink
        v-for="record in item.linkedRecords"
        :key="record.id"
        :to="`${auth.userRole === 'trainer' ? '/trainer' : '/admin'}/class-records/${record.id}`"
        >{{ record.classDate }} · {{ record.theme }} · 第 {{ record.sessionNumber }} 节</RouterLink
      >
    </template></AppPage
  >
</template>
<style scoped>
.summary {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  background: var(--color-brand-light);
  border-radius: var(--radius-card);
}
a {
  display: block;
  padding: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}
</style>
