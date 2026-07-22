<script setup lang="ts">
import type { Company } from '@/features/companies/model';

defineProps<{ companies: Company[]; loading?: boolean }>();
defineEmits<{ select: [company: Company] }>();
</script>

<template>
  <div class="company-list">
    <div v-if="loading" class="company-list__msg">加载中...</div>
    <div v-else-if="companies.length === 0" class="company-list__msg">暂无公司</div>
    <div v-for="c in companies" :key="c.id" class="company-list__item" @click="$emit('select', c)">
      <div>
        <div class="company-list__name">{{ c.name }}</div>
        <div class="company-list__addr">{{ c.contactPerson }} · {{ c.contactPhone }}</div>
      </div>
      <span class="company-list__status" :class="{ 'is-inactive': c.status === 'inactive' }">{{
        c.status === 'active' ? '运营中' : '已停用'
      }}</span>
    </div>
  </div>
</template>

<style scoped>
.company-list {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-xs);
}
.company-list__msg {
  padding: var(--space-8);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}
.company-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
}
.company-list__item:hover {
  background: var(--color-brand-light);
}
@media (max-width: 640px) {
  .company-list {
    border-inline: 0;
    border-radius: 0;
    box-shadow: none;
  }
  .company-list__item {
    padding-inline: 0;
  }
}
.company-list__name {
  font-weight: var(--font-medium);
}
.company-list__addr {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-top: 2px;
}
.company-list__status {
  font-size: var(--text-xs);
  padding: 2px var(--space-2);
  border-radius: var(--radius-tag);
  background: var(--color-success-50);
  color: var(--color-success-600);
}
.company-list__status.is-inactive {
  background: var(--color-neutral-100);
  color: var(--color-text-tertiary);
}
</style>
