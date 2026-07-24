<script setup lang="ts">
import { ref } from 'vue';
import { AppError, AppLoading, AppPage } from '@/app/components';
import { previewStageReport } from '../api';
import { ReportPreview, ReportRangeForm } from '../components';
import { printStageReport } from '../services/report-exporter';
import type { ReportRequest, StageReport } from '../model';
const report = ref<StageReport | null>(null),
  loading = ref(false),
  error = ref('');
async function generate(input: ReportRequest) {
  loading.value = true;
  error.value = '';
  try {
    report.value = await previewStageReport(input);
  } catch {
    error.value = '报告生成失败';
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <AppPage title="阶段报告"
    ><template #header-extra
      ><button v-if="report" @click="printStageReport">打印 / 导出</button
      ><button disabled title="等待分享契约">分享（待开放）</button></template
    ><ReportRangeForm :on-submit="generate" /><AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error" /><ReportPreview v-else-if="report" :report="report"
  /></AppPage>
</template>
