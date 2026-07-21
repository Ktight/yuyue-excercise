<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchCourseTemplates } from '@/features/course-templates/api';
import type { CourseTemplateDto } from '@/features/course-templates/model';
import { CourseTemplateList } from '@/features/course-templates/components';
import { AppPage, AppLoading, AppEmpty, AppError } from '@/app/components';

const router = useRouter();
const templates = ref<CourseTemplateDto[]>([]);
const loading = ref(true);
const error = ref('');
onMounted(async () => {
  try {
    templates.value = (await fetchCourseTemplates()).data.items;
  } catch {
    error.value = '加载失败';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <AppPage title="课程模板">
    <template #header-extra
      ><button class="btn-primary" @click="router.push('/admin/course-templates/new')">
        新建模板
      </button></template
    >
    <AppLoading v-if="loading" /><AppError v-else-if="error" :message="error" show-retry />
    <AppEmpty v-else-if="templates.length === 0" description="暂无课程模板" />
    <CourseTemplateList
      v-else
      :templates="templates"
      @select="(t) => router.push(`/admin/course-templates/${t.id}`)"
    />
  </AppPage>
</template>
<style scoped>
.btn-primary {
  padding: var(--space-1) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border: none;
  border-radius: var(--radius-button);
  cursor: pointer;
}
</style>
