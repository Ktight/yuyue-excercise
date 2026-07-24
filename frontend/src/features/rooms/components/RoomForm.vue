<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useUnsavedChangesGuard } from '@/app/composables';
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
  facilitiesText: props.initial?.facilities.join('、') ?? '',
});
const { runGuardedSubmit } = useUnsavedChangesGuard({ source: () => form });
const error = ref('');
const submitting = ref(false);
async function submit() {
  const value: RoomWriteInput = {
    storeId: props.storeId,
    name: form.name.trim(),
    capacity: form.capacity,
    facilities: form.facilitiesText
      .split(/[、,，]/)
      .map((v) => v.trim())
      .filter(Boolean),
  };
  const errors = validateRoom(value);
  if (errors[0]) {
    error.value = errors[0];
    return;
  }
  submitting.value = true;
  error.value = '';
  try {
    await runGuardedSubmit(() => props.onSubmit(value));
    emit('success');
  } catch (cause) {
    error.value = cause instanceof ApiError ? cause.message : '保存失败';
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
    ><label
      >设施（使用顿号或逗号分隔）<textarea
        v-model="form.facilitiesText"
        :disabled="submitting"
      /></label
    ><button :disabled="submitting">
      {{ submitting ? '保存中…' : initial ? '保存场地' : '新增场地' }}
    </button>
  </form>
</template>
