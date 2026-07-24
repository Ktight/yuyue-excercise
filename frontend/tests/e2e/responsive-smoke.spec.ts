import { expect, test } from '@playwright/test';

test('student navigation and reports fit a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/login');
  await page.getByLabel('手机号').fill('13800000003');
  await page.getByLabel('密码').fill('12345678');
  await page.getByRole('button', { name: '登录' }).click();
  await expect(page.getByRole('navigation', { name: '学员端主导航' })).toBeVisible();
  await page.goto('/student/reports');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(overflow).toBe(false);
});

test('management menu and dashboard remain operable at tablet width', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/login?redirect=/admin/analytics');
  await page.getByLabel('手机号').fill('13800000001');
  await page.getByLabel('密码').fill('12345678');
  await page.getByRole('button', { name: '登录' }).click();
  await expect(page.getByRole('heading', { name: '数据看板' })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(overflow).toBe(false);
});
