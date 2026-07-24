<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AppError, AppLoading, AppPage, AppPagination, confirmAction } from '@/app/components';
import { getErrorMessage } from '@/shared/api';
import { config } from '@/shared/config';
import { dismissReminder, listReminders, markReminderRead } from '../api';
import { ReminderList } from '../components';
import type { ReminderItem } from '../model';

const items = ref<ReminderItem[]>([]),
  loading = ref(true),
  error = ref(''),
  actionError = ref(''),
  busyId = ref<number | null>(null),
  unreadOnly = ref(false),
  page = ref(1),
  pageSize = ref(20),
  total = ref(0);

async function load() {
  loading.value = true;
  error.value = '';
  actionError.value = '';
  try {
    const result = await listReminders({
      page: page.value,
      pageSize: pageSize.value,
      unreadOnly: unreadOnly.value,
    });
    items.value = result.items;
    page.value = result.page;
    pageSize.value = result.pageSize;
    total.value = result.total;
  } catch (cause) {
    error.value = getErrorMessage(cause, '提醒列表加载失败，请稍后重试');
  } finally {
    loading.value = false;
  }
}

async function refreshAfterRemovalFromCurrentPage() {
  if (items.value.length === 1 && page.value > 1) page.value -= 1;
  await load();
}

async function markRead(id: number) {
  if (busyId.value !== null) return;
  busyId.value = id;
  actionError.value = '';
  try {
    const updated = await markReminderRead(id);
    if (unreadOnly.value) {
      await refreshAfterRemovalFromCurrentPage();
    } else {
      const index = items.value.findIndex((item) => item.id === id);
      if (index >= 0) items.value[index] = updated;
    }
  } catch (cause) {
    actionError.value = getErrorMessage(cause, '标记已读失败，请稍后重试');
  } finally {
    busyId.value = null;
  }
}

async function dismiss(id: number) {
  if (busyId.value !== null) return;
  const confirmed = await confirmAction({
    title: '忽略提醒',
    message: '忽略后该提醒不会再次出现，此操作不可撤销。',
    confirmText: '确认忽略',
    danger: true,
  });
  if (!confirmed) return;
  busyId.value = id;
  actionError.value = '';
  try {
    await dismissReminder(id);
    await refreshAfterRemovalFromCurrentPage();
  } catch (cause) {
    actionError.value = getErrorMessage(cause, '忽略提醒失败，请稍后重试');
  } finally {
    busyId.value = null;
  }
}

async function changeUnreadOnly() {
  page.value = 1;
  await load();
}

async function changePage(nextPage: number) {
  if (loading.value || busyId.value !== null) return;
  page.value = nextPage;
  await load();
}

onMounted(load);
</script>
<template>
  <AppPage title="提醒中心"
    ><template #header-extra
      ><label
        ><input
          v-model="unreadOnly"
          :disabled="loading || busyId !== null"
          type="checkbox"
          @change="changeUnreadOnly"
        />
        仅看未读</label
      ></template
    >
    <p v-if="config.enableMock" class="provisional">
      演示数据 · 分页、未读筛选和动作响应已按正式契约实现
    </p>
    <p v-if="actionError" class="action-error" role="alert">{{ actionError }}</p>
    <AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load"
    />
    <template v-else>
      <ReminderList
        :items="items"
        :busy-id="busyId"
        :disabled="busyId !== null"
        @read="markRead"
        @dismiss="dismiss"
      />
      <AppPagination
        :page="page"
        :page-size="pageSize"
        :total="total"
        :disabled="busyId !== null"
        @change="changePage"
      />
    </template>
  </AppPage>
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
.action-error {
  padding: var(--space-3);
  color: var(--color-error);
  background: var(--color-error-light, #fff1f0);
  border: 1px solid currentColor;
  border-radius: var(--radius-md);
}
</style>
