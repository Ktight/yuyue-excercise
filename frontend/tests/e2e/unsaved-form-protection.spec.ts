import { expect, test } from '@playwright/test';

test('management forms protect unsaved work during in-app navigation', async ({ page }) => {
  await page.goto('/login?redirect=/admin/companies/new');
  await page.getByLabel('手机号').fill('13800000001');
  await page.getByLabel('密码').fill('12345678');
  await page.getByRole('button', { name: '登录' }).click();

  await expect(page).toHaveURL(/\/admin\/companies\/new$/);
  await page.getByLabel('公司名称 *').fill('尚未保存的公司');
  await page.getByRole('link', { name: '数据看板' }).click();

  const dialog = page.getByRole('dialog', { name: '离开当前页面？' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: '取消' }).click();
  await expect(page).toHaveURL(/\/admin\/companies\/new$/);
  await expect(page.getByLabel('公司名称 *')).toHaveValue('尚未保存的公司');

  await page.getByRole('link', { name: '数据看板' }).click();
  await dialog.getByRole('button', { name: '放弃修改' }).click();
  await expect(page).toHaveURL(/\/admin\/analytics$/);
});
