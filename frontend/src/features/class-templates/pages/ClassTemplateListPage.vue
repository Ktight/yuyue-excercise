<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AppEmpty, AppError, AppLoading, AppPage, AppPagination } from '@/app/components';
import { useAuthStore } from '@/features/auth';
import { fetchClassTemplates } from '@/features/class-templates/api';
import type { ClassTemplate, ClassTemplateScope } from '@/features/class-templates/model';
const router = useRouter(),
  auth = useAuthStore();
const items = ref<ClassTemplate[]>([]),
  loading = ref(true),
  error = ref(''),
  page = ref(1),
  total = ref(0),
  scope = ref<ClassTemplateScope | ''>('');
const canManage = computed(() => ['super_admin', 'company_admin'].includes(auth.userRole ?? '')),
  prefix = computed(() => (auth.userRole === 'trainer' ? '/trainer' : '/admin'));
async function load() {
  loading.value = true;
  error.value = '';
  try {
    const r = await fetchClassTemplates({
      page: page.value,
      pageSize: 20,
      scope: scope.value || undefined,
    });
    items.value = r.items;
    total.value = r.total;
  } catch {
    error.value = '课堂记录模板加载失败';
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>
<template>
  <AppPage title="课堂记录模板"
    ><template v-if="canManage" #header-extra
      ><button class="primary" @click="router.push('/admin/class-templates/new')">
        新建模板
      </button></template
    >
    <label class="filter"
      >共享范围<select
        v-model="scope"
        @change="
          page = 1;
          load();
        "
      >
        <option value="">全部</option>
        <option value="personal">个人模板</option>
        <option value="company_shared">公司共享</option>
      </select></label
    >
    <AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load" /><AppEmpty v-else-if="!items.length" description="暂无课堂记录模板" />
    <div v-else class="cards">
      <button
        v-for="item in items"
        :key="item.id"
        class="card"
        @click="router.push(`${prefix}/class-templates/${item.id}`)"
      >
        <strong>{{ item.name }}</strong
        ><span
          >{{ item.trainerName }} ·
          {{ item.scope === 'company_shared' ? '公司共享' : '个人模板' }}</span
        ><small
          >热身 {{ item.poseSequence.warmup.length }} · 主体 {{ item.poseSequence.main.length }} ·
          放松 {{ item.poseSequence.cooldown.length }}</small
        >
      </button>
    </div>
    <AppPagination
      v-if="total"
      :page="page"
      :page-size="20"
      :total="total"
      @change="
        (v) => {
          page = v;
          load();
        }
      "
  /></AppPage>
</template>
<style scoped>
.filter {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
select {
  padding: var(--space-2);
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-4);
}
.card {
  display: grid;
  gap: var(--space-2);
  text-align: left;
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
.card span,
.card small {
  color: var(--color-text-secondary);
}
.primary {
  padding: var(--space-2) var(--space-4);
  color: white;
  background: var(--color-brand);
  border: 0;
  border-radius: var(--radius-button);
}
</style>
