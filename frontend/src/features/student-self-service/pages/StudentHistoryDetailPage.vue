<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AppCard, AppEmpty, AppError, AppLoading, AppPage, AppStatusTag } from '@/app/components';
import { fetchStudentRecord } from '../api';
import type { StudentClassRecordDetail } from '../model';

const route = useRoute();
const router = useRouter();
const item = ref<StudentClassRecordDetail | null>(null);
const loading = ref(true);
const error = ref('');
const id = computed(() => Number(route.params.id));

async function load() {
  loading.value = true;
  error.value = '';
  try {
    item.value = await fetchStudentRecord(id.value);
  } catch {
    error.value = '训练记录不存在、无权访问或接口尚未交付';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <AppPage :title="item?.theme || '训练记录详情'">
    <template #header-extra><button class="back" @click="router.back()">返回</button></template>
    <AppLoading v-if="loading" />
    <AppError v-else-if="error" :message="error" show-retry @retry="load" />
    <div v-else-if="item" class="record-detail">
      <AppCard class="record-detail__summary">
        <div>
          <p>{{ item.classDate }} · 第 {{ item.sessionNumber }} 节</p>
          <h2>{{ item.trainerName }}</h2>
        </div>
        <div class="record-detail__rating">
          <span>完成度</span>
          <strong>{{ item.completionRating ?? '—' }}<small>/5</small></strong>
        </div>
      </AppCard>

      <div class="record-detail__grid">
        <AppCard>
          <h3>本节练习</h3>
          <ol class="poses">
            <li v-for="pose in item.poses" :key="`${pose.name}-${pose.durationMinutes}`">
              <div>
                <strong>{{ pose.name }}</strong>
                <p>{{ pose.notes || '按教练指导完成' }}</p>
              </div>
              <span>{{ pose.durationMinutes }} 分钟</span>
            </li>
          </ol>
        </AppCard>
        <AppCard>
          <h3>教练记录</h3>
          <p>{{ item.trainerNotes || '本节暂无教练记录。' }}</p>
          <h3>下次重点</h3>
          <p>{{ item.nextFocus || '由教练在下一次课程前确认。' }}</p>
          <div class="tags">
            <span v-for="tag in item.improvementTags" :key="tag">{{ tag }}</span>
          </div>
        </AppCard>
      </div>

      <AppCard>
        <div class="section-heading">
          <h3>课后练习</h3>
          <AppStatusTag
            :label="item.hasFeedback ? '已提交反馈' : '尚未反馈'"
            :type="item.hasFeedback ? 'success' : 'warning'"
          />
        </div>
        <p>{{ item.homework || '本节没有额外课后练习。' }}</p>
        <RouterLink v-if="!item.hasFeedback" :to="`/student/class-records/${item.id}/feedback`">
          提交课后反馈 →
        </RouterLink>
      </AppCard>

      <AppCard>
        <h3>课堂媒体</h3>
        <AppEmpty v-if="!item.media.length" description="本节暂无可见照片或视频" />
        <div v-else class="media-grid">
          <figure v-for="media in item.media" :key="media.id">
            <img
              v-if="media.type === 'image'"
              :src="media.thumbnailUrl || media.url"
              :alt="media.caption || '课堂照片'"
            />
            <video v-else :src="media.url" controls :poster="media.thumbnailUrl" />
            <figcaption>{{ media.caption }}</figcaption>
          </figure>
        </div>
      </AppCard>
    </div>
  </AppPage>
</template>

<style scoped>
.record-detail {
  display: grid;
  gap: var(--space-4);
}
.back {
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
}
.record-detail__summary,
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}
.record-detail__summary p,
.record-detail__rating span,
.record-detail p {
  color: var(--color-text-secondary);
}
.record-detail__summary h2,
h3 {
  margin: var(--space-1) 0;
}
.record-detail__rating {
  display: grid;
  text-align: right;
}
.record-detail__rating strong {
  color: var(--color-brand);
  font-size: var(--text-3xl);
}
.record-detail__rating small {
  font-size: var(--text-sm);
}
.record-detail__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}
.poses {
  display: grid;
  gap: var(--space-3);
  padding: 0;
  list-style: none;
}
.poses li {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border-light);
}
.poses p {
  margin: var(--space-1) 0 0;
}
.poses span {
  color: var(--color-brand);
  white-space: nowrap;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.tags span {
  padding: 2px var(--space-2);
  color: var(--color-brand);
  font-size: var(--text-xs);
  background: var(--color-brand-light);
  border-radius: var(--radius-full);
}
a {
  color: var(--color-brand);
  text-decoration: none;
}
.media-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
  margin-top: var(--space-4);
}
figure {
  margin: 0;
}
img,
video {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius-md);
}
figcaption {
  margin-top: var(--space-1);
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
}
@media (max-width: 700px) {
  .record-detail__grid {
    grid-template-columns: 1fr;
  }
  .media-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
