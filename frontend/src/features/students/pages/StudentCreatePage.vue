<script setup lang="ts">
import { useRouter } from 'vue-router';
import { createStudent } from '@/features/students/api';
import { StudentForm } from '@/features/students/components';
import { AppPage } from '@/app/components';
const router = useRouter();
async function handleCreate(d: Parameters<typeof createStudent>[0]) {
  await createStudent(d);
  router.push('/admin/students');
}
</script>
<template>
  <AppPage title="新建学员"><StudentForm :on-submit="handleCreate" /></AppPage>
</template>
