<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ApiError } from '@/shared/api';
import { validateChangePassword } from '@/features/auth/model/change-password.schema';

const props = defineProps<{
  onSubmit: (oldPassword: string, newPassword: string) => Promise<void>;
}>();
const emit = defineEmits<{ success: [] }>();
const form = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' });
const errors = ref<Record<string, string>>({});
const serverError = ref('');
const submitting = ref(false);

async function submit() {
  errors.value = {};
  serverError.value = '';
  errors.value = validateChangePassword(form);
  if (Object.keys(errors.value).length) return;
  submitting.value = true;
  try {
    await props.onSubmit(form.oldPassword, form.newPassword);
    emit('success');
  } catch (error) {
    serverError.value = error instanceof ApiError ? error.message : '修改密码失败，请稍后重试';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <form class="password-form" novalidate @submit.prevent="submit">
    <p v-if="serverError" class="password-form__error" role="alert">{{ serverError }}</p>
    <label
      >当前密码<input v-model="form.oldPassword" type="password" autocomplete="current-password"
    /></label>
    <small v-if="errors.oldPassword">{{ errors.oldPassword }}</small>
    <label
      >新密码<input v-model="form.newPassword" type="password" autocomplete="new-password"
    /></label>
    <small v-if="errors.newPassword">{{ errors.newPassword }}</small>
    <label
      >确认新密码<input v-model="form.confirmPassword" type="password" autocomplete="new-password"
    /></label>
    <small v-if="errors.confirmPassword">{{ errors.confirmPassword }}</small>
    <button type="submit" :disabled="submitting">{{ submitting ? '提交中…' : '修改密码' }}</button>
  </form>
</template>

<style scoped>
.password-form {
  display: grid;
  gap: var(--space-3);
  max-width: 480px;
  padding: var(--space-5);
  background: var(--color-surface);
  border-radius: var(--radius-card);
}
label {
  display: grid;
  gap: var(--space-1);
  font-size: var(--text-sm);
}
input {
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
small,
.password-form__error {
  color: var(--color-error);
}
button {
  padding: var(--space-3);
  border: 0;
  border-radius: var(--radius-button);
  color: var(--color-text-inverse);
  background: var(--color-brand);
}
</style>
