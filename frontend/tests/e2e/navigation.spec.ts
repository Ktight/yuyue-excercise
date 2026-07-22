import { expect, test } from '@playwright/test';

test('trainer login keeps feature pages inside the trainer layout', async ({ page }) => {
  await page.goto('/login?redirect=/trainer/attendance');
  await page.getByLabel('手机号').fill('13800000002');
  await page.getByLabel('密码').fill('12345678');
  await page.getByRole('button', { name: '登录' }).click();

  await expect(page).toHaveURL(/\/trainer\/attendance$/);
  await expect(page.getByText('瑜悦练 · 训练师')).toBeVisible();
  await expect(page.getByRole('heading', { name: '签到考勤' })).toBeVisible();
  await expect(page.getByRole('link', { name: '修改密码' })).toBeVisible();
  const logout = page.getByRole('button', { name: '退出登录' });
  await expect(logout).toBeVisible();
  await logout.click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: '瑜悦练' })).toBeVisible();
});
