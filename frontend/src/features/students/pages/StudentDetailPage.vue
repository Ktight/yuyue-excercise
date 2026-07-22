<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchStudent, updateStudent } from '@/features/students/api';
import type { Student, StudentCreateInput, StudentUpdateInput } from '@/features/students/model';
import { MembershipPanel, StudentDetailTabs, StudentForm } from '@/features/students/components';
import type { StudentDetailTab } from '@/features/students/components';
import { AssessmentPanel } from '@/features/body-assessments';
import { useAuthStore } from '@/features/auth';
import { AppPage, AppLoading, AppError } from '@/app/components';
const route = useRoute(),
  id = Number(route.params.id);
const auth = useAuthStore();
const isAdmin = ['super_admin', 'company_admin'].includes(auth.userRole ?? '');
const canEditMembership = isAdmin || auth.userRole === 'store_manager';
const student = ref<Student | null>(null),
  loading = ref(true),
  error = ref(''),
  tab = ref<StudentDetailTab>('info');
async function load() {
  try {
    student.value = await fetchStudent(id);
  } catch {
    error.value = '学员不存在或无权访问';
  } finally {
    loading.value = false;
  }
}
async function save(value: StudentCreateInput | StudentUpdateInput) {
  student.value = await updateStudent(id, value as StudentUpdateInput);
}
onMounted(load);
</script>
<template>
  <AppPage :title="student?.user.name || '学员详情'"
    ><AppLoading v-if="loading" /><AppError v-else-if="error" :message="error" /><template
      v-else-if="student"
      ><StudentDetailTabs v-model="tab" /><StudentForm
        v-if="tab === 'info'"
        :initial="student"
        :allow-assignment="isAdmin"
        :on-submit="save" /><MembershipPanel
        v-else-if="tab === 'membership'"
        :student-id="student.id"
        :readonly="!canEditMembership" /><AssessmentPanel
        v-else
        :student-id="student.id"
        :can-delete="isAdmin" /></template
  ></AppPage>
</template>
