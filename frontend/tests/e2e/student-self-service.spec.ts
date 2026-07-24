import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('手机号').fill('13800000003');
  await page.getByLabel('密码').fill('12345678');
  await page.getByRole('button', { name: '登录' }).click();
});

test('student can view own feedback history', async ({ page }) => {
  await page.goto('/student/feedback');
  await expect(page.getByRole('heading', { name: '我的反馈' })).toBeVisible();
  await expect(page.getByText('核心动作仍需要继续练习。')).toBeVisible();
});

test('student report uses the current session identity without a student selector', async ({
  page,
}) => {
  await page.goto('/student/reports');
  await expect(page.getByRole('heading', { name: '我的阶段报告' })).toBeVisible();
  await expect(page.locator('select').filter({ has: page.getByText('学员') })).toHaveCount(0);
  await page.getByRole('button', { name: '生成我的报告' }).click();
  await expect(page.getByText('训练次数')).toBeVisible();
  await expect(page.getByText('演示学员')).toBeVisible();
});

test('student self-service navigation covers home, history, plans and archive', async ({ page }) => {
  await page.goto('/student');
  await expect(page.getByRole('heading', { name: '你好，李学员' })).toBeVisible();
  await expect(page.getByText('肩颈舒缓私教')).toBeVisible();

  await page.goto('/student/history');
  await expect(page.getByRole('heading', { name: '训练历史' })).toBeVisible();
  await page.getByText('肩颈舒展与呼吸').click();
  await expect(page).toHaveURL(/\/student\/history\/801$/);
  await expect(page.getByRole('heading', { name: '本节练习' })).toBeVisible();

  await page.goto('/student/plans');
  await expect(page.getByRole('heading', { name: '我的训练计划' })).toBeVisible();
  await page.getByText('12 周肩颈与体态改善').click();
  await expect(page).toHaveURL(/\/student\/plans\/701$/);
  await expect(page.getByText('计划完成度')).toBeVisible();

  await page.goto('/student/profile');
  await expect(page.getByRole('heading', { name: '我的档案' })).toBeVisible();
  await expect(page.getByText('24 次私教卡')).toBeVisible();
  await expect(page.getByText('柔韧评分')).toBeVisible();
});
