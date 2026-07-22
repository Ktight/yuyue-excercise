<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ApiError } from '@/shared/api';
import type { Store, StoreWriteInput } from '../model';
import { validateStore } from '../model';
const props = defineProps<{
  initial?: Store;
  onSubmit: (data: StoreWriteInput) => Promise<void>;
}>();
const emit = defineEmits<{ success: [] }>();
const form = reactive<StoreWriteInput>({
  name: props.initial?.name ?? '',
  address: props.initial?.address ?? '',
  phone: props.initial?.phone ?? '',
  businessHours: props.initial?.businessHours ?? '07:00-22:00',
  status: props.initial?.status ?? 'active',
});
const error = ref('');
const submitting = ref(false);
async function submit() {
  const errors = validateStore(form);
  if (errors[0]) {
    error.value = errors[0];
    return;
  }
  submitting.value = true;
  error.value = '';
  try {
    await props.onSubmit({
      ...form,
      name: form.name.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      businessHours: form.businessHours.trim(),
    });
    emit('success');
  } catch (cause) {
    error.value = cause instanceof ApiError ? cause.message : '保存失败';
  } finally {
    submitting.value = false;
  }
}
</script>
<template>
  <form class="form-card" @submit.prevent="submit">
    <p v-if="error" role="alert">{{ error }}</p>
    <label>门店名称 *<input v-model="form.name" :disabled="submitting" /></label
    ><label>地址 *<input v-model="form.address" :disabled="submitting" /></label
    ><label>联系电话 *<input v-model="form.phone" :disabled="submitting" /></label
    ><label
      >营业时间 *<input
        v-model="form.businessHours"
        placeholder="07:00-22:00"
        :disabled="submitting" /></label
    ><button :disabled="submitting">{{ submitting ? '保存中…' : '保存' }}</button>
  </form>
</template>
<style scoped>
.form-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 480px;
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
}
label {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
input,
button {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
[role='alert'] {
  color: var(--color-error);
}
</style>
