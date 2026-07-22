<script setup lang="ts">
import { useRouter } from 'vue-router';
import { createSchedule } from '@/features/schedules/api';
import type { ScheduleWriteInput } from '@/features/schedules/model';
import { ScheduleForm } from '@/features/schedules/components';
import { AppPage } from '@/app/components';
const router = useRouter();
async function save(value: ScheduleWriteInput) {
  await createSchedule(value);
  await router.push('/admin/schedules');
}
</script>
<template>
  <AppPage title="新建排课"><ScheduleForm :on-submit="save" /></AppPage>
</template>
