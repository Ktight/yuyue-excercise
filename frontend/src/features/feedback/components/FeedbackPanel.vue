<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AppError, AppLoading } from '@/app/components';
import { fetchClassRecordFeedback } from '../api';
import type { StudentFeedback } from '../model';
import FeedbackSummary from './FeedbackSummary.vue';

const props = defineProps<{ classRecordId: number }>();
const feedback = ref<StudentFeedback | null>(null);
const loading = ref(true);
const error = ref('');

async function load() {
  loading.value = true;
  error.value = '';
  try {
    feedback.value = await fetchClassRecordFeedback(props.classRecordId);
  } catch {
    error.value = '反馈加载失败';
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>

<template>
  <AppLoading v-if="loading" />
  <AppError v-else-if="error" :message="error" show-retry @retry="load" />
  <FeedbackSummary v-else :feedback="feedback" />
</template>
