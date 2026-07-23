<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AppEmpty, AppError, AppLoading, AppPage, AppPagination } from '@/app/components';
import { fetchStudentHistory } from '../api';
import { StudentHistoryCard } from '../components';
import type { StudentClassRecordSummary } from '../model';

const router = useRouter();
const items = ref<StudentClassRecordSummary[]>([]);
const loading = ref(true);
const error = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const page = ref(1);
const total = ref(0);
const pageSize = 10;

async function load() {
  if (dateFrom.value && dateTo.value && dateFrom.value > dateTo.value) {
    error.value = '开始日期不能晚于结束日期';
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    const result = await fetchStudentHistory({
      page: page.value,
      pageSize,
      dateFrom: dateFrom.value || undefined,
      dateTo: dateTo.value || undefined,
    });
    items.value = result.items;
    total.value = result.total;
  } catch {
    error.value = '训练历史接口尚未交付或数据格式不匹配';
  } finally {
    loading.value = false;
  }
}

function search() {
  page.value = 1;
  void load();
}

function select(record: StudentClassRecordSummary) {
  void router.push(`/student/history/${record.id}`);
}

onMounted(load);
</script>

<template>
  <AppPage title="训练历史">
    <p class="provisional">演示数据 · 只展示学员本人可见的已完成课时</p>
    <form class="filters" @submit.prevent="search">
      <label>开始日期<input v-model="dateFrom" type="date" /></label>
      <label>结束日期<input v-model="dateTo" type="date" /></label>
      <button>查询</button>
      <button
        type="button"
        class="secondary"
        @click="
          dateFrom = '';
          dateTo = '';
          search();
        "
      >
        重置
      </button>
    </form>
    <AppLoading v-if="loading" />
    <AppError v-else-if="error" :message="error" show-retry @retry="load" />
    <AppEmpty v-else-if="!items.length" description="所选日期内暂无训练记录" />
    <template v-else>
      <StudentHistoryCard v-for="item in items" :key="item.id" :record="item" @select="select" />
      <AppPagination
        :page="page"
        :page-size="pageSize"
        :total="total"
        @change="
          (value) => {
            page = value;
            load();
          }
        "
      />
    </template>
  </AppPage>
</template>

<style scoped>
.provisional {
  margin: 0 0 var(--space-4);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  background: var(--color-brand-light);
  border-radius: var(--radius-md);
}
.filters {
  display: flex;
  align-items: end;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
.filters label {
  display: grid;
  gap: var(--space-1);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}
.filters input,
.filters button {
  min-height: 40px;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
}
.filters button {
  color: var(--color-text-on-brand);
  background: var(--color-brand);
  cursor: pointer;
}
.filters .secondary {
  color: var(--color-text-primary);
  background: var(--color-surface);
}
@media (max-width: 640px) {
  .filters {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
