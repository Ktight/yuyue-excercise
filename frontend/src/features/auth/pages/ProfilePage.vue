<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AppError, AppLoading, AppPage } from '@/app/components';
import { getProfile, updateProfile } from '@/features/auth/api';
import type { UserProfile } from '@/features/auth/model';
import { publishSession } from '@/shared/session';
const profile = ref<UserProfile | null>(null),
  name = ref(''),
  avatar = ref(''),
  loading = ref(true),
  saving = ref(false),
  error = ref(''),
  notice = ref('');
async function load() {
  loading.value = true;
  error.value = '';
  try {
    profile.value = await getProfile();
    name.value = profile.value.name;
    avatar.value = profile.value.avatar ?? '';
  } catch {
    error.value = '个人资料加载失败';
  } finally {
    loading.value = false;
  }
}
async function save() {
  if (!name.value.trim()) return;
  saving.value = true;
  error.value = '';
  notice.value = '';
  try {
    profile.value = await updateProfile({
      name: name.value.trim(),
      avatar: avatar.value.trim() || null,
    });
    publishSession({ name: profile.value.name, role: profile.value.role });
    notice.value = '个人资料已保存';
  } catch {
    error.value = '个人资料保存失败';
  } finally {
    saving.value = false;
  }
}
onMounted(load);
</script>
<template>
  <AppPage title="个人资料"
    ><AppLoading v-if="loading" /><AppError
      v-else-if="error && !profile"
      :message="error"
      show-retry
      @retry="load"
    />
    <form v-else-if="profile" class="profile-form" @submit.prevent="save">
      <p>手机号 {{ profile.phone }} · {{ profile.role }}</p>
      <label>显示姓名<input v-model="name" required /></label
      ><label>头像地址<input v-model="avatar" type="url" placeholder="https://…" /></label>
      <p v-if="notice" role="status">{{ notice }}</p>
      <p v-if="error" role="alert">{{ error }}</p>
      <button :disabled="saving">{{ saving ? '保存中…' : '保存资料' }}</button>
    </form></AppPage
  >
</template>
<style scoped>
.profile-form {
  display: grid;
  gap: var(--space-4);
  max-width: 600px;
}
.profile-form > p:first-child {
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
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border: 0;
  border-radius: var(--radius-button);
}
</style>
