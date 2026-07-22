# Phase 6 前端实施基线

日期：2026-07-22

契约版本：`1.4.0`

正式后端提交：

- `a9c2b1d feat: complete phase 6 scheduling and bookings`
- `e136c6f feat: complete phase 7 attendance`

## 当前结论

- Schedules：`CONTRACT_READY / API_READY`
- Bookings：`CONTRACT_READY / API_READY`
- 正式契约已经通过 `origin/main` 合入当前前端分支，不再使用 ZIP 作为事实来源。
- 合并后已重新生成 OpenAPI 类型与枚举，Phase 1–5 的 `check:all` 全部通过。
- 当前 `schedules`、`bookings` 功能目录没有可复用业务文件，Phase 6 前端需要从领域模型开始实现。

## 实施顺序

1. 建立 Schedule、RecurringRule、Booking 的前端领域模型。
2. 在 `src/backend-adapters/` 建立 schedules 与 bookings 适配器，集中处理正式路径、响应包装、snake_case 和数字 ID。
3. 建立契约一致的 MSW fixtures/handlers，并覆盖单次排课、周期排课、冲突、预约和取消。
4. 完成排课列表、日期/门店/教练/课程类型/状态筛选。
5. 完成单次和周期排课表单；周期规则使用 ISO weekday 1–7，周数限制 1–52。
6. 完成排课详情、编辑、取消/删除和预约人数展示。
7. 完成员工代预约和学员自助预约；学员自助请求不提交 `student_id`。
8. 完成预约列表、详情和取消；重复预约与重复取消按 409 展示业务错误。
9. 按角色注册管理端、教练端、学员端路由和按钮权限。
10. 补充适配器、Mock、权限、导航和关键组件测试，运行 `check:all`。
11. 使用正式后端验证冲突、容量、截止时间、会员资格、次卡扣减/恢复及双租户隔离。

## 关键契约边界

- 排课列表仅员工角色可访问；排课创建仅超级管理员、公司管理员和店长。
- 教练可以读取、更新和删除其可见排课，但不能创建排课。
- 员工代预约必须提交 `student_id`；学员自助预约必须省略该字段。
- 周期排课创建返回 `{ created_count }`，单次排课返回完整 Schedule，适配器必须区分联合响应。
- 房间和教练在同一天同一开始时间冲突时返回 409，不在页面中猜测后端规则。
- 预约校验由后端原子处理，包括状态、截止时间、容量、学员时间冲突和会员资格。
- 次卡预约扣减与首次取消恢复由后端处理，前端只刷新会员与预约状态。
- 后端路径、Schema 和错误格式不得进入 Vue 页面；页面只消费前端领域模型。

## 当前状态

`CONTRACT_READY / API_READY / FRONTEND_NOT_STARTED`
