<script setup lang="ts">
import type { Company } from '../model';
defineProps<{ modelValue: number | null; companies: Company[]; disabled?: boolean }>();
defineEmits<{ 'update:modelValue': [value: number | null] }>();
</script>
<template>
  <select
    aria-label="所属公司"
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
    <option value="">请选择公司</option>
    <option
      v-for="company in companies"
      :key="company.id"
      :value="company.id"
      :disabled="company.status !== 'active'"
    >
      {{ company.name }}
    </option>
  </select>
</template>
