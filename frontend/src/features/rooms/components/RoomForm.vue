<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ApiError } from '@/shared/api';
import type { Room, RoomWriteInput } from '../model';
import { validateRoom } from '../model';
const props = defineProps<{
  storeId: number;
  initial?: Room;
  onSubmit: (value: RoomWriteInput) => Promise<void>;
}>();
const emit = defineEmits<{ success: [] }>();
const form = reactive({
  name: props.initial?.name ?? '',
  capacity: props.initial?.capacity ?? 1,
  description: props.initial?.description ?? '',
});
const error = ref('');
const submitting = ref(false);
async function submit() {
  const value = {
    storeId: props.storeId,
    name: form.name.trim(),
    capacity: form.capacity,
    description: form.description.trim() || null,
  };
  const validation = validateRoom(value);
  if (validation.length) {
    error.value = validation[0] ?? '请检查输入';
    return;
  }
  submitting.value = true;
  error.value = '';
  try {
    await props.onSubmit(value);
    emit('success');
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : '保存失败';
  } finally {
    submitting.value = false;
  }
}
</script>
<template>
  <form @submit.prevent="submit">
    <p v-if="error" role="alert">{{ error }}</p>
    <label>场地名称<input v-model="form.name" :disabled="submitting" /></label
    ><label
      >容量<input
        v-model.number="form.capacity"
        type="number"
        min="1"
        :disabled="submitting" /></label
    ><label>说明<textarea v-model="form.description" :disabled="submitting" /></label
    ><button :disabled="submitting">
      {{ submitting ? '保存中…' : initial ? '保存场地' : '新增场地' }}
    </button>
  </form>
</template>
