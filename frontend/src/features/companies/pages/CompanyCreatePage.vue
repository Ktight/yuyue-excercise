<script setup lang="ts">
import { useRouter } from 'vue-router';
import { createCompany } from '@/features/companies/api';
import { CompanyForm } from '@/features/companies/components';
import { AppPage } from '@/app/components';
import type { CompanyWriteInput } from '@/features/companies/model';

const router = useRouter();
async function handleCreate(data: CompanyWriteInput) {
  await createCompany(data);
  router.push('/admin/companies');
}
</script>

<template>
  <AppPage title="新建公司">
    <CompanyForm :on-submit="handleCreate" />
  </AppPage>
</template>
