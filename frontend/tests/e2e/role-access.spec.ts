import { expect, test } from '@playwright/test';

const roles = [
  { phone: '13800000001', home: '/admin', marker: '瑜悦练 · 管理' },
  { phone: '13800000004', home: '/admin', marker: '瑜悦练 · 管理' },
  { phone: '13800000005', home: '/admin', marker: '瑜悦练 · 管理' },
  { phone: '13800000002', home: '/trainer', marker: '瑜悦练 · 训练师' },
  { phone: '13800000003', home: '/student', marker: '瑜悦练' },
] as const;

for (const role of roles) {
  test(`${role.phone} enters the correct role shell`, async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('手机号').fill(role.phone);
    await page.getByLabel('密码').fill('12345678');
    await page.getByRole('button', { name: '登录' }).click();
    await expect(page).toHaveURL(new RegExp(`${role.home}/?$`));
    await expect(page.getByText(role.marker, { exact: true }).first()).toBeVisible();
  });
}

test('student cannot enter management routes', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('手机号').fill('13800000003');
  await page.getByLabel('密码').fill('12345678');
  await page.getByRole('button', { name: '登录' }).click();
  await page.goto('/admin/users');
  await expect(page).toHaveURL(/\/forbidden$/);
  await expect(page.getByText('没有访问权限')).toBeVisible();
});
