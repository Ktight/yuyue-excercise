<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchStores } from '@/features/stores/api';
import { mapStore } from '@/features/stores/model';
import type { Store } from '@/features/stores/model';
import { StoreList } from '@/features/stores/components';
import { AppPage, AppLoading, AppEmpty, AppError } from '@/app/components';
const router = useRouter();
const stores = ref<Store[]>([]);
const loading = ref(true);
const error = ref('');
onMounted(async () => {
  try {
    const r = await fetchStores();
    stores.value = r.data.items.map(mapStore);
  } catch {
    error.value = '加载失败';
  } finally {
    loading.value = false;
  }
});
</script>
<template>
  <AppPage title="门店管理"
    ><template #header-extra
      ><button class="btn-primary" @click="router.push('/admin/stores/new')">
        新建门店
      </button></template
    >
    <AppLoading v-if="loading" /><AppError v-else-if="error" :message="error" show-retry />
    <AppEmpty v-else-if="stores.length === 0" description="暂无门店" />
    <StoreList v-else :stores="stores" @select="(s) => router.push(`/admin/stores/${s.id}`)" />
  </AppPage>
</template>
<style scoped>
.btn-primary {
  padding: var(--space-1) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border: none;
  border-radius: var(--radius-button);
  cursor: pointer;
}
</style>
