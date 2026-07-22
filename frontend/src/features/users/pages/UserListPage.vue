<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchUsers } from '@/features/users/api';
import { UserFilters, UserList } from '@/features/users/components';
import { AppEmpty, AppError, AppLoading, AppPage } from '@/app/components';
import type { UserRole } from '@/features/auth';
import type { UserDto, UserListRequestDto } from '@/features/users/model';

const route = useRoute();
const router = useRouter();
const users = ref<UserDto[]>([]);
const loading = ref(true);
const error = ref('');
const page = ref(Math.max(1, Number(route.query.page) || 1));
const pageSize = 20;
const total = ref(0);
const filters = ref<{ search?: string; role?: UserRole; isActive?: boolean }>({
  search: typeof route.query.search === 'string' ? route.query.search : undefined,
  role: typeof route.query.role === 'string' ? (route.query.role as UserRole) : undefined,
  isActive: route.query.isActive === undefined ? undefined : route.query.isActive === 'true',
});
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize)));

async function loadUsers() {
  loading.value = true;
  error.value = '';
  const params: UserListRequestDto = {
    search: filters.value.search,
    role: filters.value.role,
    is_active: filters.value.isActive,
    page: page.value,
    page_size: pageSize,
  };
  try {
    const result = await fetchUsers(params);
    users.value = result.items;
    total.value = result.total;
    await router.replace({
      query: {
        search: filters.value.search,
        role: filters.value.role,
        isActive: filters.value.isActive === undefined ? undefined : String(filters.value.isActive),
        page: page.value > 1 ? String(page.value) : undefined,
      },
    });
  } catch {
    error.value = '加载用户列表失败';
  } finally {
    loading.value = false;
  }
}

function applyFilters(value: { search?: string; role?: UserRole; isActive?: boolean }) {
  filters.value = value;
  page.value = 1;
  void loadUsers();
}
function changePage(next: number) {
  page.value = next;
  void loadUsers();
}
onMounted(loadUsers);
</script>

<template>
  <AppPage title="用户管理">
    <template #header-extra>
      <RouterLink class="create-link" :to="{ name: 'users-create' }">创建用户</RouterLink>
    </template>
    <UserFilters
      :search="filters.search"
      :role="filters.role"
      :active="filters.isActive === undefined ? '' : (String(filters.isActive) as 'true' | 'false')"
      @apply="applyFilters"
    />
    <AppLoading v-if="loading" />
    <AppError v-else-if="error" :message="error" :show-retry="true" @retry="loadUsers" />
    <AppEmpty v-else-if="users.length === 0" description="暂无用户数据" />
    <template v-else>
      <UserList :users="users" @select="(user) => router.push(`/admin/users/${user.id}`)" />
      <nav class="pagination" aria-label="用户分页">
        <button :disabled="page <= 1" @click="changePage(page - 1)">上一页</button>
        <span>第 {{ page }} / {{ pageCount }} 页，共 {{ total }} 人</span>
        <button :disabled="page >= pageCount" @click="changePage(page + 1)">下一页</button>
      </nav>
    </template>
  </AppPage>
</template>

<style scoped>
.create-link {
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border-radius: var(--radius-button);
  text-decoration: none;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-4);
}
.pagination button {
  padding: var(--space-2) var(--space-3);
}
</style>
