<script setup lang="ts">
import { useRouter } from 'vue-router';
import { createCourseTemplate } from '@/features/course-templates/api';
import { CourseTemplateForm } from '@/features/course-templates/components';
import { AppPage } from '@/app/components';
const router = useRouter();
async function handleCreate(data: Parameters<typeof createCourseTemplate>[0]) {
  await createCourseTemplate(data);
  router.push('/admin/course-templates');
}
</script>
<template>
  <AppPage title="新建课程模板"><CourseTemplateForm :on-submit="handleCreate" /></AppPage>
</template>
