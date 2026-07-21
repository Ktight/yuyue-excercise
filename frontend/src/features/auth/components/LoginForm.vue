<script setup lang="ts">
/**
 * 登录表单 — 只负责输入和提交事件，不处理路由跳转。
 * 通过 onSubmit prop 接收异步提交函数，可捕获服务端错误。
 */
import { reactive, ref } from 'vue';
import { validateLoginForm } from '@/features/auth/model/login.schema';
import type { FieldError } from '@/features/auth/model/login.schema';
import { ApiError } from '@/shared/api';

const props = defineProps<{
  /** 异步提交函数，由父组件（登录页）注入 */
  onSubmit: (phone: string, password: string) => Promise<void>;
}>();

const form = reactive({ phone: '', password: '' });
const fieldErrors = reactive<Record<string, string>>({});
const serverError = ref('');
const submitting = ref(false);

function clearErrors() {
  serverError.value = '';
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k]);
}

function applyFieldErrors(errors: FieldError[]) {
  for (const e of errors) {
    fieldErrors[e.field] = e.message;
  }
}

async function handleSubmit() {
  clearErrors();

  const errors = validateLoginForm(form);
  if (errors.length > 0) {
    applyFieldErrors(errors);
    return;
  }

  submitting.value = true;
  try {
    await props.onSubmit(form.phone.trim(), form.password);
  } catch (error) {
    if (error instanceof ApiError) {
      serverError.value = error.message;
    } else {
      serverError.value = '登录失败，请稍后重试';
    }
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <form class="login-form" novalidate @submit.prevent="handleSubmit">
    <div v-if="serverError" class="login-form__server-error" role="alert">
      {{ serverError }}
    </div>

    <label class="login-form__field">
      <span class="login-form__label">手机号</span>
      <input
        v-model="form.phone"
        class="login-form__input"
        :class="{ 'has-error': fieldErrors.phone }"
        type="tel"
        autocomplete="tel"
        placeholder="请输入手机号"
        maxlength="11"
        :disabled="submitting"
      />
      <span v-if="fieldErrors.phone" class="login-form__error">{{ fieldErrors.phone }}</span>
    </label>

    <label class="login-form__field">
      <span class="login-form__label">密码</span>
      <input
        v-model="form.password"
        class="login-form__input"
        :class="{ 'has-error': fieldErrors.password }"
        type="password"
        autocomplete="current-password"
        placeholder="请输入密码"
        :disabled="submitting"
      />
      <span v-if="fieldErrors.password" class="login-form__error">
        {{ fieldErrors.password }}
      </span>
    </label>

    <button class="login-form__submit" type="submit" :disabled="submitting">
      {{ submitting ? '登录中...' : '登录' }}
    </button>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  max-width: 360px;
}

.login-form__server-error {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-error-600);
  background: var(--color-error-50);
  border-radius: var(--radius-md);
}

.login-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.login-form__label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.login-form__input {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  outline: none;
  transition: border-color var(--transition-fast);
}

.login-form__input:focus {
  border-color: var(--color-border-focus);
}

.login-form__input.has-error {
  border-color: var(--color-error);
}

.login-form__error {
  font-size: var(--text-xs);
  color: var(--color-error);
}

.login-form__submit {
  margin-top: var(--space-2);
  padding: var(--space-3);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border: none;
  border-radius: var(--radius-button);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.login-form__submit:hover:not(:disabled) {
  background: var(--color-brand-hover);
}

.login-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
