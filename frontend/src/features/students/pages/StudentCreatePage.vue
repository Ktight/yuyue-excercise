<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { createStudent } from '@/features/students/api';
import type { StudentCreateInput, StudentUpdateInput } from '@/features/students/model';
import { StudentForm } from '@/features/students/components';
import { getStudentsBasePath } from '@/features/students/routes';
import { AppPage } from '@/app/components';
const route = useRoute(),
  router = useRouter();
async function save(value: StudentCreateInput | StudentUpdateInput) {
  await createStudent(value as StudentCreateInput);
  await router.push(getStudentsBasePath(route.path));
}
</script>
<template>
  <AppPage title="新建学员"><StudentForm :on-submit="save" /></AppPage>
</template>
