<script setup lang="ts">
import { useRouter } from 'vue-router';
import { AppPage } from '@/app/components';
import { createTrainingPlan } from '../api';
import { TrainingPlanForm } from '../components';
const router = useRouter();
async function save(v: Parameters<typeof createTrainingPlan>[0]) {
  const x = await createTrainingPlan(v);
  await router.push(`/trainer/training-plans/${x.id}`);
}
</script>
<template>
  <AppPage title="新建训练计划"><TrainingPlanForm :on-submit="save" /></AppPage>
</template>
