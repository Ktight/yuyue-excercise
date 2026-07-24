<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useUnsavedChangesGuard } from '@/app/composables';
import { ApiError } from '@/shared/api';
import type { Company, CompanyWriteInput } from '../model';
import { validateCompany } from '../model';
const props = defineProps<{
  initial?: Company;
  onSubmit: (data: CompanyWriteInput) => Promise<void>;
}>();
const emit = defineEmits<{ success: [] }>();
const form = reactive<CompanyWriteInput>({
  name: props.initial?.name ?? '',
  contactPerson: props.initial?.contactPerson ?? '',
  contactPhone: props.initial?.contactPhone ?? '',
  contractStart: props.initial?.contractStart ?? '',
  contractEnd: props.initial?.contractEnd ?? '',
  status: props.initial?.status ?? 'active',
});
const { runGuardedSubmit } = useUnsavedChangesGuard({ source: () => form });
const error = ref('');
const submitting = ref(false);
async function submit() {
  const errors = validateCompany(form);
  if (errors[0]) {
    error.value = errors[0].message;
    return;
  }
  error.value = '';
  submitting.value = true;
  try {
    await runGuardedSubmit(() =>
      props.onSubmit({
        ...form,
        name: form.name.trim(),
        contactPerson: form.contactPerson.trim(),
        contactPhone: form.contactPhone.trim(),
      }),
    );
    emit('success');
  } catch (cause) {
    error.value = cause instanceof ApiError ? cause.message : '保存失败';
  } finally {
    submitting.value = false;
  }
}
</script>
<template>
  <form class="form-card" novalidate @submit.prevent="submit">
    <p v-if="error" role="alert">{{ error }}</p>
    <label>公司名称 *<input v-model="form.name" :disabled="submitting" /></label
    ><label>联系人 *<input v-model="form.contactPerson" :disabled="submitting" /></label
    ><label>联系电话 *<input v-model="form.contactPhone" :disabled="submitting" /></label
    ><label
      >合同开始日期 *<input
        v-model="form.contractStart"
        type="date"
        :disabled="submitting" /></label
    ><label
      >合同结束日期 *<input v-model="form.contractEnd" type="date" :disabled="submitting" /></label
    ><button :disabled="submitting">{{ submitting ? '保存中…' : '保存' }}</button>
  </form>
</template>
<style scoped>
.form-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 560px;
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
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
button {
  min-height: var(--control-height-lg);
  margin-top: var(--space-2);
  font-weight: var(--font-semibold);
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border-color: var(--color-brand);
}
[role='alert'] {
  color: var(--color-error);
}
</style>
