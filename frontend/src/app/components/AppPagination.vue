<script setup lang="ts">
import { computed } from 'vue';
const props = withDefaults(
  defineProps<{ page: number; pageSize?: number; total: number; disabled?: boolean }>(),
  {
    pageSize: 20,
    disabled: false,
  },
);
defineEmits<{ change: [page: number] }>();
const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
</script>
<template>
  <nav v-if="total > pageSize" class="pagination" aria-label="分页">
    <button type="button" :disabled="disabled || page <= 1" @click="$emit('change', page - 1)">
      上一页
    </button>
    <span>第 {{ page }} / {{ pageCount }} 页，共 {{ total }} 条</span>
    <button
      type="button"
      :disabled="disabled || page >= pageCount"
      @click="$emit('change', page + 1)"
    >
      下一页
    </button>
  </nav>
</template>
<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-top: var(--space-5);
  color: var(--color-text-secondary);
}
button {
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  cursor: pointer;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
@media (max-width: 480px) {
  .pagination {
    justify-content: space-between;
    font-size: var(--text-sm);
  }
}
</style>
