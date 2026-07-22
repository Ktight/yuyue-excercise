<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchStudents } from '@/features/students/api';
import type { Student } from '@/features/students/model';
import { StudentCard } from '@/features/students/components';
import { getStudentCreatePath, getStudentDetailPath } from '@/features/students/routes';
import { AppPage, AppLoading, AppEmpty, AppError } from '@/app/components';
const route = useRoute(),
  router = useRouter();
const students = ref<Student[]>([]),
  loading = ref(true),
  error = ref(''),
  search = ref('');
async function load() {
  loading.value = true;
  error.value = '';
  try {
    students.value = (await fetchStudents({ search: search.value || undefined })).items;
  } catch {
    error.value = '学员加载失败';
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>
<template>
  <AppPage title="学员管理"
    ><template #header-extra
      ><button class="primary" @click="router.push(getStudentCreatePath(route.path))">
        新建学员
      </button></template
    >
    <form class="search" @submit.prevent="load">
      <input v-model.trim="search" placeholder="搜索姓名或手机号" /><button>查询</button>
    </form>
    <AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load" /><AppEmpty v-else-if="!students.length" description="暂无学员" /><StudentCard
      v-for="student in students"
      v-else
      :key="student.id"
      :student="student"
      @select="router.push(getStudentDetailPath(route.path, student.id))"
  /></AppPage>
</template>
<style scoped>
.search {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.search input {
  flex: 1;
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
button {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
}
.primary {
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border: 0;
}
</style>
