<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchStudent, updateStudent } from '@/features/students/api';
import { mapStudent } from '@/features/students/model';
import type { Student, MembershipType } from '@/features/students/model';
import { StudentDetailTabs, StudentForm } from '@/features/students/components';
import type { StudentDetailTab } from '@/features/students/components';
import { getStudentsBasePath } from '@/features/students/routes';
import { AppPage, AppLoading, AppError } from '@/app/components';

const route = useRoute();
const router = useRouter();
const student = ref<Student | null>(null);
const loading = ref(true);
const error = ref('');
const tab = ref<StudentDetailTab>('info');

onMounted(async () => {
  try {
    student.value = mapStudent((await fetchStudent(route.params.id as string)).data);
  } catch {
    error.value = '学员不存在';
  } finally {
    loading.value = false;
  }
});

async function handleUpdate(data: {
  name: string;
  phone: string;
  membership_type: MembershipType;
}) {
  const dto = { ...data, membership_type: data.membership_type };
  await updateStudent(
    route.params.id as string,
    dto as Record<string, unknown> & { membership_type: MembershipType },
  );
  router.push(getStudentsBasePath(route.path));
}
</script>

<template>
  <AppPage :title="student?.name || '学员详情'">
    <AppLoading v-if="loading" /><AppError v-else-if="error" :message="error" />
    <template v-else-if="student">
      <StudentDetailTabs v-model="tab" />
      <StudentForm v-if="tab === 'info'" :initial="student" :on-submit="handleUpdate" />
      <div v-else class="sd-placeholder">该模块将在后续 Phase 接入</div>
    </template>
  </AppPage>
</template>

<style scoped>
.sd-placeholder {
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: var(--text-sm);
}
</style>
