import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('手机号').fill('13800000002');
  await page.getByLabel('密码').fill('12345678');
  await page.getByRole('button', { name: '登录' }).click();
});

test('trainer can switch schedules to week view and open a schedule', async ({ page }) => {
  await page.goto('/trainer/schedules');
  await page.getByRole('button', { name: '周视图' }).click();
  await expect(page.getByLabel('排课周视图')).toBeVisible();
  await page.getByRole('button', { name: /流瑜伽基础/ }).click();
  await expect(page).toHaveURL(/\/trainer\/schedules\/1$/);
});

test('trainer can inspect a booking detail', async ({ page }) => {
  await page.goto('/trainer/bookings');
  await page.getByRole('button', { name: '查看详情' }).click();
  await expect(page).toHaveURL(/\/trainer\/bookings\/1$/);
  await expect(page.getByRole('heading', { name: '预约详情' })).toBeVisible();
  await expect(page.getByText('演示学员 · 13910000004')).toBeVisible();
});
