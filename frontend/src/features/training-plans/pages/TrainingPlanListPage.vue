<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/features/auth';
import { AppEmpty, AppError, AppLoading, AppPage, AppPagination } from '@/app/components';
import { fetchTrainingPlans } from '../api';
import { TrainingPlanCard } from '../components';
import type { TrainingPlan, TrainingPlanStatus } from '../model';
const route = useRoute(),
  router = useRouter(),
  auth = useAuthStore(),
  items = ref<TrainingPlan[]>([]),
  loading = ref(true),
  error = ref(''),
  status = ref<TrainingPlanStatus | ''>(''),
  page = ref(1),
  total = ref(0);
const prefix = computed(() => (route.path.startsWith('/trainer') ? '/trainer' : '/admin')),
  pageSize = 20;
async function load() {
  loading.value = true;
  error.value = '';
  try {
    const r = await fetchTrainingPlans({
      page: page.value,
      pageSize,
      status: status.value || undefined,
    });
    items.value = r.items;
    total.value = r.total;
  } catch {
    error.value = '训练计划加载失败';
  } finally {
    loading.value = false;
  }
}
function select(x: TrainingPlan) {
  void router.push(`${prefix.value}/training-plans/${x.id}`);
}
onMounted(load);
</script>
<template>
  <AppPage title="训练计划"
    ><template v-if="auth.userRole === 'trainer'" #header-extra
      ><button @click="router.push('/trainer/training-plans/new')">新建计划</button></template
    >
    <form
      @submit.prevent="
        page = 1;
        load();
      "
    >
      <select v-model="status">
        <option value="">全部状态</option>
        <option value="active">进行中</option>
        <option value="paused">已暂停</option>
        <option value="completed">已完成</option></select
      ><button>查询</button>
    </form>
    <AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load"
    /><AppEmpty v-else-if="!items.length" description="暂无训练计划" /><TrainingPlanCard
      v-for="item in items"
      v-else
      :key="item.id"
      :plan="item"
      @select="select"
    />
    <AppPagination
      :page="page"
      :page-size="pageSize"
      :total="total"
      @change="
        (v) => {
          page = v;
          load();
        }
      "
    />
  </AppPage>
</template>
<style scoped>
form {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
select,
button {
  padding: var(--space-2) var(--space-3);
}
</style>
