<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AppError, AppPage } from '@/app/components';
import { createStudentFeedback } from '../api';
import { FeedbackForm, FeedbackSummary } from '../components';
import type { FeedbackWriteInput, StudentFeedback } from '../model';

const route = useRoute();
const router = useRouter();
const classRecordId = computed(() => Number(route.params.recordId));
const result = ref<StudentFeedback | null>(null);
const error = ref('');

async function submit(value: FeedbackWriteInput) {
  error.value = '';
  try {
    result.value = await createStudentFeedback(value);
  } catch {
    error.value = '反馈提交失败，请确认该课时是否已经反馈';
  }
}
</script>

<template>
  <AppPage title="课后反馈">
    <template #header-extra>
      <button type="button" @click="router.push('/student')">返回首页</button>
    </template>
    <FeedbackSummary v-if="result" :feedback="result" />
    <template v-else>
      <AppError v-if="error" :message="error" />
      <FeedbackForm :class-record-id="classRecordId" :on-submit="submit" />
    </template>
  </AppPage>
</template>
