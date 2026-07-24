<script setup lang="ts">
import type { Booking } from '@/features/bookings/model';
withDefaults(defineProps<{ booking: Booking; cancelling?: boolean }>(), { cancelling: false });
defineEmits<{ cancel: [number]; select: [number] }>();
</script>
<template>
  <article class="card">
    <div>
      <strong>{{ booking.schedule.courseTemplateName }}</strong>
      <p>
        {{ booking.schedule.courseDate }} {{ booking.schedule.startTime.slice(0, 5) }} ·
        {{ booking.schedule.roomName }}
      </p>
      <p>{{ booking.student.name }} · {{ booking.schedule.trainerName }}</p>
    </div>
    <span>{{ booking.status === 'booked' ? '已预约' : '已取消' }}</span
    ><button class="detail" @click="$emit('select', booking.id)">查看详情</button
    ><button
      v-if="booking.status === 'booked'"
      :disabled="cancelling"
      @click="$emit('cancel', booking.id)"
    >
      {{ cancelling ? '取消中…' : '取消预约' }}
    </button>
  </article>
</template>
<style scoped>
.card {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
p {
  color: var(--color-text-secondary);
}
button {
  justify-self: start;
  padding: var(--space-2) var(--space-4);
  color: var(--color-danger);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
}
.detail {
  color: var(--color-brand);
}
</style>
