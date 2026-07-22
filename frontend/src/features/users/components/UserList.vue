<script setup lang="ts">
/**
 * 用户列表组件 — 展示用户卡片，支持搜索和角色筛选。
 */
import { ROLE_LABELS } from '@/features/auth';
import type { UserDto } from '@/features/users/model';

defineProps<{
  users: UserDto[];
  loading?: boolean;
}>();

defineEmits<{
  select: [user: UserDto];
}>();
</script>

<template>
  <div class="user-list">
    <div v-if="loading" class="user-list__loading">加载中...</div>
    <div v-else-if="users.length === 0" class="user-list__empty">暂无用户</div>
    <div
      v-for="user in users"
      :key="user.id"
      class="user-list__item"
      @click="$emit('select', user)"
    >
      <div class="user-list__info">
        <span class="user-list__name">{{ user.name }}</span>
        <span class="user-list__phone">{{ user.phone }}</span>
      </div>
      <span class="user-list__meta"
        ><span v-if="!user.isActive" class="user-list__inactive">已停用</span
        ><span class="user-list__role">{{ ROLE_LABELS[user.role] }}</span></span
      >
    </div>
  </div>
</template>

<style scoped>
.user-list {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-xs);
}

.user-list__loading,
.user-list__empty {
  padding: var(--space-8);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}

.user-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.user-list__item:hover {
  background: var(--color-brand-light);
}

.user-list__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-list__name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.user-list__phone {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.user-list__role {
  font-size: var(--text-xs);
  padding: 2px var(--space-2);
  border-radius: var(--radius-tag);
  background: var(--color-brand-light);
  color: var(--color-brand);
}
.user-list__meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.user-list__inactive {
  padding: 2px var(--space-2);
  font-size: var(--text-xs);
  color: var(--color-danger);
  background: var(--color-error-bg);
  border-radius: var(--radius-tag);
}
@media (max-width: 640px) {
  .user-list {
    border-inline: 0;
    border-radius: 0;
    box-shadow: none;
  }
  .user-list__item {
    padding-inline: 0;
  }
}
</style>
