<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { AppError, AppLoading, AppPage, confirmAction } from '@/app/components';
import { useAuthStore } from '@/features/auth';
import { ClassMediaPanel } from '@/features/class-media';
import { FeedbackPanel } from '@/features/feedback';
import {
  completeClassRecord,
  fetchClassRecord,
  unlinkClassRecordPlan,
  updateClassRecord,
} from '@/features/class-records/api';
import { ClassRecordForm } from '@/features/class-records/components';
import type {
  ClassRecord,
  ClassRecordUpdateInput,
  ClassRecordWriteInput,
} from '@/features/class-records/model';
const route = useRoute(),
  auth = useAuthStore(),
  item = ref<ClassRecord | null>(null),
  loading = ref(true),
  error = ref(''),
  id = computed(() => Number(route.params.id)),
  editable = computed(() => auth.userRole === 'trainer' && item.value?.status === 'draft');
async function load() {
  loading.value = true;
  try {
    item.value = await fetchClassRecord(id.value);
  } catch {
    error.value = '课堂记录不存在或无权访问';
  } finally {
    loading.value = false;
  }
}
async function save(v: ClassRecordWriteInput) {
  const update: ClassRecordUpdateInput = {
    theme: v.theme,
    poseSequence: v.poseSequence,
    trainerNotes: v.trainerNotes,
    homework: v.homework,
    completionRating: v.completionRating,
    improvementTags: v.improvementTags,
    nextFocus: v.nextFocus,
  };
  item.value = await updateClassRecord(id.value, update);
}
async function complete() {
  if (
    !(await confirmAction({
      title: '完成课堂记录',
      message: '记录完成后将不可再编辑，请确认内容已经核对无误。',
      confirmText: '确认完成',
    }))
  )
    return;
  item.value = await completeClassRecord(id.value);
}
async function unlinkPlan() {
  if (
    !item.value?.plan ||
    !(await confirmAction({
      title: '解除训练计划关联',
      message: '课堂记录会被保留，但不再计入当前训练计划进度。',
      confirmText: '确认解除',
      danger: true,
    }))
  )
    return;
  item.value = await unlinkClassRecordPlan(id.value);
}
onMounted(load);
</script>
<template>
  <AppPage :title="item?.theme || '课堂记录详情'"
    ><template v-if="editable" #header-extra><button @click="complete">完成记录</button></template
    ><AppLoading v-if="loading" /><AppError v-else-if="error" :message="error" /><template
      v-else-if="item"
      ><p>
        {{ item.classDate }} · {{ item.studentName }} · 第 {{ item.sessionNumber }} 节 ·
        {{ item.status === 'completed' ? '已完成' : '草稿' }}
      </p>
      <p v-if="item.plan">
        训练计划：{{ item.plan.title }} · {{ item.plan.progress }}%
        <button v-if="auth.userRole === 'trainer'" type="button" @click="unlinkPlan">
          解除关联
        </button>
      </p>
      <ClassRecordForm
        :key="item.updatedAt"
        :initial="item"
        :readonly="!editable"
        :on-submit="save" /><ClassMediaPanel
        :record-id="item.id"
        :readonly="!editable" /><FeedbackPanel
        v-if="item.status === 'completed'"
        :class-record-id="item.id" /></template
  ></AppPage>
</template>
