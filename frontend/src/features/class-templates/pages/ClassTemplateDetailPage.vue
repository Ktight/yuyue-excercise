<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AppError, AppLoading, AppPage } from '@/app/components';
import { useAuthStore } from '@/features/auth';
import {
  deleteClassTemplate,
  fetchClassTemplate,
  updateClassTemplate,
} from '@/features/class-templates/api';
import { ClassTemplateForm } from '@/features/class-templates/components';
import type { ClassTemplate } from '@/features/class-templates/model';
const route = useRoute(),
  router = useRouter(),
  auth = useAuthStore(),
  item = ref<ClassTemplate | null>(null),
  loading = ref(true),
  error = ref('');
const id = computed(() => Number(route.params.id)),
  canManage = computed(() => ['super_admin', 'company_admin'].includes(auth.userRole ?? ''));
async function load() {
  loading.value = true;
  try {
    item.value = await fetchClassTemplate(id.value);
  } catch {
    error.value = '课堂记录模板不存在或无权访问';
  } finally {
    loading.value = false;
  }
}
async function save(v: Parameters<typeof updateClassTemplate>[1]) {
  item.value = await updateClassTemplate(id.value, v);
}
async function remove() {
  if (!canManage.value || !globalThis.confirm('确认删除该课堂记录模板？')) return;
  await deleteClassTemplate(id.value);
  await router.push('/admin/class-templates');
}
onMounted(load);
</script>
<template>
  <AppPage :title="item?.name || '课堂记录模板详情'"
    ><template v-if="canManage && item" #header-extra
      ><button class="danger" @click="remove">删除模板</button></template
    ><AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load" /><ClassTemplateForm
      v-else-if="item"
      :key="item.updatedAt"
      :initial="item"
      :readonly="!canManage"
      :on-submit="save"
  /></AppPage>
</template>
<style scoped>
.danger {
  padding: var(--space-2) var(--space-4);
  color: var(--color-danger);
  background: white;
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-button);
}
</style>
