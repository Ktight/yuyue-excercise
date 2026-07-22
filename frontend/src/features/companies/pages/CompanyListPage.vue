<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchCompanies } from '@/features/companies/api';
import type { Company, ResourceStatus } from '@/features/companies/model';
import { CompanyList } from '@/features/companies/components';
import { AppPage, AppLoading, AppEmpty, AppError, AppPagination } from '@/app/components';
import { useAuthStore } from '@/features/auth';

const router = useRouter();
const auth = useAuthStore();
const companies = ref<Company[]>([]);
const loading = ref(true);
const error = ref('');
const search = ref('');
const status = ref<ResourceStatus | ''>('');
const page = ref(1);
const pageSize = 20;
const total = ref(0);

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const r = await fetchCompanies({
      page: page.value,
      pageSize,
      search: search.value || undefined,
      status: status.value || undefined,
    });
    companies.value = r.items;
    total.value = r.total;
  } catch {
    error.value = '加载失败';
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
  <AppPage title="公司管理">
    <template #header-extra>
      <button
        v-if="auth.userRole === 'super_admin'"
        class="btn-primary"
        @click="router.push('/admin/companies/new')"
      >
        新建公司
      </button>
    </template>
    <form class="filters" @submit.prevent="applyFilters">
      <input v-model.trim="search" placeholder="搜索公司名称" />
      <select v-model="status">
        <option value="">全部状态</option>
        <option value="active">运营中</option>
        <option value="inactive">已停用</option>
      </select>
      <button>查询</button>
    </form>
    <AppLoading v-if="loading" />
    <AppError v-else-if="error" :message="error" show-retry @retry="load" />
    <AppEmpty v-else-if="companies.length === 0" description="暂无公司" />
    <CompanyList
      v-else
      :companies="companies"
      @select="(c) => router.push(`/admin/companies/${c.id}`)"
    />
    <AppPagination :page="page" :page-size="pageSize" :total="total" @change="changePage" />
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
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.filters input,
.filters select,
.filters button {
  padding: var(--space-2) var(--space-3);
}
</style>
