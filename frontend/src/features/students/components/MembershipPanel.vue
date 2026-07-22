<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { fetchEligibility, fetchMembership, updateMembership } from '@/features/students/api';
import type { Membership, StudentEligibility } from '@/features/students/model';
const props = withDefaults(defineProps<{ studentId: number; readonly?: boolean }>(), {
  readonly: false,
});
const membership = ref<Membership | null>(null),
  eligibility = ref<StudentEligibility | null>(null),
  error = ref(''),
  saving = ref(false);
const form = reactive({
  cardType: 'count' as Membership['cardType'],
  startsOn: '',
  expiresOn: '',
  remainingCount: 0,
  balanceMinor: 0,
  active: true,
});
async function load() {
  error.value = '';
  try {
    const current = await fetchMembership(props.studentId);
    membership.value = current;
    eligibility.value = await fetchEligibility(props.studentId);
    Object.assign(form, {
      cardType: current.cardType,
      startsOn: current.startsOn,
      expiresOn: current.expiresOn,
      remainingCount: current.remainingCount ?? 0,
      balanceMinor: current.balanceMinor ?? 0,
      active: current.active,
    });
  } catch {
    error.value = '会员资格加载失败';
  }
}
async function save() {
  if (props.readonly) return;
  saving.value = true;
  try {
    membership.value = await updateMembership(props.studentId, { ...form });
    await load();
  } catch {
    error.value = '会员资格保存失败';
  } finally {
    saving.value = false;
  }
}
onMounted(load);
</script>
<template>
  <section>
    <p v-if="error" class="error">{{ error }}</p>
    <template v-if="membership"
      ><div class="eligibility" :class="{ invalid: !eligibility?.isEligible }">
        <strong>{{ eligibility?.isEligible ? '当前可预约' : '当前不可预约' }}</strong
        ><span>{{ eligibility?.reason || '会员资格有效' }}</span>
      </div>
      <form class="grid" @submit.prevent="save">
        <label
          >卡类型<select v-model="form.cardType">
            <option value="count">次卡</option>
            <option value="month">月卡</option>
            <option value="quarter">季卡</option>
            <option value="year">年卡</option>
            <option value="stored">储值卡</option>
          </select></label
        ><label>开始日期<input v-model="form.startsOn" type="date" /></label
        ><label>到期日期<input v-model="form.expiresOn" type="date" /></label
        ><label v-if="form.cardType === 'count'"
          >剩余次数<input v-model.number="form.remainingCount" type="number" min="0" /></label
        ><label v-if="form.cardType === 'stored'"
          >余额（分）<input v-model.number="form.balanceMinor" type="number" min="0" /></label
        ><label class="check"><input v-model="form.active" type="checkbox" />启用会员卡</label
        ><button v-if="!readonly" :disabled="saving">保存会员资格</button>
      </form></template
    >
  </section>
</template>
<style scoped>
.eligibility,
.grid {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
.eligibility.invalid,
.error {
  color: var(--color-danger);
}
label {
  display: grid;
  gap: var(--space-1);
}
input,
select,
button {
  padding: var(--space-3);
  font: inherit;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
.check {
  display: flex;
  align-items: center;
}
</style>
