<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { AppError, AppLoading, AppPage } from '@/app/components';
import { useAuthStore } from '@/features/auth';
import { ClassMediaPanel } from '@/features/class-media';
import {
  completeClassRecord,
  fetchClassRecord,
  updateClassRecord,
} from '@/features/class-records/api';
import { ClassRecordForm } from '@/features/class-records/components';
import type { ClassRecord } from '@/features/class-records/model';
const route = useRoute(),
  auth = useAuthStore(),
  item = ref<ClassRecord | null>(null),
  loading = ref(true),
  error = ref(''),
  id = computed(() => Number(route.params.id)),
  editable = computed(() => auth.userRole === 'trainer' && item.value?.status === 'draft');
async function load() {
  loading.value = true;
  try {
    item.value = await fetchClassRecord(id.value);
  } catch {
    error.value = '课堂记录不存在或无权访问';
  } finally {
    loading.value = false;
  }
}
async function save(v: Parameters<typeof updateClassRecord>[1]) {
  item.value = await updateClassRecord(id.value, v);
}
async function complete() {
  if (!globalThis.confirm('完成后将不可再编辑，确认完成？')) return;
  item.value = await completeClassRecord(id.value);
}
onMounted(load);
</script>
<template>
  <AppPage :title="item?.theme || '课堂记录详情'"
    ><template v-if="editable" #header-extra><button @click="complete">完成记录</button></template
    ><AppLoading v-if="loading" /><AppError v-else-if="error" :message="error" /><template
      v-else-if="item"
      ><p>
        {{ item.classDate }} · {{ item.studentName }} · 第 {{ item.sessionNumber }} 节 ·
        {{ item.status === 'completed' ? '已完成' : '草稿' }}
      </p>
      <ClassRecordForm
        :key="item.updatedAt"
        :initial="item"
        :readonly="!editable"
        :on-submit="save" /><ClassMediaPanel :record-id="item.id" :readonly="!editable" /></template
  ></AppPage>
</template>
