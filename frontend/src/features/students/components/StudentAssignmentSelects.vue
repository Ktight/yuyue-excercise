<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchStores, type Store } from '@/features/stores';
import { fetchUsers, type UserDto } from '@/features/users';

defineProps<{
  storeId: number | null;
  trainerId: number | null;
  disabled?: boolean;
}>();
defineEmits<{
  'update:storeId': [number | null];
  'update:trainerId': [number | null];
}>();

const stores = ref<Store[]>([]);
const trainers = ref<UserDto[]>([]);
const error = ref('');

onMounted(async () => {
  try {
    const [storeResult, trainerResult] = await Promise.all([
      fetchStores({ pageSize: 100 }),
      fetchUsers({ page_size: 100, role: 'trainer' }),
    ]);
    stores.value = storeResult.items;
    trainers.value = trainerResult.items;
  } catch {
    error.value = '门店或教练选项加载失败';
  }
});
</script>

<template>
  <label>
    所属门店
    <select
      :value="storeId ?? ''"
      :disabled="disabled"
      required
      @change="
        $emit(
          'update:storeId',
          ($event.target as HTMLSelectElement).value
            ? Number(($event.target as HTMLSelectElement).value)
            : null,
        )
      "
    >
      <option value="" disabled>请选择门店</option>
      <option
        v-for="store in stores"
        :key="store.id"
        :value="store.id"
        :disabled="store.status !== 'active' && store.id !== storeId"
      >
        {{ store.name }}{{ store.status === 'active' ? '' : '（已停用）' }}
      </option>
    </select>
  </label>
  <label>
    主教练（可选）
    <select
      :value="trainerId ?? ''"
      :disabled="disabled"
      @change="
        $emit(
          'update:trainerId',
          ($event.target as HTMLSelectElement).value
            ? Number(($event.target as HTMLSelectElement).value)
            : null,
        )
      "
    >
      <option value="">暂不指定</option>
      <option
        v-for="trainer in trainers"
        :key="trainer.id"
        :value="trainer.id"
        :disabled="!trainer.isActive && trainer.id !== trainerId"
      >
        {{ trainer.name }} · {{ trainer.phone }}{{ trainer.isActive ? '' : '（已停用）' }}
      </option>
    </select>
  </label>
  <p v-if="error" class="assignment-error" role="alert">{{ error }}</p>
</template>

<style scoped>
label {
  display: grid;
  gap: var(--space-1);
  color: var(--color-text-secondary);
}
select {
  padding: var(--space-3);
  font: inherit;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
.assignment-error {
  color: var(--color-danger);
}
</style>
