<script setup lang="ts">
import type { Store } from '@/features/stores/model';
defineProps<{ stores: Store[]; loading?: boolean }>();
defineEmits<{ select: [store: Store] }>();
</script>
<template>
  <div class="store-list">
    <div v-if="loading" class="store-list__msg">加载中...</div>
    <div v-else-if="stores.length === 0" class="store-list__msg">暂无门店</div>
    <div v-for="s in stores" :key="s.id" class="store-list__item" @click="$emit('select', s)">
      <div>
        <div class="store-list__name">{{ s.name }}</div>
        <div class="store-list__addr">{{ s.address || '暂无地址' }}</div>
      </div>
      <span class="store-list__status" :class="{ 'is-inactive': s.status === 'inactive' }">{{
        s.status === 'active' ? '运营中' : '已停用'
      }}</span>
    </div>
  </div>
</template>
<style scoped>
.store-list {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
.store-list__msg {
  padding: var(--space-8);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}
.store-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
}
.store-list__item:hover {
  background: var(--color-brand-light);
}
.store-list__name {
  font-weight: var(--font-medium);
}
.store-list__addr {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-top: 2px;
}
.store-list__status {
  font-size: var(--text-xs);
  padding: 2px var(--space-2);
  border-radius: var(--radius-tag);
  background: var(--color-success-50);
  color: var(--color-success-600);
}
.store-list__status.is-inactive {
  background: var(--color-neutral-100);
  color: var(--color-text-tertiary);
}
</style>
