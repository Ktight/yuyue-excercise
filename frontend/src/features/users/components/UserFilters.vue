<script setup lang="ts">
import { reactive } from 'vue';
import { ROLE_LABELS, USER_ROLES, type UserRole } from '@/features/auth';

const props = defineProps<{ search?: string; role?: UserRole }>();
const emit = defineEmits<{ apply: [value: { search?: string; role?: UserRole }] }>();
const form = reactive({ search: props.search ?? '', role: props.role ?? '' });
function apply() {
  emit('apply', {
    search: form.search.trim() || undefined,
    role: (form.role || undefined) as UserRole | undefined,
  });
}
</script>

<template>
  <form class="user-filters" @submit.prevent="apply">
    <input v-model="form.search" aria-label="搜索用户" placeholder="搜索姓名或手机号" />
    <select v-model="form.role" aria-label="角色筛选">
      <option value="">全部角色</option>
      <option v-for="roleValue in USER_ROLES" :key="roleValue" :value="roleValue">
        {{ ROLE_LABELS[roleValue] }}
      </option>
    </select>
    <button type="submit">查询</button>
  </form>
</template>

<style scoped>
.user-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
input,
select,
button {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
button {
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border-color: var(--color-brand);
}
</style>
