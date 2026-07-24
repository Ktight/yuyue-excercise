<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AppPage } from '@/app/components';
import { getErrorMessage } from '@/shared/api';
import { batchCreateClassRecords } from '@/features/class-records/api';
import { BatchStudentOverrides } from '@/features/class-records/components';
import type { BatchStudentOverride } from '@/features/class-records/model';
import { PoseSequenceEditor } from '@/features/class-templates';
import { ScheduleSelect } from '@/features/schedules';
const router = useRouter(),
  scheduleId = ref<number>(),
  busy = ref(false),
  error = ref(''),
  studentOverrides = ref<Record<string, BatchStudentOverride>>({}),
  form = reactive({
    theme: '',
    poseSequence: { warmup: [], main: [], cooldown: [] },
    trainerNotes: '',
    homework: '',
  });
async function submit() {
  if (!scheduleId.value || !form.theme.trim()) {
    error.value = '请选择排课并填写课堂主题';
    return;
  }
  busy.value = true;
  try {
    await batchCreateClassRecords({
      scheduleId: scheduleId.value,
      commonData: form,
      studentOverrides: studentOverrides.value,
    });
    await router.push('/trainer/class-records');
  } catch (cause) {
    error.value = getErrorMessage(cause, '批量创建失败；请确认考勤状态及是否已建档');
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <AppPage title="批量创建课堂记录"
    ><form @submit.prevent="submit">
      <p v-if="error" role="alert">{{ error }}</p>
      <ScheduleSelect v-model="scheduleId" /><label
        >课堂主题<input v-model="form.theme" required maxlength="200" /></label
      ><PoseSequenceEditor v-model="form.poseSequence" /><label
        >共同教练记录<textarea v-model="form.trainerNotes" rows="3" /></label
      ><label>共同课后作业<textarea v-model="form.homework" rows="3" /></label
      ><BatchStudentOverrides v-model="studentOverrides" :schedule-id="scheduleId" /><button
        :disabled="busy"
      >
        {{ busy ? '创建中…' : '为已到课学员批量创建' }}
      </button>
    </form></AppPage
  >
</template>
<style scoped>
form {
  display: grid;
  gap: var(--space-4);
}
label {
  display: grid;
  gap: var(--space-1);
}
input,
textarea {
  padding: var(--space-2);
}
button {
  justify-self: start;
  padding: var(--space-3) var(--space-5);
  color: white;
  background: var(--color-brand);
  border: 0;
  border-radius: var(--radius-button);
}
</style>
