<script setup lang="ts">
/**
 * 用户列表页面 — 组装 UserList + API + 状态。
 */
import { onMounted, ref } from 'vue';
import { fetchUsers } from '@/features/users/api';
import { UserList } from '@/features/users/components';
import { AppPage, AppLoading, AppEmpty, AppError } from '@/app/components';
import type { UserDto, UserListRequestDto } from '@/features/users/model';

const users = ref<UserDto[]>([]);
const loading = ref(true);
const error = ref('');
const search = ref('');

async function loadUsers(params?: UserListRequestDto) {
  loading.value = true;
  error.value = '';
  try {
    const result = await fetchUsers(params);
    users.value = result.items;
  } catch {
    error.value = '加载用户列表失败';
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  loadUsers({ search: search.value.trim() || undefined });
}

onMounted(() => loadUsers());
</script>

<template>
  <AppPage title="用户管理">
    <template #header-extra>
      <input
        v-model="search"
        class="user-list-page__search"
        placeholder="搜索姓名或手机号..."
        @keyup.enter="handleSearch"
      />
    </template>

    <AppLoading v-if="loading" />
    <AppError v-else-if="error" :message="error" :show-retry="true" @retry="loadUsers()" />
    <AppEmpty v-else-if="users.length === 0" description="暂无用户数据" />
    <UserList v-else :users="users" />
  </AppPage>
</template>

<style scoped>
.user-list-page__search {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  outline: none;
  width: 200px;
}
.user-list-page__search:focus {
  border-color: var(--color-border-focus);
}
</style>
