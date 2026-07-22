<script setup lang="ts">
import type { Room } from '@/features/rooms/model';
defineProps<{ rooms: Room[]; loading?: boolean; manageable?: boolean }>();
defineEmits<{ toggle: [room: Room]; edit: [room: Room] }>();
</script>
<template>
  <div class="room-list">
    <div v-if="loading" class="room-list__msg">加载中...</div>
    <div v-else-if="rooms.length === 0" class="room-list__msg">暂无场地</div>
    <div v-for="r in rooms" :key="r.id" class="room-list__item">
      <span>{{ r.name }}</span>
      <span class="room-list__capacity"
        >容量: {{ r.capacity || '-' }}人 · {{ r.status === 'active' ? '可用' : '停用' }}</span
      >
      <button v-if="manageable" type="button" @click="$emit('toggle', r)">
        {{ r.status === 'active' ? '停用' : '启用' }}
      </button>
      <button v-if="manageable" type="button" @click="$emit('edit', r)">编辑</button>
    </div>
  </div>
</template>
<style scoped>
.room-list {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
.room-list__msg {
  padding: var(--space-8);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}
.room-list__item {
  display: flex;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border-light);
}
.room-list__capacity {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}
</style>
