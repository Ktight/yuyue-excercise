<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { BodyAssessment } from '../model';
const props = defineProps<{ assessments: BodyAssessment[] }>();
const beforeId = ref<number | null>(null),
  afterId = ref<number | null>(null);
watch(
  () => props.assessments,
  (items) => {
    beforeId.value = items.at(-1)?.id ?? null;
    afterId.value = items[0]?.id ?? null;
  },
  { immediate: true },
);
const before = computed(() => props.assessments.find((item) => item.id === beforeId.value));
const after = computed(() => props.assessments.find((item) => item.id === afterId.value));
const metrics = computed(() => [
  { label: '体重', unit: 'kg', before: before.value?.weight, after: after.value?.weight },
  {
    label: '柔韧性',
    unit: '分',
    before: before.value?.flexibilityScore,
    after: after.value?.flexibilityScore,
  },
  {
    label: '核心力量',
    unit: '分',
    before: before.value?.coreStrengthScore,
    after: after.value?.coreStrengthScore,
  },
]);
const delta = (left: number | null | undefined, right: number | null | undefined) =>
  left == null || right == null
    ? '—'
    : `${right - left > 0 ? '+' : ''}${(right - left).toFixed(1)}`;
</script>
<template>
  <section class="comparison">
    <div class="heading">
      <h3>评估对比</h3>
      <div>
        <label
          >较早记录<select v-model.number="beforeId">
            <option v-for="item in assessments" :key="item.id" :value="item.id">
              {{ item.assessDate }}
            </option>
          </select></label
        ><label
          >较新记录<select v-model.number="afterId">
            <option v-for="item in assessments" :key="item.id" :value="item.id">
              {{ item.assessDate }}
            </option>
          </select></label
        >
      </div>
    </div>
    <p v-if="assessments.length < 2" class="empty">至少需要两次评估才能对比</p>
    <template v-else-if="before && after"
      ><div class="metrics">
        <article v-for="metric in metrics" :key="metric.label">
          <span>{{ metric.label }}</span
          ><strong>{{ metric.before ?? '—' }} → {{ metric.after ?? '—' }} {{ metric.unit }}</strong
          ><small>变化 {{ delta(metric.before, metric.after) }}</small>
        </article>
      </div>
      <dl>
        <div>
          <dt>脊柱</dt>
          <dd>{{ before.postureSpine || '—' }} → {{ after.postureSpine || '—' }}</dd>
        </div>
        <div>
          <dt>骨盆</dt>
          <dd>{{ before.posturePelvis || '—' }} → {{ after.posturePelvis || '—' }}</dd>
        </div>
        <div>
          <dt>肩部</dt>
          <dd>{{ before.postureShoulder || '—' }} → {{ after.postureShoulder || '—' }}</dd>
        </div>
      </dl></template
    >
  </section>
</template>
<style scoped>
.comparison {
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
.heading,
.heading > div {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-3);
}
h3 {
  margin: 0;
}
label {
  display: grid;
  gap: var(--space-1);
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
}
select {
  padding: var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
.metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-top: var(--space-4);
}
article {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-3);
  background: var(--color-brand-light);
  border-radius: var(--radius-md);
}
article span,
article small,
.empty,
dt {
  color: var(--color-text-secondary);
}
dl {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}
dd {
  margin: var(--space-1) 0 0;
}
@media (max-width: 700px) {
  .heading {
    align-items: stretch;
    flex-direction: column;
  }
  .heading > div,
  .metrics,
  dl {
    grid-template-columns: 1fr;
    display: grid;
  }
}
</style>
