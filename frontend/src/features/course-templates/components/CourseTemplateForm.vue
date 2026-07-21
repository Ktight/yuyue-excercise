<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  CourseCategory,
  CourseDifficulty,
  CourseTemplateDto,
} from '@/features/course-templates/model';
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/features/course-templates/model';
import { ApiError } from '@/shared/api';

const props = defineProps<{
  initial?: Partial<CourseTemplateDto>;
  onSubmit: (data: {
    name: string;
    category: CourseCategory;
    duration_minutes: number;
    difficulty: CourseDifficulty;
    capacity: number;
    description?: string;
  }) => Promise<void>;
}>();
const emit = defineEmits<{ success: [] }>();

const name = ref(props.initial?.name || '');
const category = ref<CourseCategory>(props.initial?.category || 'yoga');
const duration = ref(props.initial?.duration_minutes || 60);
const difficulty = ref<CourseDifficulty>(props.initial?.difficulty || 'beginner');
const capacity = ref(props.initial?.capacity || 20);
const description = ref(props.initial?.description || '');

const isPersonal = computed(() => category.value === 'personal');
const serverError = ref('');
const submitting = ref(false);

// 私教容量固定为 1
watch(category, (v) => {
  if (v === 'personal') capacity.value = 1;
});

async function handleSubmit() {
  if (!name.value.trim()) {
    serverError.value = '请输入课程名称';
    return;
  }
  if (duration.value < 15) {
    serverError.value = '课程时长至少 15 分钟';
    return;
  }
  serverError.value = '';
  submitting.value = true;
  try {
    await props.onSubmit({
      name: name.value.trim(),
      category: category.value,
      duration_minutes: duration.value,
      difficulty: difficulty.value,
      capacity: capacity.value,
      description: description.value.trim() || undefined,
    });
    emit('success');
  } catch (e) {
    serverError.value = e instanceof ApiError ? e.message : '保存失败';
  } finally {
    submitting.value = false;
  }
}

const categories = Object.entries(CATEGORY_LABELS) as [CourseCategory, string][];
const difficulties = Object.entries(DIFFICULTY_LABELS) as [CourseDifficulty, string][];
</script>

<template>
  <form class="ct-form" novalidate @submit.prevent="handleSubmit">
    <div v-if="serverError" class="ct-form__error" role="alert">{{ serverError }}</div>

    <label
      ><span>课程名称 *</span
      ><input
        v-model="name"
        class="ct-form__input"
        :disabled="submitting"
        placeholder="请输入课程名称"
    /></label>

    <div class="ct-form__row">
      <label
        ><span>类别</span>
        <select v-model="category" class="ct-form__input" :disabled="submitting">
          <option v-for="[v, l] in categories" :key="v" :value="v">{{ l }}</option>
        </select>
      </label>
      <label
        ><span>难度</span>
        <select v-model="difficulty" class="ct-form__input" :disabled="submitting">
          <option v-for="[v, l] in difficulties" :key="v" :value="v">{{ l }}</option>
        </select>
      </label>
    </div>

    <div class="ct-form__row">
      <label
        ><span>时长(分钟)</span
        ><input
          v-model.number="duration"
          type="number"
          class="ct-form__input"
          :disabled="submitting"
          min="15"
      /></label>
      <label
        ><span>容量</span
        ><input
          v-model.number="capacity"
          type="number"
          class="ct-form__input"
          :disabled="submitting || isPersonal"
          min="1"
      /></label>
    </div>

    <label
      ><span>描述</span
      ><textarea
        v-model="description"
        class="ct-form__input ct-form__textarea"
        :disabled="submitting"
        rows="3"
        placeholder="课程描述..."
      />
    </label>

    <button class="ct-form__submit" type="submit" :disabled="submitting">
      {{ submitting ? '保存中...' : '保存' }}
    </button>
  </form>
</template>

<style scoped>
.ct-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  max-width: 520px;
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
.ct-form__error {
  padding: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-error-600);
  background: var(--color-error-50);
  border-radius: var(--radius-md);
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
  outline: none;
}
.ct-form__input:focus {
  border-color: var(--color-border-focus);
}
.ct-form__textarea {
  resize: vertical;
  min-height: 60px;
}
.ct-form__submit {
  margin-top: var(--space-2);
  padding: var(--space-3);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border: none;
  border-radius: var(--radius-button);
  cursor: pointer;
}
.ct-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
