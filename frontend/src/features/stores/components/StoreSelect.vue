<script setup lang="ts">
import type { Store } from '../model';
defineProps<{
  modelValue: number | null;
  stores: Store[];
  disabled?: boolean;
  required?: boolean;
}>();
defineEmits<{ 'update:modelValue': [value: number | null] }>();
</script>
<template>
  <select
    aria-label="所属门店"
    :required="required"
    :disabled="disabled"
    :value="modelValue ?? ''"
    @change="
      $emit(
        'update:modelValue',
        ($event.target as HTMLSelectElement).value
          ? Number(($event.target as HTMLSelectElement).value)
          : null,
      )
    "
  >
    <option value="">{{ required ? '请选择门店' : '不指定门店' }}</option>
    <option
      v-for="store in stores"
      :key="store.id"
      :value="store.id"
      :disabled="store.status !== 'active'"
    >
      {{ store.name }}
    </option>
  </select>
</template>
