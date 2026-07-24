<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { AppEmpty, AppError, AppLoading } from '@/app/components';
import { useAuthStore } from '@/features/auth';
import { fetchTrainingPlans } from '../api';
import type { TrainingPlan } from '../model';
import TrainingPlanCard from './TrainingPlanCard.vue';

const props = defineProps<{ studentId: number }>();
const router = useRouter();
const auth = useAuthStore();
const plans = ref<TrainingPlan[]>([]);
const loading = ref(true);
const error = ref('');

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const result = await fetchTrainingPlans({
      studentId: props.studentId,
      page: 1,
      pageSize: 100,
    });
    plans.value = result.items;
  } catch {
    error.value = '训练计划加载失败';
  } finally {
    loading.value = false;
  }
}

function select(plan: TrainingPlan) {
  const prefix = auth.userRole === 'trainer' ? '/trainer' : '/admin';
  void router.push(`${prefix}/training-plans/${plan.id}`);
}

onMounted(load);
watch(() => props.studentId, load);
</script>

<template>
  <section aria-label="学员训练规划">
    <AppLoading v-if="loading" />
    <AppError v-else-if="error" :message="error" show-retry @retry="load" />
    <AppEmpty v-else-if="!plans.length" description="该学员暂无训练计划" />
    <TrainingPlanCard v-for="plan in plans" v-else :key="plan.id" :plan="plan" @select="select" />
  </section>
</template>
