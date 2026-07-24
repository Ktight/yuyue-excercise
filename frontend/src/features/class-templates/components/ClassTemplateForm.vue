<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useUnsavedChangesGuard } from '@/app/composables';
import { getErrorMessage } from '@/shared/api';
import type { ClassTemplate, ClassTemplateWriteInput } from '@/features/class-templates/model';
import PoseSequenceEditor from './PoseSequenceEditor.vue';
import ClassTemplateResourceSelects from './ClassTemplateResourceSelects.vue';
const props = defineProps<{
  initial?: ClassTemplate;
  readonly?: boolean;
  onSubmit: (value: ClassTemplateWriteInput) => Promise<unknown>;
}>();
const emptySequence = () => ({ warmup: [], main: [], cooldown: [] });
const form = reactive<ClassTemplateWriteInput>({
  trainerId: props.initial?.trainerId ?? 0,
  name: props.initial?.name ?? '',
  scope: props.initial?.scope ?? 'personal',
  courseTemplateId: props.initial?.courseTemplateId ?? null,
  poseSequence: props.initial?.poseSequence ?? emptySequence(),
  notesTemplate: props.initial?.notesTemplate ?? '',
  isActive: props.initial?.isActive ?? true,
});
const { runGuardedSubmit } = useUnsavedChangesGuard({
  source: () => form,
  enabled: () => !props.readonly,
});
const saving = ref(false),
  error = ref(''),
  notice = ref('');
async function submit() {
  if (!form.trainerId || !form.name.trim()) {
    error.value = '请选择教练并填写模板名称';
    return;
  }
  if (
    ![...form.poseSequence.warmup, ...form.poseSequence.main, ...form.poseSequence.cooldown].every(
      (x) => x.name.trim() && x.duration > 0,
    )
  ) {
    error.value = '每个动作都必须填写名称和正整数时长';
    return;
  }
  saving.value = true;
  error.value = '';
  notice.value = '';
  try {
    await runGuardedSubmit(() => props.onSubmit({ ...form, name: form.name.trim() }));
    notice.value = '模板已保存';
  } catch (cause) {
    error.value = getErrorMessage(cause, '模板保存失败，请检查字段或权限');
  } finally {
    saving.value = false;
  }
}
</script>
<template>
  <form class="template-form" @submit.prevent="submit">
    <p v-if="error" role="alert">{{ error }}</p>
    <p v-if="notice" role="status">{{ notice }}</p>
    <div class="grid">
      <label
        >模板名称<input v-model="form.name" required maxlength="200" :disabled="readonly"
      /></label>
      <ClassTemplateResourceSelects
        v-model:trainer-id="form.trainerId"
        v-model:course-template-id="form.courseTemplateId"
        :disabled="readonly"
      />
      <label
        >共享范围<select v-model="form.scope" :disabled="readonly">
          <option value="personal">个人模板</option>
          <option value="company_shared">公司共享</option>
        </select></label
      >
    </div>
    <PoseSequenceEditor v-model="form.poseSequence" :disabled="readonly" />
    <label
      >记录备注模板<textarea v-model="form.notesTemplate" rows="4" :disabled="readonly" />
    </label>
    <label class="check"
      ><input v-model="form.isActive" type="checkbox" :disabled="readonly" /> 启用模板</label
    >
    <button v-if="!readonly" type="submit" :disabled="saving">
      {{ saving ? '保存中…' : '保存模板' }}
    </button>
  </form>
</template>
<style scoped>
.template-form {
  display: grid;
  gap: var(--space-5);
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}
label {
  display: grid;
  gap: var(--space-2);
  font-size: var(--text-sm);
}
input,
select,
textarea {
  width: 100%;
  padding: var(--space-2) var(--space-3);
}
.check {
  display: flex;
  align-items: center;
}
.check input {
  width: auto;
}
button[type='submit'] {
  justify-self: start;
  padding: var(--space-3) var(--space-6);
  color: white;
  background: var(--color-brand);
  border: 0;
  border-radius: var(--radius-button);
}
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
