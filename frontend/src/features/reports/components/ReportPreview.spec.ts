import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ReportPreview from './ReportPreview.vue';

describe('ReportPreview', () => {
  it('renders stable empty states without inventing zero values', () => {
    const wrapper = mount(ReportPreview, {
      props: {
        report: {
          studentId: 1,
          studentName: '李学员',
          trainerName: '张教练',
          rangeStart: '2026-07-01',
          rangeEnd: '2026-07-23',
          generatedAt: '2026-07-23T12:00:00+08:00',
          trainingCount: 1,
          attendanceRate: null,
          averageRating: null,
          planProgress: null,
          ratingTrend: [],
          bodyMetrics: [],
          feedbackCount: 0,
          feelingDistribution: [],
          feedbackHighlights: [],
          trainerComments: '',
        },
      },
    });
    expect(wrapper.text()).toContain('暂无评分数据');
    expect(wrapper.text()).toContain('暂无可比较的身体评估');
    expect(wrapper.text()).toContain('尚未填写教练评语');
  });
});
