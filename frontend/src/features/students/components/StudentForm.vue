<script setup lang="ts">
import { ref } from 'vue';
import type { MembershipType, Student } from '@/features/students/model';
import { MEMBERSHIP_LABELS } from '@/features/students/model';
import { ApiError } from '@/shared/api';

const props = defineProps<{
  initial?: Partial<Student>;
  onSubmit: (data: {
    name: string;
    phone: string;
    gender?: 'male' | 'female';
    birthday?: string;
    membership_type: MembershipType;
    membership_expire_date?: string;
    training_goal?: string;
    notes?: string;
  }) => Promise<void>;
}>();
const emit = defineEmits<{ success: [] }>();

const name = ref(props.initial?.name || '');
const phone = ref(props.initial?.phone || '');
const gender = ref(props.initial?.gender || '');
const birthday = ref(props.initial?.birthday || '');
const membershipType = ref<MembershipType>(props.initial?.membershipType || 'none');
const expireDate = ref(props.initial?.membershipExpireDate || '');
const trainingGoal = ref(props.initial?.trainingGoal || '');
const notes = ref(props.initial?.notes || '');
const serverError = ref('');
const submitting = ref(false);

async function handleSubmit() {
  if (!name.value.trim()) {
    serverError.value = '请输入姓名';
    return;
  }
  if (!phone.value.trim()) {
    serverError.value = '请输入手机号';
    return;
  }
  serverError.value = '';
  submitting.value = true;
  try {
    await props.onSubmit({
      name: name.value.trim(),
      phone: phone.value.trim(),
      gender: (gender.value || undefined) as 'male' | 'female' | undefined,
      birthday: birthday.value || undefined,
      membership_type: membershipType.value,
      membership_expire_date: expireDate.value || undefined,
      training_goal: trainingGoal.value.trim() || undefined,
      notes: notes.value.trim() || undefined,
    });
    emit('success');
  } catch (e) {
    serverError.value = e instanceof ApiError ? e.message : '保存失败';
  } finally {
    submitting.value = false;
  }
}

const memberships = Object.entries(MEMBERSHIP_LABELS) as [MembershipType, string][];
</script>

<template>
  <form class="sf" novalidate @submit.prevent="handleSubmit">
    <div v-if="serverError" class="sf__error" role="alert">{{ serverError }}</div>
    <!-- 基本信息 -->
    <fieldset class="sf__section">
      <legend>基本信息</legend>
      <div class="sf__row">
        <label
          ><span>姓名 *</span
          ><input v-model="name" class="sf__input" :disabled="submitting" placeholder="请输入姓名"
        /></label>
        <label
          ><span>手机号 *</span
          ><input
            v-model="phone"
            class="sf__input"
            :disabled="submitting"
            placeholder="请输入手机号"
        /></label>
      </div>
      <div class="sf__row">
        <label
          ><span>性别</span
          ><select v-model="gender" class="sf__input" :disabled="submitting">
            <option value="">请选择</option>
            <option value="male">男</option>
            <option value="female">女</option>
          </select></label
        >
        <label
          ><span>生日</span
          ><input v-model="birthday" type="date" class="sf__input" :disabled="submitting"
        /></label>
      </div>
    </fieldset>
    <!-- 会员卡 -->
    <fieldset class="sf__section">
      <legend>会员卡</legend>
      <div class="sf__row">
        <label
          ><span>类型</span
          ><select v-model="membershipType" class="sf__input" :disabled="submitting">
            <option v-for="[v, l] in memberships" :key="v" :value="v">{{ l }}</option>
          </select></label
        >
        <label
          ><span>到期日期</span
          ><input v-model="expireDate" type="date" class="sf__input" :disabled="submitting"
        /></label>
      </div>
    </fieldset>
    <!-- 训练目标 -->
    <fieldset class="sf__section">
      <legend>训练目标</legend>
      <label
        ><span>目标描述</span
        ><input
          v-model="trainingGoal"
          class="sf__input"
          :disabled="submitting"
          placeholder="如：提升柔韧性、减重塑形..."
      /></label>
      <label class="sf__mt"
        ><span>备注</span
        ><textarea
          v-model="notes"
          class="sf__input sf__textarea"
          :disabled="submitting"
          rows="2"
          placeholder="备注信息..."
        />
      </label>
    </fieldset>
    <button class="sf__submit" type="submit" :disabled="submitting">
      {{ submitting ? '保存中...' : '保存' }}
    </button>
  </form>
</template>
<style scoped>
.sf {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  max-width: 560px;
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
.sf__error {
  padding: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-error-600);
  background: var(--color-error-50);
  border-radius: var(--radius-md);
}
.sf__section {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.sf__section legend {
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  padding: 0 var(--space-2);
}
.sf__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}
.sf label {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-size: var(--text-sm);
}
.sf__mt {
  margin-top: var(--space-1);
}
.sf__input {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  outline: none;
}
.sf__input:focus {
  border-color: var(--color-border-focus);
}
.sf__textarea {
  resize: vertical;
  min-height: 48px;
}
.sf__submit {
  padding: var(--space-3);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border: none;
  border-radius: var(--radius-button);
  cursor: pointer;
}
.sf__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
