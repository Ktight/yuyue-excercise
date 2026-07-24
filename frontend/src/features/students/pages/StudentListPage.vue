<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchStudents } from '@/features/students/api';
import type { Student, StudentStatus } from '@/features/students/model';
import { StudentCard } from '@/features/students/components';
import { getStudentCreatePath, getStudentDetailPath } from '@/features/students/routes';
import { AppPage, AppLoading, AppEmpty, AppError, AppPagination } from '@/app/components';
const route = useRoute(),
  router = useRouter();
const students = ref<Student[]>([]),
  loading = ref(true),
  error = ref(''),
  search = ref(''),
  status = ref<StudentStatus | ''>(''),
  membershipStatus = ref<'valid' | 'expired' | 'insufficient' | ''>(''),
  page = ref(1),
  total = ref(0);
const pageSize = 20;
async function load() {
  loading.value = true;
  error.value = '';
  try {
    const result = await fetchStudents({
      page: page.value,
      pageSize,
      search: search.value || undefined,
      status: status.value || undefined,
      membershipStatus: membershipStatus.value || undefined,
    });
    students.value = result.items;
    total.value = result.total;
  } catch {
    error.value = '学员加载失败';
  } finally {
    loading.value = false;
  }
}
function applyFilters() {
  page.value = 1;
  void load();
}
function changePage(value: number) {
  page.value = value;
  void load();
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
    <form class="search" @submit.prevent="applyFilters">
      <input v-model.trim="search" placeholder="搜索姓名或手机号" />
      <select v-model="status">
        <option value="">全部账号状态</option>
        <option value="active">启用</option>
        <option value="inactive">停用</option>
      </select>
      <select v-model="membershipStatus">
        <option value="">全部会员状态</option>
        <option value="valid">有效</option>
        <option value="expired">已到期</option>
        <option value="insufficient">余额不足</option>
      </select>
      <button>查询</button>
    </form>
    <AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load"
    /><AppEmpty v-else-if="!students.length" description="暂无学员" /><StudentCard
      v-for="student in students"
      v-else
      :key="student.id"
      :student="student"
      @select="router.push(getStudentDetailPath(route.path, student.id))"
    />
    <AppPagination :page="page" :page-size="pageSize" :total="total" @change="changePage" />
  </AppPage>
</template>
<style scoped>
.search {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.search input,
.search select {
  flex: 1;
  min-width: 12rem;
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
@media (max-width: 640px) {
  .search {
    align-items: stretch;
    flex-direction: column;
  }
  .search input,
  .search select,
  .search button {
    width: 100%;
    min-width: 0;
  }
}
</style>
