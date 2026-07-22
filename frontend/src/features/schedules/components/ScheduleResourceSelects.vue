<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { fetchCourseTemplates, type CourseTemplate } from '@/features/course-templates';
import { fetchRooms, type Room } from '@/features/rooms';
import { fetchStores, type Store } from '@/features/stores';
import { fetchUsers, type UserDto } from '@/features/users';

const props = defineProps<{
  storeId: number;
  roomId: number;
  courseTemplateId: number;
  trainerId: number;
  disabled?: boolean;
}>();
const emit = defineEmits<{
  'update:storeId': [number];
  'update:roomId': [number];
  'update:courseTemplateId': [number];
  'update:trainerId': [number];
}>();
const stores = ref<Store[]>([]),
  rooms = ref<Room[]>([]),
  templates = ref<CourseTemplate[]>([]),
  trainers = ref<UserDto[]>([]),
  error = ref('');

async function loadShared() {
  try {
    const [storeResult, templateResult, trainerResult] = await Promise.all([
      fetchStores({ pageSize: 100, status: 'active' }),
      fetchCourseTemplates({ pageSize: 100, status: 'active' }),
      fetchUsers({ page_size: 100, role: 'trainer', is_active: true }),
    ]);
    stores.value = storeResult.items;
    templates.value = templateResult.items;
    trainers.value = trainerResult.items;
  } catch {
    error.value = '排课选项加载失败';
  }
}
async function loadRooms(storeId: number) {
  try {
    rooms.value = (await fetchRooms({ storeId, pageSize: 100 })).items.filter(
      (room) => room.status === 'active',
    );
  } catch {
    error.value = '教室选项加载失败';
  }
}
watch(
  () => props.storeId,
  (value, previous) => {
    if (value !== previous) emit('update:roomId', 0);
    if (value) void loadRooms(value);
  },
  { immediate: true },
);
onMounted(loadShared);
</script>
<template>
  <fieldset class="resources" :disabled="disabled">
    <legend>课程资源</legend>
    <label
      >门店<select
        :value="storeId"
        required
        @change="$emit('update:storeId', Number(($event.target as HTMLSelectElement).value))"
      >
        <option value="" disabled>请选择门店</option>
        <option v-for="item in stores" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select></label
    >
    <label
      >教室<select
        :value="roomId"
        required
        @change="$emit('update:roomId', Number(($event.target as HTMLSelectElement).value))"
      >
        <option value="" disabled>请选择教室</option>
        <option v-for="item in rooms" :key="item.id" :value="item.id">
          {{ item.name }}（{{ item.capacity }}人）
        </option>
      </select></label
    >
    <label
      >课程模板<select
        :value="courseTemplateId"
        required
        @change="
          $emit('update:courseTemplateId', Number(($event.target as HTMLSelectElement).value))
        "
      >
        <option value="" disabled>请选择课程</option>
        <option v-for="item in templates" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select></label
    >
    <label
      >教练<select
        :value="trainerId"
        required
        @change="$emit('update:trainerId', Number(($event.target as HTMLSelectElement).value))"
      >
        <option value="" disabled>请选择教练</option>
        <option v-for="item in trainers" :key="item.id" :value="item.id">
          {{ item.name }} · {{ item.phone }}
        </option>
      </select></label
    >
    <p v-if="error" role="alert">{{ error }}</p>
  </fieldset>
</template>
<style scoped>
.resources {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
legend {
  padding-inline: var(--space-2);
  font-weight: var(--font-semibold);
  color: var(--color-brand);
}
label {
  display: grid;
  gap: var(--space-1);
}
select {
  padding: var(--space-3);
}
[role='alert'] {
  grid-column: 1 / -1;
}
@media (max-width: 640px) {
  .resources {
    grid-template-columns: 1fr;
    padding-inline: 0;
    border-inline: 0;
    border-radius: 0;
  }
}
</style>
