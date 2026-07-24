<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AppError, AppLoading, AppPage } from '@/app/components';
import { fetchStudentProfileArchive } from '../api';
import { StudentProfileOverview } from '../components';
import type { StudentProfileArchive } from '../model';

const profile = ref<StudentProfileArchive | null>(null);
const loading = ref(true);
const error = ref('');

async function load() {
  loading.value = true;
  error.value = '';
  try {
    profile.value = await fetchStudentProfileArchive();
  } catch {
    error.value = '学员档案接口尚未交付或数据格式不匹配';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <AppPage title="我的档案">
    <p class="provisional">演示数据 · 字段可见范围等待隐私契约冻结</p>
    <AppLoading v-if="loading" />
    <AppError v-else-if="error" :message="error" show-retry @retry="load" />
    <StudentProfileOverview v-else-if="profile" :profile="profile" />
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
