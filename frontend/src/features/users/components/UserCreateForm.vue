<script setup lang="ts">
/**
 * 创建用户表单 — 基础字段，门店联动在 Phase 3 完成。
 */
import { reactive, ref, watch } from 'vue';
import { validateUserCreateForm } from '@/features/users/model/user-create.schema';
import { ROLE_LABELS, USER_ROLES } from '@/features/auth';
import type { UserRole } from '@/features/auth';
import { ApiError } from '@/shared/api';
import { StoreSelect, type Store } from '@/features/stores';

const props = defineProps<{
  onSubmit: (data: {
    name: string;
    phone: string;
    password: string;
    role: UserRole;
    storeId?: number | null;
  }) => Promise<void>;
  stores: Store[];
}>();

const emit = defineEmits<{
  success: [];
}>();

const roles = USER_ROLES.map((value) => ({ value, label: ROLE_LABELS[value] }));

const form = reactive({
  name: '',
  phone: '',
  password: '',
  role: 'trainer' as UserRole,
  storeId: null as number | null,
});
const fieldErrors = reactive<Record<string, string>>({});
const serverError = ref('');
const submitting = ref(false);
const supportsStore = () => form.role === 'store_manager' || form.role === 'trainer';
watch(
  () => form.role,
  () => {
    if (!supportsStore()) form.storeId = null;
  },
);

function clearErrors() {
  serverError.value = '';
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k]);
}

async function handleSubmit() {
  clearErrors();
  const errors = validateUserCreateForm(form);
  if (errors.length > 0) {
    for (const e of errors) fieldErrors[e.field] = e.message;
    return;
  }
  submitting.value = true;
  try {
    await props.onSubmit({ ...form, phone: form.phone.trim(), name: form.name.trim() });
    emit('success');
  } catch (error) {
    if (error instanceof ApiError) {
      serverError.value = error.message;
      // 字段级错误
      if (error.fieldErrors) {
        for (const [field, msgs] of Object.entries(error.fieldErrors)) {
          const target = field === 'store_id' ? 'storeId' : field;
          if (['name', 'phone', 'password', 'role', 'storeId'].includes(target)) {
            fieldErrors[target] = msgs[0] || '';
          }
        }
      }
    } else {
      serverError.value = '创建失败，请稍后重试';
    }
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <form class="user-create-form" novalidate @submit.prevent="handleSubmit">
    <div v-if="serverError" class="user-create-form__server-error" role="alert">
      {{ serverError }}
    </div>

    <label class="user-create-form__field">
      <span>姓名</span>
      <input
        v-model="form.name"
        class="user-create-form__input"
        :class="{ 'has-error': fieldErrors.name }"
        :disabled="submitting"
        placeholder="请输入姓名"
      />
      <span v-if="fieldErrors.name" class="user-create-form__error">{{ fieldErrors.name }}</span>
    </label>

    <label v-if="supportsStore()" class="user-create-form__field">
      <span>所属门店{{ form.role === 'store_manager' ? ' *' : '' }}</span>
      <StoreSelect
        v-model="form.storeId"
        :stores="stores"
        :required="form.role === 'store_manager'"
        :disabled="submitting"
      />
      <span v-if="fieldErrors.storeId" class="user-create-form__error">{{
        fieldErrors.storeId
      }}</span>
    </label>

    <label class="user-create-form__field">
      <span>手机号</span>
      <input
        v-model="form.phone"
        class="user-create-form__input"
        :class="{ 'has-error': fieldErrors.phone }"
        type="tel"
        maxlength="11"
        :disabled="submitting"
        placeholder="请输入手机号"
      />
      <span v-if="fieldErrors.phone" class="user-create-form__error">{{ fieldErrors.phone }}</span>
    </label>

    <label class="user-create-form__field">
      <span>密码</span>
      <input
        v-model="form.password"
        class="user-create-form__input"
        :class="{ 'has-error': fieldErrors.password }"
        type="password"
        :disabled="submitting"
        placeholder="至少 8 位"
      />
      <span v-if="fieldErrors.password" class="user-create-form__error">
        {{ fieldErrors.password }}
      </span>
    </label>

    <label class="user-create-form__field">
      <span>角色</span>
      <select v-model="form.role" class="user-create-form__input" :disabled="submitting">
        <option v-for="r in roles" :key="r.value" :value="r.value">{{ r.label }}</option>
      </select>
    </label>

    <button class="user-create-form__submit" type="submit" :disabled="submitting">
      {{ submitting ? '创建中...' : '创建用户' }}
    </button>
  </form>
</template>

<style scoped>
.user-create-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  max-width: 520px;
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
.user-create-form__server-error {
  padding: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-error-600);
  background: var(--color-error-50);
  border-radius: var(--radius-md);
}
.user-create-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-size: var(--text-sm);
}
.user-create-form__input {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  outline: none;
}
.user-create-form__input:focus {
  border-color: var(--color-border-focus);
}
.user-create-form__input.has-error {
  border-color: var(--color-error);
}
.user-create-form__error {
  font-size: var(--text-xs);
  color: var(--color-error);
}
.user-create-form__submit {
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
.user-create-form__submit:hover:not(:disabled) {
  background: var(--color-brand-hover);
}
.user-create-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
