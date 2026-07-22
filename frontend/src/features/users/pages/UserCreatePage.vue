<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { createUser } from '@/features/users/api';
import { UserCreateForm } from '@/features/users/components';
import { AppPage } from '@/app/components';
import type { UserCreateRequestDto } from '@/features/users/model';
import { fetchStores, type Store } from '@/features/stores';
import { AppError, AppLoading } from '@/app/components';

const router = useRouter();
const stores = ref<Store[]>([]);
const loading = ref(true);
const error = ref('');
onMounted(async () => {
  try {
    stores.value = (await fetchStores({ status: 'active' })).items;
  } catch {
    error.value = '加载门店选项失败';
  } finally {
    loading.value = false;
  }
});
async function submit(data: UserCreateRequestDto) {
  await createUser(data);
}
</script>

<template>
  <AppPage title="创建用户">
    <AppLoading v-if="loading" />
    <AppError v-else-if="error" :message="error" />
    <UserCreateForm
      v-else
      :stores="stores"
      :on-submit="submit"
      @success="router.push({ name: 'users-list' })"
    />
  </AppPage>
</template>
