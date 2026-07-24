<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useUnsavedChangesGuard } from '@/app/composables';
import { ROLE_LABELS, USER_ROLES, type UserRole } from '@/features/auth';
import { fetchStores, StoreSelect, type Store } from '@/features/stores';
import type { UserDto, UserUpdateRequestDto } from '@/features/users/model';
import { getErrorMessage } from '@/shared/api';

const props = defineProps<{
  user: UserDto;
  onSubmit: (value: UserUpdateRequestDto) => Promise<void>;
}>();
const saving = ref(false);
const error = ref('');
const stores = ref<Store[]>([]);
const form = reactive({
  name: props.user.name,
  role: props.user.role,
  storeId: props.user.storeId,
  isActive: props.user.isActive,
});
const { runGuardedSubmit } = useUnsavedChangesGuard({ source: () => form });
const storeRoles: UserRole[] = ['store_manager', 'trainer'];
onMounted(async () => {
  try {
    stores.value = (await fetchStores({ pageSize: 100 })).items;
  } catch {
    error.value = '门店选项加载失败';
  }
});

async function submit() {
  if (!form.name.trim()) {
    error.value = '请输入姓名';
    return;
  }
  saving.value = true;
  error.value = '';
  try {
    await runGuardedSubmit(() =>
      props.onSubmit({
        name: form.name.trim(),
        role: form.role,
        storeId: storeRoles.includes(form.role) ? form.storeId : null,
        isActive: form.isActive,
      }),
    );
  } catch (cause) {
    error.value = getErrorMessage(cause, '保存用户失败');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form class="user-edit" @submit.prevent="submit">
    <p class="user-edit__hint">手机号 {{ user.phone }} 不允许在账户编辑中修改。</p>
    <label>姓名<input v-model="form.name" :disabled="saving" required /></label>
    <label
      >角色<select v-model="form.role" :disabled="saving">
        <option v-for="role in USER_ROLES" :key="role" :value="role">
          {{ ROLE_LABELS[role] }}
        </option>
      </select></label
    >
    <StoreSelect
      v-if="storeRoles.includes(form.role)"
      v-model="form.storeId"
      :stores="stores"
      :disabled="saving"
    />
    <label class="user-edit__switch"
      ><input v-model="form.isActive" type="checkbox" :disabled="saving" />允许该用户登录</label
    >
    <p v-if="error" role="alert">{{ error }}</p>
    <button class="user-edit__submit" :disabled="saving">
      {{ saving ? '保存中…' : '保存用户资料' }}
    </button>
  </form>
</template>

<style scoped>
.user-edit {
  display: grid;
  gap: var(--space-4);
  max-width: 600px;
}
label {
  display: grid;
  gap: var(--space-1);
  color: var(--color-text-secondary);
}
input,
select {
  padding: var(--space-3);
}
.user-edit__hint {
  margin: 0;
  color: var(--color-text-tertiary);
}
.user-edit__switch {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.user-edit__switch input {
  min-height: auto;
}
.user-edit__submit {
  min-height: var(--control-height-lg);
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border: 0;
  border-radius: var(--radius-button);
}
</style>
