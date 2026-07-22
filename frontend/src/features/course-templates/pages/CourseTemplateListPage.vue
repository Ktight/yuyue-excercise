<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/features/auth';
import { fetchCourseTemplates } from '@/features/course-templates/api';
import type { CourseTemplate, CourseTemplateQuery } from '@/features/course-templates/model';
import { CourseTemplateFilters, CourseTemplateList } from '@/features/course-templates/components';
import { AppPage, AppLoading, AppEmpty, AppError } from '@/app/components';

const router = useRouter();
const auth = useAuthStore();
const templates = ref<CourseTemplate[]>([]);
const query = ref<CourseTemplateQuery>({ page: 1, pageSize: 20 });
const total = ref(0);
const loading = ref(false);
const error = ref('');
const canManage = computed(() => ['super_admin', 'company_admin'].includes(auth.userRole ?? ''));
const pageCount = computed(() =>
  Math.max(1, Math.ceil(total.value / (query.value.pageSize ?? 20))),
);

async function loadTemplates() {
  loading.value = true;
  error.value = '';
  try {
    const result = await fetchCourseTemplates(query.value);
    templates.value = result.items;
    total.value = result.total;
  } catch {
    error.value = '课程模板加载失败，请稍后重试';
  } finally {
    loading.value = false;
  }
}

function applyFilters(filters: CourseTemplateQuery) {
  query.value = { ...query.value, ...filters, page: 1 };
  void loadTemplates();
}

function changePage(page: number) {
  query.value = { ...query.value, page };
  void loadTemplates();
}

onMounted(loadTemplates);
</script>

<template>
  <AppPage title="课程模板">
    <template v-if="canManage" #header-extra>
      <button class="btn-primary" @click="router.push('/admin/course-templates/new')">
        新建模板
      </button>
    </template>
    <CourseTemplateFilters :value="query" @apply="applyFilters" />
    <AppLoading v-if="loading" />
    <AppError v-else-if="error" :message="error" show-retry @retry="loadTemplates" />
    <AppEmpty v-else-if="templates.length === 0" description="暂无课程模板" />
    <CourseTemplateList
      v-else
      :templates="templates"
      @select="(template) => router.push(`/admin/course-templates/${template.id}`)"
    />
    <nav v-if="!loading && !error && total" class="pagination" aria-label="课程模板分页">
      <button :disabled="(query.page ?? 1) <= 1" @click="changePage((query.page ?? 1) - 1)">
        上一页
      </button>
      <span>第 {{ query.page ?? 1 }} / {{ pageCount }} 页，共 {{ total }} 条</span>
      <button :disabled="(query.page ?? 1) >= pageCount" @click="changePage((query.page ?? 1) + 1)">
        下一页
      </button>
    </nav>
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
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}
.pagination button {
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-surface);
}
</style>
