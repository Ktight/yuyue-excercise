<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AppEmpty, AppError, AppLoading, AppPage } from '@/app/components';
import { fetchMyFeedback } from '../api';
import { FeedbackSummary } from '../components';
import type { StudentFeedback } from '../model';
const items = ref<StudentFeedback[]>([]),
  loading = ref(true),
  error = ref('');
async function load() {
  loading.value = true;
  error.value = '';
  try {
    items.value = await fetchMyFeedback();
  } catch {
    error.value = '反馈记录加载失败';
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>
<template>
  <AppPage title="我的反馈"
    ><AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load" /><AppEmpty
      v-else-if="!items.length"
      description="完成课程后可以提交课后反馈" />
    <div v-else class="history">
      <FeedbackSummary v-for="item in items" :key="item.id" :feedback="item" /></div
  ></AppPage>
</template>
<style scoped>
.history {
  display: grid;
  gap: var(--space-4);
}
</style>
