<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AppEmpty, AppError, AppLoading, AppPage, AppPagination } from '@/app/components';
import { useAuthStore } from '@/features/auth';
import { fetchClassRecords } from '@/features/class-records/api';
import type { ClassRecord } from '@/features/class-records/model';
import type { ClassRecordQuery } from '@/features/class-records/model';
import { ClassRecordFilters } from '@/features/class-records/components';
const router = useRouter(),
  auth = useAuthStore(),
  items = ref<ClassRecord[]>([]),
  loading = ref(true),
  error = ref(''),
  page = ref(1),
  total = ref(0),
  filters = ref<ClassRecordQuery>({}),
  prefix = computed(() => (auth.userRole === 'trainer' ? '/trainer' : '/admin'));
async function load() {
  loading.value = true;
  try {
    error.value = '';
    const r = await fetchClassRecords({ ...filters.value, page: page.value, pageSize: 20 });
    items.value = r.items;
    total.value = r.total;
  } catch {
    error.value = '课堂记录加载失败';
  } finally {
    loading.value = false;
  }
}
onMounted(load);
function search() {
  page.value = 1;
  void load();
}
function reset() {
  filters.value = {};
  search();
}
</script>
<template>
  <AppPage title="课时档案"
    ><template v-if="auth.userRole === 'trainer'" #header-extra
      ><button @click="router.push('/trainer/class-records/new')">新建记录</button>
      <button @click="router.push('/trainer/class-records/batch')">批量建档</button></template
    ><ClassRecordFilters v-model="filters" @submit="search" @reset="reset" /><AppLoading
      v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load" /><AppEmpty v-else-if="!items.length" description="暂无课堂记录" />
    <div v-else class="list">
      <button
        v-for="item in items"
        :key="item.id"
        @click="router.push(`${prefix}/class-records/${item.id}`)"
      >
        <strong>{{ item.theme }}</strong
        ><span>{{ item.classDate }} · {{ item.studentName }} · {{ item.trainerName }}</span
        ><small>{{ item.status === 'completed' ? '已完成' : '草稿' }}</small>
      </button>
    </div>
    <AppPagination
      :page="page"
      :page-size="20"
      :total="total"
      @change="
        (v) => {
          page = v;
          load();
        }
      "
  /></AppPage>
</template>
<style scoped>
.list {
  display: grid;
  gap: var(--space-3);
}
.list button {
  display: grid;
  gap: var(--space-1);
  text-align: left;
  padding: var(--space-4);
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
span,
small {
  color: var(--color-text-secondary);
}
</style>
