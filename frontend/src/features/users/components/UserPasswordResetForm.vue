<script setup lang="ts">
import { ref } from 'vue';
import { getErrorMessage } from '@/shared/api';
import { confirmAction } from '@/app/components';
const props = defineProps<{ onSubmit: (password: string) => Promise<void> }>();
const password = ref(''),
  confirmation = ref(''),
  saving = ref(false),
  error = ref(''),
  completed = ref(false);
async function submit() {
  completed.value = false;
  if (password.value.length < 8) {
    error.value = '新密码至少 8 位';
    return;
  }
  if (password.value !== confirmation.value) {
    error.value = '两次输入的密码不一致';
    return;
  }
  if (
    !(await confirmAction({
      title: '重置登录密码',
      message: '重置后请通过安全渠道单独告知用户，并要求用户尽快修改临时密码。',
      confirmText: '确认重置',
      danger: true,
    }))
  )
    return;
  saving.value = true;
  error.value = '';
  try {
    await props.onSubmit(password.value);
    password.value = '';
    confirmation.value = '';
    completed.value = true;
  } catch (cause) {
    error.value = getErrorMessage(cause, '重置密码失败');
  } finally {
    saving.value = false;
  }
}
</script>
<template>
  <form class="reset-form" @submit.prevent="submit">
    <h2>重置登录密码</h2>
    <p>设置临时密码后，请通过安全渠道单独告知用户。</p>
    <label>新密码<input v-model="password" type="password" minlength="8" required /></label>
    <label>再次输入<input v-model="confirmation" type="password" minlength="8" required /></label>
    <p v-if="completed" role="status">密码已重置。</p>
    <p v-if="error" role="alert">{{ error }}</p>
    <button :disabled="saving">{{ saving ? '处理中…' : '重置密码' }}</button>
  </form>
</template>
<style scoped>
.reset-form {
  display: grid;
  gap: var(--space-3);
  max-width: 600px;
  margin-top: var(--space-6);
}
.reset-form h2,
.reset-form p {
  margin: 0;
}
.reset-form > p:not([role]) {
  color: var(--color-text-secondary);
}
label {
  display: grid;
  gap: var(--space-1);
}
input,
button {
  padding: var(--space-3);
}
button {
  color: var(--color-danger);
  background: var(--color-surface);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-button);
}
</style>
