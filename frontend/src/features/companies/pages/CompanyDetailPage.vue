<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  deleteCompany,
  fetchCompany,
  updateCompany,
  setCompanyActive,
} from '@/features/companies/api';
import type { Company, CompanyWriteInput } from '@/features/companies/model';
import { CompanyForm } from '@/features/companies/components';
import { AppPage, AppLoading, AppError, confirmAction } from '@/app/components';
import { fetchStores, StoreList, type Store } from '@/features/stores';
import { useAuthStore } from '@/features/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const canManage = auth.userRole === 'super_admin';
const company = ref<Company | null>(null);
const loading = ref(true);
const error = ref('');
const stores = ref<Store[]>([]);

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    const [detail, list] = await Promise.all([fetchCompany(id), fetchStores({ companyId: id })]);
    company.value = detail;
    stores.value = list.items;
  } catch {
    error.value = '公司不存在';
  } finally {
    loading.value = false;
  }
});

async function handleUpdate(data: CompanyWriteInput) {
  company.value = await updateCompany(Number(route.params.id), data);
}
async function toggleStatus() {
  if (!company.value) return;
  const enabling = company.value.status !== 'active';
  if (
    !(await confirmAction({
      title: enabling ? '启用公司' : '停用公司',
      message: enabling
        ? '启用后公司及其业务资源将恢复使用。'
        : '停用公司可能影响其全部门店、用户、排课和预约。',
      confirmText: enabling ? '确认启用' : '确认停用',
      danger: !enabling,
    }))
  )
    return;
  company.value = await setCompanyActive(company.value.id, company.value.status !== 'active');
}
async function removeCompany() {
  if (
    !company.value ||
    !(await confirmAction({
      title: '删除公司',
      message: '删除后公司将无法恢复，并可能影响所属门店及历史业务数据。',
      confirmText: '确认删除',
      danger: true,
    }))
  )
    return;
  await deleteCompany(company.value.id);
  await router.push('/admin/companies');
}
</script>

<template>
  <AppPage :title="company?.name || '公司详情'">
    <AppLoading v-if="loading" />
    <AppError v-else-if="error" :message="error" />
    <template v-else-if="company"
      ><CompanyForm v-if="canManage" :initial="company" :on-submit="handleUpdate" />
      <dl v-else>
        <dt>地址</dt>
        <dd>{{ company.contractStart }} 至 {{ company.contractEnd }}</dd>
        <dt>联系人</dt>
        <dd>{{ company.contactPerson }} {{ company.contactPhone }}</dd>
      </dl>
      <button v-if="canManage" type="button" @click="toggleStatus">
        {{ company.status === 'active' ? '停用公司' : '启用公司' }}
      </button>
      <button v-if="canManage" class="danger" type="button" @click="removeCompany">删除公司</button>
      <h2>所属门店</h2>
      <StoreList :stores="stores" @select="(store) => router.push(`/admin/stores/${store.id}`)"
    /></template>
  </AppPage>
</template>
