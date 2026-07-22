<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchCompanies, CompanySelect, type Company } from '@/features/companies';
import { createStore } from '../api';
import { StoreForm } from '../components';
import { AppPage, AppError, AppLoading } from '@/app/components';
const router = useRouter();
const companies = ref<Company[]>([]);
const companyId = ref<number | null>(null);
const loading = ref(true);
const error = ref('');
onMounted(async () => {
  try {
    const result = await fetchCompanies({ status: 'active' });
    companies.value = result.items;
    const onlyCompany = result.items.length === 1 ? result.items[0] : undefined;
    if (onlyCompany) companyId.value = onlyCompany.id;
  } catch {
    error.value = '加载公司列表失败';
  } finally {
    loading.value = false;
  }
});
async function submit(data: { name: string; address: string }) {
  if (!companyId.value) throw new Error('请选择公司');
  await createStore({ companyId: companyId.value, ...data });
  router.push('/admin/stores');
}
</script>
<template>
  <AppPage title="新建门店"
    ><AppLoading v-if="loading" /><AppError v-else-if="error" :message="error" /><template v-else
      ><CompanySelect v-model="companyId" :companies="companies" /><StoreForm
        :on-submit="submit" /></template
  ></AppPage>
</template>
