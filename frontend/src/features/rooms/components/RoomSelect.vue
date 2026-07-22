<script setup lang="ts">
import type { Room } from '../model';
defineProps<{ modelValue: number | null; rooms: Room[]; disabled?: boolean }>();
defineEmits<{ 'update:modelValue': [value: number | null] }>();
</script>
<template>
  <select
    aria-label="场地"
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
    <option value="">请选择场地</option>
    <option
      v-for="room in rooms"
      :key="room.id"
      :value="room.id"
      :disabled="room.status !== 'active'"
    >
      {{ room.name }}（{{ room.capacity }}人）
    </option>
  </select>
</template>
