<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    maxCount?: number;
    accept?: string;
    upload?: (file: globalThis.File) => Promise<string>;
  }>(),
  { maxCount: 6, accept: 'image/jpeg,image/png,image/webp', upload: undefined },
);
const emit = defineEmits<{ 'update:modelValue': [string[]] }>();
const busy = ref(false);
const error = ref('');

async function select(event: globalThis.Event) {
  const input = event.target as globalThis.HTMLInputElement;
  const files = Array.from(input.files ?? []).slice(0, props.maxCount - props.modelValue.length);
  if (!files.length) return;
  if (!props.upload) {
    error.value = '图片上传服务尚未配置';
    input.value = '';
    return;
  }
  const upload = props.upload;
  busy.value = true;
  error.value = '';
  try {
    const urls = await Promise.all(files.map((file) => upload(file)));
    emit('update:modelValue', [...props.modelValue, ...urls].slice(0, props.maxCount));
  } catch {
    error.value = '图片上传失败，已保留当前内容';
  } finally {
    busy.value = false;
    input.value = '';
  }
}
function remove(url: string) {
  emit(
    'update:modelValue',
    props.modelValue.filter((item) => item !== url),
  );
}
</script>

<template>
  <div class="uploader">
    <div v-if="modelValue.length" class="uploader__items">
      <figure v-for="url in modelValue" :key="url">
        <img :src="url" alt="已上传图片" />
        <button type="button" aria-label="删除图片" @click="remove(url)">×</button>
      </figure>
    </div>
    <label v-if="modelValue.length < maxCount" class="uploader__pick">
      {{ busy ? '上传中…' : '选择图片' }}
      <input :accept="accept" type="file" multiple :disabled="busy" @change="select" />
    </label>
    <small>{{ modelValue.length }}/{{ maxCount }}</small>
    <p v-if="error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.uploader__items {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
}
figure {
  position: relative;
  flex: 0 0 96px;
  margin: 0;
}
img {
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: var(--radius-control);
}
figure button {
  position: absolute;
  top: var(--space-1);
  right: var(--space-1);
}
.uploader__pick {
  display: inline-flex;
  padding: var(--space-3);
  cursor: pointer;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-control);
}
.uploader__pick input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}
[role='alert'] {
  color: var(--color-danger);
}
</style>
