# Phase 11 契约冻结交付

冻结日期：2026-07-24

契约版本：`1.9.0`

后端基线：`66b6dce`，已通过 PR #7 合并到 `main@f2f2127`

## 冻结范围

- 本阶段只发布管理看板 `/api/dashboards/admin/`。
- 允许 `super_admin`、`company_admin`、`store_manager`；训练师和学员看板延期。
- 管理看板固定使用 `Asia/Shanghai`，返回四项指标、七日预约趋势和今日排课。
- 提醒列表使用 `{items,page,page_size,total}`，默认 20、最大 100。
- `unread_only` 是正式布尔查询参数，默认 `false`，在分页前筛选。
- 分类、优先级、排序和管理端站内动作路径白名单正式冻结。
- read/dismiss 为单向幂等动作，成功返回完整提醒；不存在、失效或非当前用户统一 404。
- GET 允许幂等物化每用户状态，但不得改变重复读取的响应语义和统计结果。
- 来源重新出现时状态保留属于后端产品策略，客户端不依赖保留期限。

## 状态

`dashboards`、`reminders` 更新为 `CONTRACT_READY / API_READY`。

前端下一步必须从 `contracts/openapi.yaml` 和 `contracts/enums.json` 重新生成，
再集中修改 adapter、Mock、分页、服务端未读筛选及动作响应处理。真实 API
角色/租户/错误矩阵和浏览器回归通过前，不得标记 `INTEGRATED / VERIFIED`。
