<script setup lang="ts">
import { ref } from 'vue';
import { changePassword } from '@/features/auth/api';
import { ChangePasswordForm } from '@/features/auth/components';
import { AppPage } from '@/app/components';

const completed = ref(false);
async function submit(oldPassword: string, newPassword: string) {
  await changePassword({ old_password: oldPassword, new_password: newPassword });
  completed.value = true;
}
</script>

<template>
  <AppPage title="修改密码">
    <p v-if="completed" role="status">密码修改成功，请在下次登录时使用新密码。</p>
    <ChangePasswordForm v-else :on-submit="submit" />
  </AppPage>
</template>
