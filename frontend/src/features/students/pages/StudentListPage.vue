<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchStudents } from '@/features/students/api';
import { mapStudent } from '@/features/students/model';
import type { Student } from '@/features/students/model';
import { StudentCard } from '@/features/students/components';
import { getStudentCreatePath, getStudentDetailPath } from '@/features/students/routes';
import { AppPage, AppLoading, AppEmpty, AppError } from '@/app/components';
const route = useRoute();
const router = useRouter();
const students = ref<Student[]>([]);
const loading = ref(true);
const error = ref('');

async function loadStudents() {
  loading.value = true;
  error.value = '';
  try {
    students.value = (await fetchStudents()).data.items.map(mapStudent);
  } catch {
    error.value = '加载失败';
  } finally {
    loading.value = false;
  }
}

onMounted(loadStudents);
</script>
<template>
  <AppPage title="学员管理"
    ><template #header-extra
      ><button class="btn-primary" @click="router.push(getStudentCreatePath(route.path))">
        新建学员
      </button></template
    >
    <AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="loadStudents"
    />
    <AppEmpty v-else-if="students.length === 0" description="暂无学员" />
    <StudentCard
      v-for="s in students"
      :key="s.id"
      :student="s"
      @select="router.push(getStudentDetailPath(route.path, s.id))"
    />
  </AppPage>
</template>
<style scoped>
.btn-primary {
  padding: var(--space-1) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border: none;
  border-radius: var(--radius-button);
  cursor: pointer;
}
</style>
