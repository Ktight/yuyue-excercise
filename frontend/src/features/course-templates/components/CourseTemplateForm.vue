<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useUnsavedChangesGuard } from '@/app/composables';
import type {
  CourseCategory,
  CourseDifficulty,
  CourseTemplate,
  CourseTemplateWriteInput,
} from '@/features/course-templates/model';
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  validateCourseTemplate,
} from '@/features/course-templates/model';
import { ApiError } from '@/shared/api';

const props = defineProps<{
  initial?: CourseTemplate;
  readonly?: boolean;
  onSubmit: (data: CourseTemplateWriteInput) => Promise<void>;
}>();
const emit = defineEmits<{ success: [] }>();
const form = reactive<CourseTemplateWriteInput>({
  name: props.initial?.name ?? '',
  category: props.initial?.category ?? 'group',
  durationMinutes: props.initial?.durationMinutes ?? 60,
  maxCapacity: props.initial?.maxCapacity ?? 10,
  difficulty: props.initial?.difficulty ?? 'beginner',
  description: props.initial?.description ?? '',
  status: props.initial?.status ?? 'active',
});
const { runGuardedSubmit } = useUnsavedChangesGuard({
  source: () => form,
  enabled: () => !props.readonly,
});
const errors = reactive<Partial<Record<keyof CourseTemplateWriteInput, string>>>({});
const serverError = ref('');
const submitting = ref(false);
const disabled = computed(() => props.readonly || submitting.value);
const categories = Object.entries(CATEGORY_LABELS) as [CourseCategory, string][];
const difficulties = Object.entries(DIFFICULTY_LABELS) as [CourseDifficulty, string][];

watch(
  () => form.category,
  (category) => {
    if (category === 'private') form.maxCapacity = 1;
  },
);

async function handleSubmit() {
  if (props.readonly) return;
  Object.assign(errors, {
    name: undefined,
    category: undefined,
    durationMinutes: undefined,
    maxCapacity: undefined,
    difficulty: undefined,
    description: undefined,
    status: undefined,
  });
  for (const error of validateCourseTemplate(form)) errors[error.field] = error.message;
  if (Object.values(errors).some(Boolean)) return;
  serverError.value = '';
  submitting.value = true;
  try {
    await runGuardedSubmit(() =>
      props.onSubmit({
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
      }),
    );
    emit('success');
  } catch (error) {
    serverError.value = error instanceof ApiError ? error.message : '保存失败，请稍后重试';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <form class="ct-form" novalidate @submit.prevent="handleSubmit">
    <div v-if="serverError" class="ct-form__error" role="alert">{{ serverError }}</div>
    <label
      ><span>课程名称 *</span
      ><input v-model="form.name" class="ct-form__input" :disabled="disabled" /><small
        v-if="errors.name"
        >{{ errors.name }}</small
      ></label
    >
    <div class="ct-form__row">
      <label
        ><span>类别</span
        ><select v-model="form.category" class="ct-form__input" :disabled="disabled">
          <option v-for="[value, label] in categories" :key="value" :value="value">
            {{ label }}
          </option>
        </select></label
      >
      <label
        ><span>难度</span
        ><select v-model="form.difficulty" class="ct-form__input" :disabled="disabled">
          <option v-for="[value, label] in difficulties" :key="value" :value="value">
            {{ label }}
          </option>
        </select></label
      >
    </div>
    <div class="ct-form__row">
      <label
        ><span>时长（分钟）</span
        ><input
          v-model.number="form.durationMinutes"
          type="number"
          min="1"
          class="ct-form__input"
          :disabled="disabled"
        /><small v-if="errors.durationMinutes">{{ errors.durationMinutes }}</small></label
      >
      <label
        ><span>最大容量</span
        ><input
          v-model.number="form.maxCapacity"
          type="number"
          min="1"
          class="ct-form__input"
          :disabled="disabled || form.category === 'private'"
        /><small v-if="form.category === 'private'">私教课容量固定为 1 人</small
        ><small v-else-if="errors.maxCapacity">{{ errors.maxCapacity }}</small></label
      >
    </div>
    <label
      ><span>描述</span
      ><textarea
        v-model="form.description"
        rows="3"
        class="ct-form__input ct-form__textarea"
        :disabled="disabled"
      />
    </label>
    <p v-if="initial?.coverImage" class="ct-form__cover-note">
      封面仅展示；按照当前契约，媒体上传功能延期。
    </p>
    <button v-if="!readonly" class="ct-form__submit" type="submit" :disabled="submitting">
      {{ submitting ? '保存中…' : '保存' }}
    </button>
  </form>
</template>

<style scoped>
.ct-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  max-width: 560px;
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-xs);
}
.ct-form__error,
small {
  color: var(--color-error);
}
.ct-form label {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-size: var(--text-sm);
}
.ct-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}
.ct-form__input {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
.ct-form__textarea {
  min-height: 72px;
  resize: vertical;
}
.ct-form__cover-note {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}
.ct-form__submit {
  min-height: var(--control-height-lg);
  margin-top: var(--space-2);
  padding: var(--space-3);
  font-weight: var(--font-semibold);
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border: 0;
  border-radius: var(--radius-button);
}
@media (max-width: 640px) {
  .ct-form {
    padding-inline: 0;
    border-inline: 0;
    border-radius: 0;
    box-shadow: none;
  }
  .ct-form__row {
    grid-template-columns: 1fr;
  }
}
</style>
