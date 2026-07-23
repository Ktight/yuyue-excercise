<script setup lang="ts">
import { ref } from 'vue';
import { AppError, AppLoading, AppPage } from '@/app/components';
import { useAuthStore } from '@/features/auth';
import { previewStageReport } from '../api';
import { ReportPreview, StudentReportRangeForm } from '../components';
import { printStageReport } from '../services/report-exporter';
import type { ReportRequest, StageReport } from '../model';
const auth = useAuthStore(),
  report = ref<StageReport | null>(null),
  loading = ref(false),
  error = ref('');
async function generate(input: ReportRequest) {
  loading.value = true;
  error.value = '';
  try {
    report.value = await previewStageReport(input);
  } catch {
    error.value = '报告生成失败，请稍后重试';
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <AppPage title="我的阶段报告"
    ><template #header-extra
      ><button v-if="report" @click="printStageReport">打印 / 导出</button></template
    ><StudentReportRangeForm
      v-if="auth.user?.id"
      :student-id="auth.user.id"
      :on-submit="generate" /><AppError
      v-else
      message="当前会话缺少用户标识，请重新登录" /><AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error" /><ReportPreview v-else-if="report" :report="report"
  /></AppPage>
</template>
