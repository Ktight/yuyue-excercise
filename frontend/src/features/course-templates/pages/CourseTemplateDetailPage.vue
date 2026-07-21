<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  fetchCourseTemplate,
  updateCourseTemplate,
  toggleCourseTemplateStatus,
} from '@/features/course-templates/api';
import type { CourseTemplateDto } from '@/features/course-templates/model';
import { STATUS_LABELS } from '@/features/course-templates/model';
import { CourseTemplateForm } from '@/features/course-templates/components';
import { AppPage, AppLoading, AppError } from '@/app/components';

const route = useRoute();
const router = useRouter();
const template = ref<CourseTemplateDto | null>(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    template.value = (await fetchCourseTemplate(route.params.id as string)).data;
  } catch {
    error.value = '模板不存在';
  } finally {
    loading.value = false;
  }
});

async function handleUpdate(data: Parameters<typeof updateCourseTemplate>[1]) {
  await updateCourseTemplate(route.params.id as string, data);
  router.back();
}

async function handleToggle() {
  if (!template.value) return;
  const newStatus = template.value.status === 'active' ? 'inactive' : 'active';
  const r = await toggleCourseTemplateStatus(route.params.id as string, newStatus);
  template.value = r.data as CourseTemplateDto;
}
</script>

<template>
  <AppPage :title="template?.name || '课程模板详情'">
    <AppLoading v-if="loading" /><AppError v-else-if="error" :message="error" />
    <template v-else-if="template">
      <div class="ct-detail">
        <div class="ct-detail__bar">
          <span
            class="ct-detail__status"
            :class="{ 'is-inactive': template.status === 'inactive' }"
            >{{ STATUS_LABELS[template.status] }}</span
          >
          <button class="btn-toggle" @click="handleToggle">
            {{ template.status === 'active' ? '停用' : '启用' }}
          </button>
        </div>
        <CourseTemplateForm :initial="template" :on-submit="handleUpdate" />
      </div>
    </template>
  </AppPage>
</template>

<style scoped>
.ct-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
.ct-detail__bar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
.ct-detail__status {
  font-size: var(--text-sm);
  padding: 2px var(--space-3);
  border-radius: var(--radius-tag);
  background: var(--color-success-50);
  color: var(--color-success-600);
}
.ct-detail__status.is-inactive {
  background: var(--color-neutral-100);
  color: var(--color-text-tertiary);
}
.btn-toggle {
  padding: var(--space-1) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-surface);
  cursor: pointer;
}
</style>
