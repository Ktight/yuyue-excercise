<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { AppError, AppLoading, AppPage } from '@/app/components';
import { fetchUser, resetUserPassword, updateUser } from '@/features/users/api';
import { UserEditForm, UserPasswordResetForm } from '@/features/users/components';
import type { UserDto, UserUpdateRequestDto } from '@/features/users/model';
const route = useRoute();
const userId = computed(() => Number(route.params.id));
const user = ref<UserDto | null>(null),
  loading = ref(true),
  error = ref(''),
  notice = ref('');
async function load() {
  loading.value = true;
  error.value = '';
  try {
    user.value = await fetchUser(userId.value);
  } catch {
    error.value = '用户不存在或无权访问';
  } finally {
    loading.value = false;
  }
}
async function save(value: UserUpdateRequestDto) {
  user.value = await updateUser(userId.value, value);
  notice.value = '用户资料已保存';
}
async function resetPassword(password: string) {
  await resetUserPassword(userId.value, { newPassword: password });
}
onMounted(load);
</script>
<template>
  <AppPage :title="user?.name || '用户详情'">
    <AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load"
    />
    <template v-else-if="user"
      ><p v-if="notice" role="status">{{ notice }}</p>
      <UserEditForm
        :key="`${user.id}-${user.role}-${user.storeId}-${user.isActive}`"
        :user="user"
        :on-submit="save"
      />
      <UserPasswordResetForm :on-submit="resetPassword" />
    </template>
  </AppPage>
</template>
