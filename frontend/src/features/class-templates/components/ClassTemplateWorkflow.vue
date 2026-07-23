<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { createClassTemplate, fetchClassTemplates } from '../api';
import type { ClassTemplate, ClassTemplateScope, PoseSequence } from '../model';
import { fetchSchedule } from '@/features/schedules';
const props = defineProps<{
  trainerId: number;
  scheduleId?: number | null;
  currentSequence: PoseSequence;
  currentNotes: string;
  disabled?: boolean;
}>();
const emit = defineEmits<{ apply: [template: ClassTemplate] }>();
const items = ref<ClassTemplate[]>([]),
  selectedId = ref(0),
  name = ref(''),
  scope = ref<ClassTemplateScope>('personal'),
  busy = ref(false),
  error = ref(''),
  message = ref('');
async function load() {
  try {
    items.value = (await fetchClassTemplates({ page: 1, pageSize: 100 })).items.filter(
      (item) => item.isActive,
    );
  } catch {
    error.value = '课时模板加载失败';
  }
}
function apply() {
  const item = items.value.find((value) => value.id === selectedId.value);
  if (item) emit('apply', item);
}
async function save() {
  if (!name.value.trim() || !props.trainerId || !props.scheduleId) {
    error.value = '请先选择到课学员并填写模板名称';
    return;
  }
  busy.value = true;
  error.value = '';
  message.value = '';
  try {
    const schedule = await fetchSchedule(props.scheduleId);
    const created = await createClassTemplate({
      trainerId: props.trainerId,
      name: name.value.trim(),
      scope: scope.value,
      courseTemplateId: schedule.courseTemplateId,
      poseSequence: structuredClone(props.currentSequence),
      notesTemplate: props.currentNotes,
      isActive: true,
    });
    items.value.unshift(created);
    selectedId.value = created.id;
    name.value = '';
    message.value = '模板已保存，可在后续课堂记录中复用';
  } catch {
    error.value = '保存模板失败';
  } finally {
    busy.value = false;
  }
}
onMounted(load);
</script>
<template>
  <section class="workflow">
    <h3>课时模板</h3>
    <div class="row">
      <select v-model.number="selectedId" :disabled="disabled || busy">
        <option :value="0">选择已有模板</option>
        <option v-for="item in items" :key="item.id" :value="item.id">
          {{ item.name }} · {{ item.scope === 'personal' ? '个人' : '公司共享' }}
        </option></select
      ><button type="button" :disabled="!selectedId || disabled || busy" @click="apply">
        加载到当前记录
      </button>
    </div>
    <div class="row">
      <input v-model="name" maxlength="100" placeholder="将当前内容另存为模板" /><select
        v-model="scope"
      >
        <option value="personal">个人模板</option>
        <option value="company_shared">公司共享</option></select
      ><button type="button" :disabled="disabled || busy" @click="save">
        {{ busy ? '保存中…' : '保存模板' }}
      </button>
    </div>
    <p v-if="error" role="alert">{{ error }}</p>
    <p v-if="message" role="status">{{ message }}</p>
  </section>
</template>
<style scoped>
.workflow {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-brand-light);
  border-radius: var(--radius-card);
}
h3 {
  margin: 0;
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
select,
input,
button {
  min-height: 40px;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
input {
  flex: 1;
  min-width: 220px;
}
button {
  color: var(--color-brand);
  background: var(--color-surface);
}
[role='alert'] {
  color: var(--color-danger);
}
[role='status'] {
  color: var(--color-success);
}
p {
  margin: 0;
}
</style>
