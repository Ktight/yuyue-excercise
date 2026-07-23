<script setup lang="ts">
import { feedbackFeelingOptions } from '../model';
import type { FeedbackFeeling } from '../model';

defineProps<{ modelValue: FeedbackFeeling }>();
defineEmits<{ 'update:modelValue': [FeedbackFeeling] }>();
</script>

<template>
  <fieldset>
    <legend>本次训练感受</legend>
    <label v-for="option in feedbackFeelingOptions" :key="option.value">
      <input
        type="radio"
        name="feeling"
        :value="option.value"
        :checked="modelValue === option.value"
        @change="$emit('update:modelValue', option.value)"
      />
      {{ option.label }}
    </label>
  </fieldset>
</template>

<style scoped>
fieldset {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
legend {
  padding: 0 var(--space-2);
  font-weight: 700;
}
</style>
