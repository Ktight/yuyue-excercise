<script setup lang="ts">
import { useRouter } from 'vue-router';
import { createStore } from '@/features/stores/api';
import { StoreForm } from '@/features/stores/components';
import { AppPage } from '@/app/components';
const router = useRouter();
async function handleCreate(data: { name: string; address: string; phone: string }) {
  await createStore({ ...data, company_id: 'c-001' });
  router.push('/admin/stores');
}
</script>
<template>
  <AppPage title="新建门店"><StoreForm :on-submit="handleCreate" /></AppPage>
</template>
