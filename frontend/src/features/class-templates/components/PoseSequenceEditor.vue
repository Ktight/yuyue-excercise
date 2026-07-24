<script setup lang="ts">
import type { PoseItem, PoseSequence } from '@/features/class-templates/model';
const props = defineProps<{ modelValue: PoseSequence; disabled?: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: PoseSequence] }>();
const sections = [
  { key: 'warmup', label: '热身' },
  { key: 'main', label: '主体练习' },
  { key: 'cooldown', label: '放松' },
] as const;
const blank = (): PoseItem => ({ name: '', duration: 5, notes: '', variations: '', assists: '' });
function update(section: keyof PoseSequence, index: number, patch: Partial<PoseItem>) {
  const next = {
    ...props.modelValue,
    [section]: props.modelValue[section].map((item, i) =>
      i === index ? { ...item, ...patch } : item,
    ),
  };
  emit('update:modelValue', next);
}
function add(section: keyof PoseSequence) {
  emit('update:modelValue', {
    ...props.modelValue,
    [section]: [...props.modelValue[section], blank()],
  });
}
function remove(section: keyof PoseSequence, index: number) {
  emit('update:modelValue', {
    ...props.modelValue,
    [section]: props.modelValue[section].filter((_, i) => i !== index),
  });
}
</script>
<template>
  <fieldset class="pose-editor" :disabled="disabled">
    <legend>动作序列</legend>
    <section v-for="section in sections" :key="section.key">
      <header>
        <h3>{{ section.label }}</h3>
        <button type="button" @click="add(section.key)">添加动作</button>
      </header>
      <p v-if="!modelValue[section.key].length" class="empty">暂无动作</p>
      <div
        v-for="(item, index) in modelValue[section.key]"
        :key="`${section.key}-${index}`"
        class="pose-row"
      >
        <label
          >动作名称<input
            :value="item.name"
            required
            @input="
              update(section.key, index, { name: ($event.target as HTMLInputElement).value })
            "
        /></label>
        <label
          >时长（分钟）<input
            :value="item.duration"
            type="number"
            min="1"
            required
            @input="
              update(section.key, index, {
                duration: Number(($event.target as HTMLInputElement).value),
              })
            "
        /></label>
        <label class="wide"
          >提示<input
            :value="item.notes"
            @input="
              update(section.key, index, { notes: ($event.target as HTMLInputElement).value })
            "
        /></label>
        <button type="button" class="remove" @click="remove(section.key, index)">移除</button>
      </div>
    </section>
  </fieldset>
</template>
<style scoped>
.pose-editor {
  display: grid;
  gap: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: var(--space-4);
}
header,
.pose-row {
  display: flex;
  align-items: end;
  gap: var(--space-3);
}
header {
  justify-content: space-between;
}
h3 {
  margin: 0;
}
.pose-row {
  margin-top: var(--space-3);
}
label {
  display: grid;
  gap: var(--space-1);
  flex: 1;
  font-size: var(--text-sm);
}
input {
  width: 100%;
  padding: var(--space-2);
}
.wide {
  flex: 2;
}
button {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-surface);
}
.remove {
  color: var(--color-danger);
}
.empty {
  color: var(--color-text-tertiary);
}
@media (max-width: 700px) {
  .pose-row {
    align-items: stretch;
    flex-direction: column;
  }
  .pose-row label,
  .pose-row button {
    width: 100%;
  }
}
</style>
