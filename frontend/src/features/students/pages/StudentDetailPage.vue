<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchStudent, updateStudent } from '@/features/students/api';
import { mapStudent } from '@/features/students/model';
import type { Student, MembershipType } from '@/features/students/model';
import { StudentForm } from '@/features/students/components';
import { AppPage, AppLoading, AppError } from '@/app/components';

const route = useRoute();
const router = useRouter();
const student = ref<Student | null>(null);
const loading = ref(true);
const error = ref('');
const tab = ref('info');

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
  router.back();
}
</script>

<template>
  <AppPage :title="student?.name || '学员详情'">
    <AppLoading v-if="loading" /><AppError v-else-if="error" :message="error" />
    <template v-else-if="student">
      <div class="sd-tabs">
        <button :class="{ active: tab === 'info' }" @click="tab = 'info'">档案信息</button>
        <button :class="{ active: tab === 'assessment' }" @click="tab = 'assessment'">
          身体评估
        </button>
        <button :class="{ active: tab === 'records' }" @click="tab = 'records'">课时记录</button>
        <button :class="{ active: tab === 'plans' }" @click="tab = 'plans'">训练规划</button>
      </div>
      <StudentForm v-if="tab === 'info'" :initial="student" :on-submit="handleUpdate" />
      <div v-else class="sd-placeholder">该模块将在后续 Phase 接入</div>
    </template>
  </AppPage>
</template>

<style scoped>
.sd-tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--color-border);
  margin-bottom: var(--space-6);
}
.sd-tabs button {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: none;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition:
    color var(--transition-fast),
    border-color var(--transition-fast);
}
.sd-tabs button.active {
  color: var(--color-brand);
  border-bottom-color: var(--color-brand);
}
.sd-placeholder {
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: var(--text-sm);
}
</style>
