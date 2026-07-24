<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { AppError, AppLoading, AppPage } from '@/app/components';
import { dismissReminder, listReminders, markReminderRead } from '../api';
import { ReminderList } from '../components';
import type { ReminderItem } from '../model';
const items = ref<ReminderItem[]>([]),
  loading = ref(true),
  error = ref(''),
  busyId = ref<number | null>(null),
  unreadOnly = ref(false);
const visibleItems = computed(() =>
  unreadOnly.value ? items.value.filter((item) => !item.read) : items.value,
);
async function load() {
  loading.value = true;
  error.value = '';
  try {
    items.value = await listReminders();
  } catch {
    error.value = '提醒契约尚未冻结，当前真实接口无法安全解析';
  } finally {
    loading.value = false;
  }
}
async function markRead(id: number) {
  busyId.value = id;
  try {
    await markReminderRead(id);
    const item = items.value.find((v) => v.id === id);
    if (item) item.read = true;
  } finally {
    busyId.value = null;
  }
}
async function dismiss(id: number) {
  busyId.value = id;
  try {
    await dismissReminder(id);
    items.value = items.value.filter((v) => v.id !== id);
  } finally {
    busyId.value = null;
  }
}
onMounted(load);
</script>
<template>
  <AppPage title="提醒中心"
    ><template #header-extra
      ><label><input v-model="unreadOnly" type="checkbox" /> 仅看未读</label></template
    >
    <p class="provisional">演示数据 · 正式字段、权限和动作语义等待 Phase 11 契约冻结</p>
    <AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load" /><ReminderList
      v-else
      :items="visibleItems"
      :busy-id="busyId"
      @read="markRead"
      @dismiss="dismiss"
  /></AppPage>
</template>
<style scoped>
.provisional {
  padding: var(--space-3);
  color: var(--color-text-secondary);
  background: var(--color-brand-light);
  border-radius: var(--radius-md);
}
label {
  font-size: var(--text-sm);
}
</style>
