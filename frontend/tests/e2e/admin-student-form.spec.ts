import { expect, test } from '@playwright/test';

test('administrator creates students with readable assignments and explicit membership units', async ({
  page,
}) => {
  await page.goto('/login?redirect=/admin/students/new');
  await page.getByLabel('手机号').fill('13800000001');
  await page.getByLabel('密码').fill('12345678');
  await page.getByRole('button', { name: '登录' }).click();

  await expect(page).toHaveURL(/\/admin\/students\/new$/);
  await expect(page.getByRole('heading', { name: '新建学员' })).toBeVisible();
  await expect(page.getByLabel('所属门店')).toBeVisible();
  await expect(page.getByLabel('主教练（可选）')).toBeVisible();
  await expect(page.getByText('所属门店 ID')).toHaveCount(0);

  await page.getByLabel('卡类型').selectOption('stored');
  await expect(page.getByLabel('初始储值余额（元）')).toBeVisible();
  await expect(page.getByText('次数/余额')).toHaveCount(0);
});
