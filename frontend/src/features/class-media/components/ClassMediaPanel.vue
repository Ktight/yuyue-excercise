<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { confirmAction } from '@/app/components';
import { getErrorMessage } from '@/shared/api';
import {
  attachClassMedia,
  deleteClassMedia,
  fetchClassMedia,
  updateClassMedia,
  uploadClassMedia,
} from '@/features/class-media/api';
import type { ClassMedia } from '@/features/class-media/model';
const props = defineProps<{ recordId: number; readonly?: boolean }>();
const items = ref<ClassMedia[]>([]),
  error = ref(''),
  busy = ref(false),
  caption = ref('');
const editingId = ref<number>();
const editingCaption = ref('');
const editingSortOrder = ref(0);
async function load() {
  error.value = '';
  try {
    items.value = await fetchClassMedia(props.recordId);
  } catch (cause) {
    error.value = getErrorMessage(cause, '课堂媒体加载失败');
  }
}
async function choose(e: { target: unknown }) {
  const candidate = (e.target as { files?: { [index: number]: unknown } }).files?.[0];
  if (!(candidate instanceof globalThis.File)) return;
  const file = candidate;
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    error.value = '仅支持图片或视频文件';
    return;
  }
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
  } catch (cause) {
    error.value = getErrorMessage(cause, '媒体上传失败');
  } finally {
    busy.value = false;
  }
}
function startEdit(item: ClassMedia) {
  editingId.value = item.id;
  editingCaption.value = item.caption;
  editingSortOrder.value = item.sortOrder;
}
async function saveEdit(item: ClassMedia) {
  busy.value = true;
  error.value = '';
  try {
    await updateClassMedia(props.recordId, item.id, {
      caption: editingCaption.value.trim(),
      sortOrder: editingSortOrder.value,
    });
    editingId.value = undefined;
    await load();
  } catch (cause) {
    error.value = getErrorMessage(cause, '媒体信息保存失败');
  } finally {
    busy.value = false;
  }
}
async function remove(id: number) {
  if (
    !(await confirmAction({
      title: '移除课堂媒体',
      message: '移除后该媒体将不再显示在课堂记录中。',
      confirmText: '确认移除',
      danger: true,
    }))
  )
    return;
  busy.value = true;
  error.value = '';
  try {
    await deleteClassMedia(props.recordId, id);
    await load();
  } catch (cause) {
    error.value = getErrorMessage(cause, '媒体移除失败');
  } finally {
    busy.value = false;
  }
}
onMounted(load);
</script>
<template>
  <section>
    <h2>课堂媒体</h2>
    <p v-if="error" role="alert">{{ error }}</p>
    <form v-if="!readonly" @submit.prevent>
      <input v-model="caption" maxlength="255" placeholder="图片或视频说明" /><input
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
        <form v-if="!readonly && editingId === item.id" @submit.prevent="saveEdit(item)">
          <label>说明<input v-model="editingCaption" maxlength="255" /></label>
          <label>顺序<input v-model.number="editingSortOrder" type="number" min="0" /></label>
          <button :disabled="busy">保存</button>
          <button type="button" @click="editingId = undefined">取消</button>
        </form>
        <template v-else>
          <p>{{ item.caption || '无说明' }}</p>
          <small>排序：{{ item.sortOrder }}</small>
          <div v-if="!readonly" class="actions">
            <button @click="startEdit(item)">编辑信息</button>
            <button @click="remove(item.id)">移除</button>
          </div>
        </template>
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
.actions {
  display: flex;
  gap: var(--space-2);
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
