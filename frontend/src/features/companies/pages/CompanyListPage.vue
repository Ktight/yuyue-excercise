<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchCompanies } from '@/features/companies/api';
import { mapCompany } from '@/features/companies/model';
import type { Company } from '@/features/companies/model';
import { CompanyList } from '@/features/companies/components';
import { AppPage, AppLoading, AppEmpty, AppError } from '@/app/components';

const router = useRouter();
const companies = ref<Company[]>([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const r = await fetchCompanies();
    companies.value = r.data.items.map(mapCompany);
  } catch {
    error.value = '加载失败';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <AppPage title="公司管理">
    <template #header-extra>
      <button class="btn-primary" @click="router.push('/admin/companies/new')">新建公司</button>
    </template>
    <AppLoading v-if="loading" />
    <AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="
        loading = true;
        error = '';
        fetchCompanies()
          .then((r) => (companies = r.data.items.map(mapCompany)))
          .catch(() => (error = '加载失败'))
          .finally(() => (loading = false));
      "
    />
    <AppEmpty v-else-if="companies.length === 0" description="暂无公司" />
    <CompanyList
      v-else
      :companies="companies"
      @select="(c) => router.push(`/admin/companies/${c.id}`)"
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
