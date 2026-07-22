<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { createStudent } from '@/features/students/api';
import { StudentForm } from '@/features/students/components';
import { getStudentsBasePath } from '@/features/students/routes';
import { AppPage } from '@/app/components';
const route = useRoute();
const router = useRouter();
async function handleCreate(d: Parameters<typeof createStudent>[0]) {
  await createStudent(d);
  router.push(getStudentsBasePath(route.path));
}
</script>
<template>
  <AppPage title="新建学员"><StudentForm :on-submit="handleCreate" /></AppPage>
</template>
