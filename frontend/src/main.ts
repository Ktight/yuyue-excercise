// 全局设计令牌 — 必须在所有组件之前加载
import '@/app/styles/tokens.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from '@/app/router';
import { config } from '@/shared/config';

async function bootstrap(): Promise<void> {
  if (import.meta.env.DEV && config.enableMock) {
    const { startMocks } = await import('@/app/mocks/start-mocks');
    await startMocks();
  }

  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  app.mount('#app');
}

void bootstrap();
