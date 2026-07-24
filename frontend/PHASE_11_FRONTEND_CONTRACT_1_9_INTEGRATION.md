# Phase 11 前端 contracts 1.9.0 对齐记录

更新日期：2026-07-24  
分支：`frontend/phase-11-contract-1.9-clean`
官方契约：contracts 1.9.0，提交 `a7fba3a`  
当前状态：`CONTRACT_READY / API_READY / UI_READY / MOCK_READY / NOT_INTEGRATED`

## 1. 本轮范围

本轮只对齐官方已冻结的管理看板和提醒中心，不扩展 trainer/student 看板，不修改
`backend/**`，也不手工修改 `contracts/**`。官方契约通过合并 `origin/main` 进入当前前端分支，
随后执行生成脚本。

## 2. 管理看板

- `dashboard.adapter.ts` 直接使用生成的 `AdminDashboardSuccessResponse`；
- 页面继续只读取稳定 `AdminDashboardSummary`，不接触 `snake_case`；
- 正式映射 `generated_at`、`timezone`、四项指标、七日趋势和今日课程；
- 指标说明同步正式统计口径，页面展示快照生成时间和上海时区；
- Mock 使用正式具名响应，趋势标签为连续本地日历日期；
- 加载失败保留结构化后端消息和 `request_id`，支持原位重试；
- 仅在 Mock 模式显示演示标识，真实模式不再显示“等待契约冻结”。

## 3. 提醒中心

- `reminders.adapter.ts` 使用生成的 Reminder、分页和动作响应类型；
- 列表查询正式传递 `page`、`page_size`、`unread_only`；
- 页面使用服务端返回的 `items/page/page_size/total`，不再对单页结果做假全量筛选；
- 已读和忽略动作返回完整 Reminder；页面不盲改未知字段；
- 忽略为不可撤销动作，提交前显示危险操作确认；
- 操作期间禁止重复请求、切页和筛选，失败留在当前列表并显示安全错误；
- `action_to` 只允许契约规定的管理端站内路由，外链、任意路径以及无标签动作不会渲染；
- 分类和优先级类型及标签来自生成枚举，不再由功能代码复制维护；
- MSW 实现正式分页、服务端未读筛选、动作响应和 404 行为。

## 4. 验证证据

- `npm.cmd run check:all`：通过；
- OpenAPI 类型与枚举生成：通过；
- TypeScript、ESLint、Prettier：通过；
- 模块边界：452 个源文件通过；
- Vitest：57 个测试文件、165 项测试通过；
- 生产构建：890 个模块转换成功；
- 包体：最大 JS 分块 320.7 KiB，总 JS 778.5 KiB；
- Phase 11 Playwright：2/2 通过；
- 全量 Playwright：17/17 通过。

## 5. 尚未完成

- 尚未关闭 Mock，使用真实超级管理员、公司管理员、店长完成浏览器联调；
- 尚未验证双租户隔离和 400、401、403、404、500 错误矩阵；
- trainer/student 看板明确不在 contracts 1.9.0 范围；
- 学员聚合首页、训练历史、训练计划和完整档案仍等待各自正式契约。

因此本轮不得标记 `INTEGRATED / VERIFIED`。真实后端到位后只需切换环境配置并执行联调，
不应再改写页面业务模型。
