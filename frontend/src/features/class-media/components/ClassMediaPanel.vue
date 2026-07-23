<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  attachClassMedia,
  deleteClassMedia,
  fetchClassMedia,
  uploadClassMedia,
} from '@/features/class-media/api';
import type { ClassMedia } from '@/features/class-media/model';
const props = defineProps<{ recordId: number; readonly?: boolean }>();
const items = ref<ClassMedia[]>([]),
  error = ref(''),
  busy = ref(false),
  caption = ref('');
async function load() {
  items.value = await fetchClassMedia(props.recordId);
}
async function choose(e: { target: unknown }) {
  const candidate = (e.target as { files?: { [index: number]: unknown } }).files?.[0];
  if (!(candidate instanceof globalThis.File)) return;
  const file = candidate;
  if (file.size > 10 * 1024 * 1024) {
    error.value = '文件不能超过 10MB';
    return;
  }
  busy.value = true;
  try {
    const type = file.type.startsWith('video/') ? 'video' : 'image',
      u = await uploadClassMedia(file, type);
    await attachClassMedia(props.recordId, {
      mediaType: type,
      fileUrl: u.fileUrl,
      thumbnailUrl: u.thumbnailUrl,
      caption: caption.value,
      sortOrder: items.value.length,
    });
    caption.value = '';
    await load();
  } catch {
    error.value = '媒体上传失败';
  } finally {
    busy.value = false;
  }
}
async function remove(id: number) {
  if (!globalThis.confirm('确认移除该媒体？')) return;
  await deleteClassMedia(props.recordId, id);
  await load();
}
onMounted(load);
</script>
<template>
  <section>
    <h2>课堂媒体</h2>
    <p v-if="error" role="alert">{{ error }}</p>
    <form v-if="!readonly" @submit.prevent>
      <input v-model="caption" placeholder="图片或视频说明" /><input
        type="file"
        accept="image/*,video/*"
        :disabled="busy"
        @change="choose"
      />
    </form>
    <div class="media">
      <article v-for="item in items" :key="item.id">
        <img
          v-if="item.mediaType === 'image'"
          :src="item.thumbnailUrl || item.fileUrl"
          :alt="item.caption"
        /><a v-else :href="item.fileUrl" target="_blank">查看视频</a>
        <p>{{ item.caption || '无说明' }}</p>
        <button v-if="!readonly" @click="remove(item.id)">移除</button>
      </article>
    </div>
  </section>
</template>
<style scoped>
form {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
input {
  padding: var(--space-2);
}
.media {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-3);
}
article {
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
}
</style>
