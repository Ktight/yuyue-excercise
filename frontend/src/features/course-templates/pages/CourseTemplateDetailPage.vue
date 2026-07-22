<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/features/auth';
import {
  fetchCourseTemplate,
  setCourseTemplateActive,
  updateCourseTemplate,
} from '@/features/course-templates/api';
import type { CourseTemplate } from '@/features/course-templates/model';
import { STATUS_LABELS } from '@/features/course-templates/model';
import { CourseTemplateForm } from '@/features/course-templates/components';
import { AppPage, AppLoading, AppError } from '@/app/components';

const route = useRoute();
const auth = useAuthStore();
const template = ref<CourseTemplate | null>(null);
const loading = ref(false);
const error = ref('');
const templateId = computed(() => Number(route.params.id));
const canManage = computed(() => ['super_admin', 'company_admin'].includes(auth.userRole ?? ''));

async function loadTemplate() {
  if (!Number.isInteger(templateId.value) || templateId.value < 1) {
    error.value = '课程模板编号无效';
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    template.value = await fetchCourseTemplate(templateId.value);
  } catch {
    error.value = '课程模板不存在或暂时无法加载';
  } finally {
    loading.value = false;
  }
}

async function handleUpdate(data: Parameters<typeof updateCourseTemplate>[1]) {
  template.value = await updateCourseTemplate(templateId.value, data);
}

async function handleToggle() {
  if (!template.value || !canManage.value) return;
  template.value = await setCourseTemplateActive(
    templateId.value,
    template.value.status !== 'active',
  );
}

onMounted(loadTemplate);
</script>

<template>
  <AppPage :title="template?.name || '课程模板详情'">
    <AppLoading v-if="loading" />
    <AppError v-else-if="error" :message="error" show-retry @retry="loadTemplate" />
    <template v-else-if="template">
      <div class="ct-detail">
        <div class="ct-detail__bar">
          <span
            class="ct-detail__status"
            :class="{ 'is-inactive': template.status === 'inactive' }"
          >
            {{ STATUS_LABELS[template.status] }}
          </span>
          <button v-if="canManage" class="btn-toggle" @click="handleToggle">
            {{ template.status === 'active' ? '停用' : '启用' }}
          </button>
          <span v-else class="readonly-note">当前角色仅可查看</span>
        </div>
        <CourseTemplateForm
          :key="template.updatedAt"
          :initial="template"
          :readonly="!canManage"
          :on-submit="handleUpdate"
        />
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
.readonly-note {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}
</style>
