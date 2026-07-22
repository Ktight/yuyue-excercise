<script setup lang="ts">
import { useRouter } from 'vue-router';
import { createStore } from '../api';
import { StoreForm } from '../components';
import type { StoreWriteInput } from '../model';
import { AppPage } from '@/app/components';
const router = useRouter();
async function submit(data: StoreWriteInput) {
  const store = await createStore(data);
  await router.push(`/admin/stores/${store.id}`);
}
</script>
<template>
  <AppPage title="新建门店"><StoreForm :on-submit="submit" /></AppPage>
</template>
