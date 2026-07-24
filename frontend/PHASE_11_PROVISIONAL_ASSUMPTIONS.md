# Phase 11 前端暂定假设台账

更新日期：2026-07-24
状态：`PROVISIONAL / CONTRACT_DRAFT`

## 边界

- 官方 contracts 1.8.0 中 `dashboards`、`reminders` 为 `DRAFT / NOT_STARTED`。
- 暂定字段只能存在于 `features/dashboard`、`features/reminders` 的模型、Mock 与 `backend-adapters`。
- Vue 页面不得引用后端草案字段，也不得宣称真实联调完成。
- Mock 模式必须显示“演示数据”；真实模式遇到不兼容响应必须明确失败。

## PA-11-01 看板指标

暂定管理看板包含今日课程、今日预约、活跃学员和待处理事项；趋势为近七日预约量，另含今日课程摘要。

待后端冻结：统计时区、租户/门店范围、指标定义、趋势粒度、空数据语义。

## PA-11-02 提醒模型

暂定提醒包含 `id/title/message/category/priority/createdAt/read/dismissed/action`。操作包括标为已读和忽略。

待后端冻结：分类与优先级枚举、目标角色、动作链接白名单、分页排序、已读/忽略幂等语义。

## PA-11-03 角色范围

本轮只开放管理端页面；训练师与学员看板继续使用现有首页，等待各自契约和产品范围冻结。

## 2026-07-24 后端候选交接核对

- 后端已提供 `PHASE_11_BACKEND_AUDIT.md` 和 `PHASE_11_FRONTEND_HANDOFF.md`；
  候选实现状态为 `IMPLEMENTED / TESTED / AWAITING_CONTRACT_FREEZE`。
- 当前远程 contracts 仍为 1.8.0，`dashboards`、`reminders` 仍是
  `DRAFT / NOT_STARTED`，远程仓库中尚无可见的 Phase 11 后端候选提交。
- 管理看板候选结构与暂定字段大体一致，但提醒候选返回
  `{items,page,page_size,total}`，当前 adapter 期待扁平数组，不能直接联调。
- 后端分页会使当前本地“仅看未读”过滤失去全量准确性，正式契约需要服务端
  `unread_only` 参数或同等能力。
- 前端裁决建议、冻结清单和后续修改范围见
  `PHASE_11_CONTRACT_DECISION_RESPONSE.md`。
- 契约冻结前不修改生成类型、adapter、Mock 或页面，不提升功能状态。

## 功能 19 学员端阻塞

可安全完成：

- `/api/feedback/` 正式允许 student 自助读取，已完成“我的反馈”页面；
- `/api/reports/` 正式允许 student 以本人 User ID 查询，已完成“我的阶段报告”页面。

不可安全继续：

- `/api/student/class-records/`、`/api/student/training-plans/`、`/api/student/home/` 和 `/api/student/profile/` 仍为 DRAFT；
- 正式 `/api/class-records/` 与 `/api/training-plans/` 明确不允许 student，不能复用管理端接口绕过权限；
- 因此训练历史、我的训练计划、学员聚合首页和完整学员档案保持阻塞，不创建虚构字段。
