<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

const props = defineProps<{
  /** 是否显示弹窗 */
  visible: boolean;
  /** 标题 */
  title?: string;
  /** 内容 */
  message?: string;
  /** 确认按钮文字 */
  confirmText?: string;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 是否为危险操作（确认按钮变红） */
  danger?: boolean;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const dialog = ref<{ focus: () => void } | null>(null);

watch(
  () => props.visible,
  async (visible) => {
    if (!visible) return;
    await nextTick();
    dialog.value?.focus();
  },
);
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="app-confirm-overlay" @click.self="emit('cancel')">
      <div
        ref="dialog"
        class="app-confirm"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? 'app-confirm-title' : undefined"
        :aria-label="title ? undefined : '确认操作'"
        tabindex="-1"
        @keydown.esc="emit('cancel')"
      >
        <h3 v-if="title" id="app-confirm-title" class="app-confirm__title">{{ title }}</h3>
        <p v-if="message" class="app-confirm__message">{{ message }}</p>
        <div class="app-confirm__actions">
          <button
            type="button"
            class="app-confirm__btn app-confirm__btn--cancel"
            @click="emit('cancel')"
          >
            {{ cancelText || '取消' }}
          </button>
          <button
            type="button"
            class="app-confirm__btn app-confirm__btn--confirm"
            :class="{ 'app-confirm__btn--danger': danger }"
            @click="emit('confirm')"
          >
            {{ confirmText || '确认' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.app-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  padding: var(--space-4);
}

.app-confirm {
  background: var(--color-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-lg);
  padding: var(--space-6);
  max-width: 400px;
  width: 100%;
}

.app-confirm__title {
  margin: 0 0 var(--space-3);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.app-confirm__message {
  margin: 0 0 var(--space-6);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

.app-confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

.app-confirm__btn {
  padding: var(--space-2) var(--space-5);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border-radius: var(--radius-button);
  border: none;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.app-confirm__btn--cancel {
  color: var(--color-text-secondary);
  background: var(--color-neutral-100);
}

.app-confirm__btn--cancel:hover {
  background: var(--color-neutral-200);
}

.app-confirm__btn--confirm {
  color: var(--color-text-inverse);
  background: var(--color-brand);
}

.app-confirm__btn--confirm:hover {
  background: var(--color-brand-hover);
}

.app-confirm__btn--danger {
  background: var(--color-error);
}

.app-confirm__btn--danger:hover {
  background: var(--color-error-600);
}
</style>
