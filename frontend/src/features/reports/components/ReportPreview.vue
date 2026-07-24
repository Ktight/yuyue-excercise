<script setup lang="ts">
import type { StageReport } from '../model';
defineProps<{ report: StageReport }>();
</script>
<template>
  <article id="stage-report" class="report">
    <header>
      <div>
        <small>瑜悦练 · 阶段报告</small>
        <h2>{{ report.studentName }}</h2>
      </div>
      <p>{{ report.rangeStart }} 至 {{ report.rangeEnd }}<br />教练：{{ report.trainerName }}</p>
    </header>
    <section class="stats">
      <div>
        <strong>{{ report.trainingCount }}</strong
        ><span>训练次数</span>
      </div>
      <div>
        <strong>{{ report.attendanceRate == null ? '—' : `${report.attendanceRate}%` }}</strong
        ><span>出勤率</span>
      </div>
      <div>
        <strong>{{ report.averageRating ?? '—' }}</strong
        ><span>平均评分</span>
      </div>
      <div>
        <strong>{{ report.planProgress == null ? '—' : `${report.planProgress}%` }}</strong
        ><span>计划进度</span>
      </div>
    </section>
    <section>
      <h3>训练评分趋势</h3>
      <p v-if="!report.ratingTrend.length">暂无评分数据</p>
      <div v-else class="trend">
        <span v-for="p in report.ratingTrend" :key="p.date"
          >{{ p.date }}<strong>{{ p.rating }}</strong></span
        >
      </div>
    </section>
    <section>
      <h3>体态指标对比</h3>
      <p v-if="!report.bodyMetrics.length">暂无可比较的身体评估</p>
      <table v-else>
        <thead>
          <tr>
            <th>指标</th>
            <th>期初</th>
            <th>期末</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in report.bodyMetrics" :key="m.label">
            <td>{{ m.label }}</td>
            <td>{{ m.before ?? '—' }} {{ m.unit }}</td>
            <td>{{ m.after ?? '—' }} {{ m.unit }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section>
      <h3>学员反馈</h3>
      <p>{{ report.feedbackCount }} 次反馈</p>
      <ul>
        <li v-for="i in report.feelingDistribution" :key="i.label">{{ i.label }}：{{ i.count }}</li>
      </ul>
      <blockquote v-for="t in report.feedbackHighlights" :key="t">{{ t }}</blockquote>
    </section>
    <section>
      <h3>教练评语</h3>
      <p>{{ report.trainerComments || '尚未填写教练评语' }}</p>
    </section>
    <footer>生成时间：{{ report.generatedAt }} · 当前为暂定 Mock 预览</footer>
  </article>
</template>
<style scoped>
.report {
  display: grid;
  gap: var(--space-5);
  padding: var(--space-6);
  background: var(--color-surface);
  border-radius: var(--radius-card);
}
header {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
}
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
}
.stats div {
  display: grid;
  padding: var(--space-4);
  background: var(--color-background);
  border-radius: var(--radius-control);
}
.stats strong {
  font-size: var(--font-size-2xl);
  color: var(--color-brand);
}
.trend {
  display: flex;
  gap: var(--space-3);
  overflow-x: auto;
}
.trend span {
  display: grid;
  min-width: 90px;
  padding: var(--space-3);
  border: 1px solid var(--color-border);
}
table {
  width: 100%;
  border-collapse: collapse;
}
td,
th {
  padding: var(--space-2);
  border-bottom: 1px solid var(--color-border);
  text-align: left;
}
footer {
  color: var(--color-text-secondary);
}
@media (max-width: 640px) {
  header {
    display: block;
  }
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .report {
    padding: var(--space-4);
  }
}
@media print {
  footer {
    display: none;
  }
}
</style>
