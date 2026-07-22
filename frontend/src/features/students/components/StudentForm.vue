<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { Student, StudentCreateInput, StudentUpdateInput } from '@/features/students/model';
const props = withDefaults(
  defineProps<{
    initial?: Student;
    allowAssignment?: boolean;
    onSubmit: (value: StudentCreateInput | StudentUpdateInput) => Promise<void>;
  }>(),
  { initial: undefined, allowAssignment: true },
);
const saving = ref(false);
const error = ref('');
const today = new Date().toISOString().slice(0, 10);
const form = reactive({
  name: props.initial?.user.name ?? '',
  phone: props.initial?.user.phone ?? '',
  password: '',
  homeStoreId: props.initial?.homeStoreId ?? 1,
  primaryTrainerId: props.initial?.primaryTrainerId?.toString() ?? '',
  gender: props.initial?.gender ?? 'female',
  birthDate: props.initial?.birthDate ?? '',
  emergencyContact: props.initial?.emergencyContact ?? '',
  membershipType: props.initial?.membershipType ?? 'count',
  membershipStartsOn: props.initial?.membershipStartsOn ?? today,
  membershipExpiresOn: props.initial?.membershipExpiresOn ?? today,
  membershipBalance: props.initial?.membershipBalance ?? 0,
  membershipActive: props.initial?.membershipActive ?? true,
  healthNotes: props.initial?.healthNotes ?? '',
  injuryHistory: props.initial?.injuryHistory ?? '',
  contraindications: props.initial?.contraindications ?? '',
  trainingGoal: props.initial?.trainingGoal ?? '',
  preferredStyle: props.initial?.preferredStyle ?? '',
});
async function submit() {
  saving.value = true;
  error.value = '';
  try {
    const profile: StudentUpdateInput = {
      homeStoreId: Number(form.homeStoreId),
      primaryTrainerId: form.primaryTrainerId ? Number(form.primaryTrainerId) : null,
      gender: form.gender,
      birthDate: form.birthDate || null,
      emergencyContact: form.emergencyContact,
      healthNotes: form.healthNotes,
      injuryHistory: form.injuryHistory,
      contraindications: form.contraindications,
      trainingGoal: form.trainingGoal,
      preferredStyle: form.preferredStyle,
    };
    await props.onSubmit(
      props.initial
        ? profile
        : ({
            ...profile,
            name: form.name,
            phone: form.phone,
            password: form.password || undefined,
            membershipType: form.membershipType,
            membershipStartsOn: form.membershipStartsOn,
            membershipExpiresOn: form.membershipExpiresOn,
            membershipBalance: Number(form.membershipBalance),
            membershipActive: form.membershipActive,
          } as StudentCreateInput),
    );
  } catch {
    error.value = '保存失败，请检查表单或稍后重试';
  } finally {
    saving.value = false;
  }
}
</script>
<template>
  <form class="form" @submit.prevent="submit">
    <h3>账号与归属</h3>
    <label>姓名<input v-model.trim="form.name" :disabled="!!initial" required /></label
    ><label
      >手机号<input
        v-model.trim="form.phone"
        :disabled="!!initial"
        required
        pattern="1[3-9][0-9]{9}" /></label
    ><label v-if="!initial"
      >初始密码<input
        v-model="form.password"
        type="password"
        minlength="8"
        placeholder="留空由后端采用默认策略" /></label
    ><label
      >所属门店 ID<input
        v-model.number="form.homeStoreId"
        type="number"
        min="1"
        required
        :disabled="!!initial && !allowAssignment" /></label
    ><label
      >主教练 ID<input
        v-model="form.primaryTrainerId"
        type="number"
        min="1"
        :disabled="!!initial && !allowAssignment" /></label
    ><label
      >性别<select v-model="form.gender">
        <option value="female">女</option>
        <option value="male">男</option>
      </select></label
    ><label>出生日期<input v-model="form.birthDate" type="date" /></label
    ><label>紧急联系人<input v-model.trim="form.emergencyContact" required /></label
    ><template v-if="!initial"
      ><h3>初始会员卡</h3>
      <label
        >卡类型<select v-model="form.membershipType">
          <option value="count">次卡</option>
          <option value="month">月卡</option>
          <option value="quarter">季卡</option>
          <option value="year">年卡</option>
          <option value="stored">储值卡</option>
        </select></label
      ><label>开始日期<input v-model="form.membershipStartsOn" type="date" required /></label
      ><label>到期日期<input v-model="form.membershipExpiresOn" type="date" required /></label
      ><label
        >次数/余额<input
          v-model.number="form.membershipBalance"
          type="number"
          min="0"
          required /></label
    ></template>
    <h3>健康与训练档案</h3>
    <label>健康备注<textarea v-model="form.healthNotes" /></label
    ><label>伤病史<textarea v-model="form.injuryHistory" /></label
    ><label>禁忌事项<textarea v-model="form.contraindications" /></label
    ><label>训练目标<textarea v-model="form.trainingGoal" /></label
    ><label>偏好流派<input v-model.trim="form.preferredStyle" /></label>
    <p v-if="error" class="error">{{ error }}</p>
    <button class="primary" :disabled="saving">{{ saving ? '保存中…' : '保存' }}</button>
  </form>
</template>
<style scoped>
.form {
  display: grid;
  gap: var(--space-4);
  max-width: 720px;
}
.form h3 {
  margin: var(--space-4) 0 0;
}
.form label {
  display: grid;
  gap: var(--space-1);
  color: var(--color-text-secondary);
}
input,
select,
textarea {
  padding: var(--space-3);
  font: inherit;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
textarea {
  min-height: 76px;
}
.primary {
  padding: var(--space-3);
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border: 0;
  border-radius: var(--radius-button);
}
.error {
  color: var(--color-danger);
}
</style>
