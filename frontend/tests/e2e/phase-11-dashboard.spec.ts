import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/login?redirect=/admin/analytics');
  await page.getByLabel('手机号').fill('13800000001');
  await page.getByLabel('密码').fill('12345678');
  await page.getByRole('button', { name: '登录' }).click();
});

test('dashboard renders isolated demonstration metrics and schedules', async ({ page }) => {
  await expect(page).toHaveURL(/\/admin\/analytics$/);
  await expect(page.getByRole('heading', { name: '数据看板' })).toBeVisible();
  await expect(page.getByText('演示数据')).toBeVisible();
  await expect(page.getByText('今日课程', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('近七日预约趋势')).toBeVisible();
  await expect(page.getByText('晨间流瑜伽')).toBeVisible();
});

test('reminder center supports read and dismiss interactions', async ({ page }) => {
  await page.getByRole('link', { name: '提醒中心' }).first().click();
  await expect(page).toHaveURL(/\/admin\/reminders$/);
  const reminder = page.locator('li').filter({ hasText: '晚课即将满员' });
  await expect(reminder).toBeVisible();
  await reminder.getByRole('button', { name: '标为已读' }).click();
  await expect(reminder.getByRole('button', { name: '标为已读' })).toHaveCount(0);
  await reminder.getByRole('button', { name: '忽略' }).click();
  await expect(page.getByText('晚课即将满员')).toHaveCount(0);
});
