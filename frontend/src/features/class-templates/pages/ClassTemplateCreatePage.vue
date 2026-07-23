<script setup lang="ts">
import { useRouter } from 'vue-router';
import { AppPage } from '@/app/components';
import { createClassTemplate } from '@/features/class-templates/api';
import { ClassTemplateForm } from '@/features/class-templates/components';
const router = useRouter();
async function save(v: Parameters<typeof createClassTemplate>[0]) {
  const item = await createClassTemplate(v);
  await router.push(`/admin/class-templates/${item.id}`);
}
</script>
<template>
  <AppPage title="新建课堂记录模板"><ClassTemplateForm :on-submit="save" /></AppPage>
</template>
