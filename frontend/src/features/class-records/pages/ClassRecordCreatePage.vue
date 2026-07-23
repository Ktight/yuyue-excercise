<script setup lang="ts">
import { useRouter } from 'vue-router';
import { AppPage } from '@/app/components';
import { createClassRecord } from '@/features/class-records/api';
import { ClassRecordForm } from '@/features/class-records/components';
const router = useRouter();
async function save(v: Parameters<typeof createClassRecord>[0]) {
  const x = await createClassRecord(v);
  await router.push(`/trainer/class-records/${x.id}`);
}
</script>
<template>
  <AppPage title="新建课堂记录"><ClassRecordForm :on-submit="save" /></AppPage>
</template>
