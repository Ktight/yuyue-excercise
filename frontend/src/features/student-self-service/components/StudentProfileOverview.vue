<script setup lang="ts">
import { AppCard, AppStatusTag } from '@/app/components';
import type { StudentProfileArchive } from '../model';

defineProps<{ profile: StudentProfileArchive }>();

const membershipLabels = { active: '生效中', expired: '已到期', frozen: '已冻结' };
const membershipTypes = { active: 'success', expired: 'default', frozen: 'warning' } as const;
</script>

<template>
  <div class="profile-overview">
    <AppCard class="identity">
      <div class="avatar">{{ profile.studentName.slice(0, 1) }}</div>
      <div>
        <h2>{{ profile.studentName }}</h2>
        <p>{{ profile.phone }} · {{ profile.storeName }}</p>
        <small>加入于 {{ profile.joinedAt }} · 主教练 {{ profile.trainerName }}</small>
      </div>
      <RouterLink to="/profile">账户设置</RouterLink>
    </AppCard>

    <div class="profile-overview__grid">
      <AppCard>
        <div class="section-heading">
          <h3>会员权益</h3>
          <AppStatusTag
            v-if="profile.membership"
            :label="membershipLabels[profile.membership.status]"
            :type="membershipTypes[profile.membership.status]"
          />
        </div>
        <template v-if="profile.membership">
          <strong class="primary-value">{{ profile.membership.typeLabel }}</strong>
          <dl>
            <div v-if="profile.membership.remainingSessions !== null">
              <dt>剩余次数</dt>
              <dd>{{ profile.membership.remainingSessions }} 次</dd>
            </div>
            <div v-if="profile.membership.balanceCents !== null">
              <dt>储值余额</dt>
              <dd>¥{{ (profile.membership.balanceCents / 100).toFixed(2) }}</dd>
            </div>
            <div v-if="profile.membership.expiresAt">
              <dt>有效期至</dt>
              <dd>{{ profile.membership.expiresAt }}</dd>
            </div>
          </dl>
        </template>
        <p v-else class="empty">暂无有效会员权益</p>
      </AppCard>

      <AppCard>
        <h3>最近身体评估</h3>
        <template v-if="profile.latestAssessment">
          <p class="assessment-date">{{ profile.latestAssessment.assessedAt }}</p>
          <dl>
            <div>
              <dt>体重</dt>
              <dd>{{ profile.latestAssessment.weightKg ?? '—' }} kg</dd>
            </div>
            <div>
              <dt>体脂率</dt>
              <dd>{{ profile.latestAssessment.bodyFatPercentage ?? '—' }}%</dd>
            </div>
            <div>
              <dt>柔韧评分</dt>
              <dd>{{ profile.latestAssessment.flexibilityScore ?? '—' }}</dd>
            </div>
          </dl>
        </template>
        <p v-else class="empty">暂无身体评估</p>
      </AppCard>
    </div>

    <AppCard>
      <h3>训练目标</h3>
      <div class="goals">
        <span v-for="goal in profile.trainingGoals" :key="goal">{{ goal }}</span>
      </div>
    </AppCard>

    <p class="privacy">
      档案仅展示后端允许学员本人查看的字段；医疗、联系方式和教练内部备注不会在此页面推断展示。
    </p>
  </div>
</template>

<style scoped>
.profile-overview {
  display: grid;
  gap: var(--space-4);
}
.identity {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-4);
}
.avatar {
  display: grid;
  width: 68px;
  height: 68px;
  place-items: center;
  color: var(--color-text-inverse);
  background: linear-gradient(145deg, var(--color-brand), var(--color-accent));
  border-radius: 50%;
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
}
h2,
h3 {
  margin: 0;
}
.identity p,
.identity small,
.assessment-date,
.empty,
.privacy {
  color: var(--color-text-secondary);
}
.identity a {
  color: var(--color-brand);
  text-decoration: none;
}
.profile-overview__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.primary-value {
  display: block;
  margin: var(--space-5) 0;
  color: var(--color-brand);
  font-size: var(--text-xl);
}
dl {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
  margin: var(--space-4) 0 0;
}
dt {
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
}
dd {
  margin: var(--space-1) 0 0;
  font-weight: var(--font-semibold);
}
.goals {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-4);
}
.goals span {
  padding: var(--space-2) var(--space-3);
  color: var(--color-brand);
  background: var(--color-brand-light);
  border-radius: var(--radius-full);
}
.privacy {
  margin: 0;
  font-size: var(--text-xs);
}
@media (max-width: 700px) {
  .profile-overview__grid {
    grid-template-columns: 1fr;
  }
  .identity {
    grid-template-columns: auto 1fr;
  }
  .identity a {
    grid-column: 2;
  }
}
</style>
