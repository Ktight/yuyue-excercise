<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchCompany, updateCompany } from '@/features/companies/api';
import { mapCompany } from '@/features/companies/model';
import type { Company } from '@/features/companies/model';
import { CompanyForm } from '@/features/companies/components';
import { AppPage, AppLoading, AppError } from '@/app/components';

const route = useRoute();
const router = useRouter();
const company = ref<Company | null>(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const r = await fetchCompany(route.params.id as string);
    company.value = mapCompany(r.data);
  } catch {
    error.value = '公司不存在';
  } finally {
    loading.value = false;
  }
});

async function handleUpdate(data: { name: string; address: string; phone: string }) {
  await updateCompany(route.params.id as string, data);
  router.back();
}
</script>

<template>
  <AppPage :title="company?.name || '公司详情'">
    <AppLoading v-if="loading" />
    <AppError v-else-if="error" :message="error" />
    <CompanyForm v-else-if="company" :initial="company" :on-submit="handleUpdate" />
  </AppPage>
</template>
