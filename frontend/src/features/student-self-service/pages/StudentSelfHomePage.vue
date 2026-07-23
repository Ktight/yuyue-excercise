<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AppError, AppLoading, AppPage } from '@/app/components';
import { fetchStudentHome } from '../api';
import { StudentHomeDashboard } from '../components';
import type { StudentHomeSummary } from '../model';

const summary = ref<StudentHomeSummary | null>(null);
const loading = ref(true);
const error = ref('');

async function load() {
  loading.value = true;
  error.value = '';
  try {
    summary.value = await fetchStudentHome();
  } catch {
    error.value = '学员首页接口尚未交付或数据格式不匹配';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <AppPage>
    <p class="provisional">演示数据 · 学员聚合首页等待后端正式契约</p>
    <AppLoading v-if="loading" />
    <AppError v-else-if="error" :message="error" show-retry @retry="load" />
    <StudentHomeDashboard v-else-if="summary" :summary="summary" />
  </AppPage>
</template>

<style scoped>
.provisional {
  margin: 0 0 var(--space-4);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  background: var(--color-brand-light);
  border-radius: var(--radius-md);
}
</style>
