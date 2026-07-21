<script setup lang="ts">
import { useRouter } from 'vue-router';
import { createUser } from '@/features/users/api';
import { UserCreateForm } from '@/features/users/components';
import { AppPage } from '@/app/components';
import type { UserCreateRequestDto } from '@/features/users/model';

const router = useRouter();
async function submit(data: UserCreateRequestDto) {
  await createUser(data);
}
</script>

<template>
  <AppPage title="创建用户">
    <UserCreateForm :on-submit="submit" @success="router.push({ name: 'users-list' })" />
  </AppPage>
</template>
