<script setup lang="ts">
import { AppEmpty } from '@/app/components';
import { REMINDER_CATEGORY_LABELS, REMINDER_PRIORITY_LABELS } from '../model';
import type { ReminderItem } from '../model';
defineProps<{ items: ReminderItem[]; busyId?: number | null; disabled?: boolean }>();
const emit = defineEmits<{ read: [id: number]; dismiss: [id: number] }>();
</script>
<template>
  <AppEmpty v-if="!items.length" description="当前没有待处理提醒" />
  <ul v-else class="reminders">
    <li v-for="item in items" :key="item.id" :class="{ unread: !item.read }">
      <div class="title">
        <strong>{{ item.title }}</strong
        ><span class="category">{{ REMINDER_CATEGORY_LABELS[item.category] }}</span
        ><span :class="`priority ${item.priority}`">{{
          REMINDER_PRIORITY_LABELS[item.priority]
        }}</span>
      </div>
      <p>{{ item.message }}</p>
      <div class="footer">
        <time>{{ new Date(item.createdAt).toLocaleString('zh-CN') }}</time>
        <div>
          <RouterLink v-if="item.actionTo && !disabled" :to="item.actionTo">{{
            item.actionLabel
          }}</RouterLink>
          <button
            v-if="!item.read"
            type="button"
            :disabled="disabled || busyId === item.id"
            @click="emit('read', item.id)"
          >
            {{ busyId === item.id ? '处理中…' : '标为已读' }}
          </button>
          <button
            type="button"
            :disabled="disabled || busyId === item.id"
            @click="emit('dismiss', item.id)"
          >
            {{ busyId === item.id ? '处理中…' : '忽略' }}
          </button>
        </div>
      </div>
    </li>
  </ul>
</template>
<style scoped>
.reminders {
  margin: 0;
  padding: 0;
  list-style: none;
}
.reminders li {
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
.reminders li + li {
  margin-top: var(--space-3);
}
.reminders li.unread {
  border-left: 4px solid var(--color-brand);
}
.title,
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}
p {
  margin: var(--space-2) 0 var(--space-4);
  color: var(--color-text-secondary);
}
.priority {
  padding: 2px var(--space-2);
  font-size: var(--text-xs);
  border-radius: var(--radius-full);
  background: var(--color-brand-light);
}
.category {
  margin-left: auto;
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
}
.priority.high {
  color: var(--color-danger);
  background: #fff1f0;
}
time {
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
}
.footer div {
  display: flex;
  gap: var(--space-2);
}
a,
button {
  padding: var(--space-2);
  color: var(--color-brand);
  font: inherit;
  font-size: var(--text-sm);
  text-decoration: none;
  background: none;
  border: 0;
  cursor: pointer;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
@media (max-width: 640px) {
  .footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
