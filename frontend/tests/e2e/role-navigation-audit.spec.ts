import { expect, test, type Page } from '@playwright/test';

const managementNav = [
  '首页',
  '用户管理',
  '公司管理',
  '门店管理',
  '课程模板',
  '排课管理',
  '预约管理',
  '签到考勤',
  '课堂档案模板',
  '课时档案',
  '训练计划',
  '阶段报告',
  '数据看板',
  '提醒中心',
] as const;

const scenarios = [
  {
    role: '超级管理员',
    phone: '13800000001',
    home: '/admin',
    shellMarker: '瑜悦练 · 管理',
    navSelector: '.admin-layout__nav',
    expectedNav: managementNav,
    forbiddenPaths: ['/trainer', '/student'],
  },
  {
    role: '公司管理员',
    phone: '13800000004',
    home: '/admin',
    shellMarker: '瑜悦练 · 管理',
    navSelector: '.admin-layout__nav',
    expectedNav: managementNav,
    forbiddenPaths: ['/admin/companies/new', '/trainer', '/student'],
  },
  {
    role: '门店店长',
    phone: '13800000005',
    home: '/admin',
    shellMarker: '瑜悦练 · 管理',
    navSelector: '.admin-layout__nav',
    expectedNav: managementNav.filter((label) => label !== '用户管理' && label !== '公司管理'),
    forbiddenPaths: [
      '/admin/users',
      '/admin/companies',
      '/admin/course-templates/new',
      '/trainer',
      '/student',
    ],
  },
  {
    role: '训练师',
    phone: '13800000002',
    home: '/trainer',
    shellMarker: '瑜悦练 · 训练师',
    navSelector: '.trainer-layout__nav',
    expectedNav: [
      '首页',
      '学员管理',
      '课程安排',
      '课程模板',
      '预约管理',
      '签到考勤',
      '课堂档案模板',
      '课时档案',
      '训练规划',
      '阶段报告',
    ],
    forbiddenPaths: ['/admin', '/student'],
  },
  {
    role: '学员',
    phone: '13800000003',
    home: '/student',
    shellMarker: '瑜悦练',
    navSelector: '.student-layout__tabs',
    expectedNav: [
      '首页',
      '我的课程',
      '预约记录',
      '我的考勤',
      '训练历史',
      '训练计划',
      '我的档案',
      '我的反馈',
      '阶段报告',
    ],
    forbiddenPaths: ['/admin', '/trainer'],
  },
] as const;

const mobileScenarios = [
  {
    role: '管理端',
    phone: '13800000001',
    home: '/admin',
    shellMarker: '瑜悦练 · 管理',
    navSelector: '.admin-layout__nav',
    menuButton: '切换菜单',
    expectedNav: managementNav,
  },
  {
    role: '训练师端',
    phone: '13800000002',
    home: '/trainer',
    shellMarker: '训练师工作台',
    navSelector: '.trainer-layout__mobile-nav',
    expectedNav: ['首页', '学员', '课程', '我的'],
  },
  {
    role: '学员端',
    phone: '13800000003',
    home: '/student',
    shellMarker: '瑜悦练',
    navSelector: '.student-layout__bottom-nav',
    expectedNav: ['首页', '预约', '课程', '我的'],
  },
] as const;

async function login(page: Page, phone: string, home: string, shellMarker: string) {
  await page.goto('/login');
  await page.getByLabel('手机号').fill(phone);
  await page.getByLabel('密码').fill('12345678');
  await page.getByRole('button', { name: '登录' }).click();
  await expect(page).toHaveURL(new RegExp(`${home}/?$`));
  await expect(page.getByText(shellMarker, { exact: true }).first()).toBeVisible();
}

async function expectViewportAndActionsToBeUsable(page: Page) {
  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1);

  const unnamedActions = await page.locator('a:visible, button:visible').evaluateAll((elements) =>
    elements
      .filter((element) => {
        const name =
          element.getAttribute('aria-label')?.trim() ||
          element.getAttribute('title')?.trim() ||
          element.textContent?.trim();
        return !name;
      })
      .map((element) => element.outerHTML.slice(0, 200)),
  );
  expect(unnamedActions).toEqual([]);
}

for (const scenario of scenarios) {
  test(`${scenario.role}的全部主导航页面可访问且基础质量正常`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
    });
    page.on('pageerror', (error) => runtimeErrors.push(`page: ${error.message}`));

    await page.setViewportSize({ width: 1440, height: 900 });
    await login(page, scenario.phone, scenario.home, scenario.shellMarker);

    const nav = page.locator(scenario.navSelector);
    await expect(nav).toBeVisible();
    const navLinks = nav.getByRole('link');
    await expect(navLinks).toHaveCount(scenario.expectedNav.length);
    for (const label of scenario.expectedNav) {
      await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
    }

    const hrefs = await navLinks.evaluateAll((links) =>
      links
        .map((link) => link.getAttribute('href'))
        .filter((href): href is string => Boolean(href)),
    );

    for (const href of hrefs) {
      await test.step(`检查桌面页面 ${href}`, async () => {
        await page.goto(href);
        await page.waitForLoadState('networkidle');
        await expect(page).not.toHaveURL(/\/forbidden$/);
        await expect(page.getByText('页面不存在', { exact: false })).toHaveCount(0);
        await expectViewportAndActionsToBeUsable(page);
      });
    }

    for (const path of scenario.forbiddenPaths) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/forbidden$/);
      await expect(page.getByText('没有访问权限')).toBeVisible();
    }

    expect(runtimeErrors).toEqual([]);
  });
}

for (const scenario of mobileScenarios) {
  test(`${scenario.role}手机主导航可访问且没有横向溢出`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
    });
    page.on('pageerror', (error) => runtimeErrors.push(`page: ${error.message}`));

    await page.setViewportSize({ width: 390, height: 844 });
    await login(page, scenario.phone, scenario.home, scenario.shellMarker);

    if ('menuButton' in scenario) {
      await page.getByRole('button', { name: scenario.menuButton }).click();
    }

    const nav = page.locator(scenario.navSelector);
    await expect(nav).toBeVisible();
    const navLinks = nav.getByRole('link');
    await expect(navLinks).toHaveCount(scenario.expectedNav.length);
    for (const label of scenario.expectedNav) {
      await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
    }

    const hrefs = await navLinks.evaluateAll((links) =>
      links
        .map((link) => link.getAttribute('href'))
        .filter((href): href is string => Boolean(href)),
    );

    for (const href of hrefs) {
      await test.step(`检查手机页面 ${href}`, async () => {
        await page.goto(href);
        await page.waitForLoadState('networkidle');
        await expect(page).not.toHaveURL(/\/forbidden$/);
        await expect(page.getByText('页面不存在', { exact: false })).toHaveCount(0);
        await expectViewportAndActionsToBeUsable(page);
      });
    }

    expect(runtimeErrors).toEqual([]);
  });
}
