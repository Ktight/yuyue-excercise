<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ApiError } from '@/shared/api';
const props = defineProps<{
  initial?: { name?: string; address?: string; phone?: string };
  companyId?: string;
  onSubmit: (data: { name: string; address: string; phone: string }) => Promise<void>;
}>();
const emit = defineEmits<{ success: [] }>();
const form = reactive({
  name: props.initial?.name || '',
  address: props.initial?.address || '',
  phone: props.initial?.phone || '',
});
const serverError = ref('');
const submitting = ref(false);
async function handleSubmit() {
  if (!form.name.trim()) {
    serverError.value = '请输入门店名称';
    return;
  }
  submitting.value = true;
  serverError.value = '';
  try {
    await props.onSubmit({ ...form, name: form.name.trim() });
    emit('success');
  } catch (e) {
    serverError.value = e instanceof ApiError ? e.message : '保存失败';
  } finally {
    submitting.value = false;
  }
}
</script>
<template>
  <form class="store-form" novalidate @submit.prevent="handleSubmit">
    <div v-if="serverError" class="store-form__error" role="alert">{{ serverError }}</div>
    <label
      ><span>门店名称 *</span
      ><input
        v-model="form.name"
        class="store-form__input"
        :disabled="submitting"
        placeholder="请输入门店名称"
    /></label>
    <label
      ><span>地址</span
      ><input
        v-model="form.address"
        class="store-form__input"
        :disabled="submitting"
        placeholder="请输入地址"
    /></label>
    <label
      ><span>电话</span
      ><input
        v-model="form.phone"
        class="store-form__input"
        :disabled="submitting"
        placeholder="请输入电话"
    /></label>
    <button class="store-form__submit" type="submit" :disabled="submitting">
      {{ submitting ? '保存中...' : '保存' }}
    </button>
  </form>
</template>
<style scoped>
.store-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  max-width: 480px;
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
.store-form__error {
  padding: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-error-600);
  background: var(--color-error-50);
  border-radius: var(--radius-md);
}
.store-form label {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-size: var(--text-sm);
}
.store-form__input {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  outline: none;
}
.store-form__input:focus {
  border-color: var(--color-border-focus);
}
.store-form__submit {
  margin-top: var(--space-2);
  padding: var(--space-3);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border: none;
  border-radius: var(--radius-button);
  cursor: pointer;
}
.store-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
