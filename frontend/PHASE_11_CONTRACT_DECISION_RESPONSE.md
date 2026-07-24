# Phase 11 前端契约裁决反馈

更新日期：2026-07-24
前端状态：`CONTRACT_READY / API_READY / UI_READY / MOCK_READY / NOT_INTEGRATED`
后端状态：`IMPLEMENTED / TESTED / CONTRACT_1_9_FROZEN`

> 裁决结果：官方提交 `a7fba3a` 已将建议中的管理角色范围、统计口径、具名 Schema、
> 提醒分页、`unread_only`、枚举、动作响应和路径白名单冻结到 contracts 1.9.0。
> 前端已完成集中替换；本文以下内容保留为决策过程记录。

## 1. 核对结论

已阅读后端提供的 `PHASE_11_BACKEND_AUDIT.md` 和
`PHASE_11_FRONTEND_HANDOFF.md`，并核对当前远程仓库：

- `origin/main` 仍以 contracts 1.8.0 为正式基线；
- `contracts/status.json` 中 `dashboards`、`reminders` 仍为
  `DRAFT / NOT_STARTED`；
- 当前远程分支中没有可见的 Phase 11 后端候选提交；
- 管理看板候选响应与当前暂定 ViewModel 基本一致，但 `timezone` 尚未进入正式类型；
- 提醒候选响应为分页对象，当前 adapter 期待扁平数组，直接联调必然触发
  `REMINDER_CONTRACT_MISMATCH`；
- 当前页面的“仅看未读”是对已加载数组做本地过滤；启用后端分页后，如果契约没有
  未读筛选参数，该功能无法准确覆盖全部提醒。

因此前端本轮不修改生成类型、adapter、Mock、页面或完成状态。先冻结以下决策，
再进行一次集中替换。

## 2. 前端建议一次性冻结的决策

| 编号 | 决策项 | 前端建议 |
|---|---|---|
| P11-D01 | 本阶段看板范围 | Phase 11 只冻结管理看板 `/api/dashboards/admin/`；允许 `super_admin/company_admin/store_manager`，明确排除 `trainer/student`。训练师和学员看板另立后续契约，不复用管理接口。 |
| P11-D02 | 管理看板统计口径 | 接受候选实现：统一 `Asia/Shanghai`；今日课程排除 `cancelled`；今日预约只统计 `booked`；活跃学员按启用账号、有效会员及余额规则计算；趋势固定最近 7 个本地日历日并补 0。 |
| P11-D03 | 管理看板响应 | 冻结具名 `AdminDashboardData`，必须包含 `generated_at`、`timezone`、四个指标、`booking_trend` 和 `today_schedules`，空指标为 0、空集合为 `[]`。不得继续引用通用 Draft Schema。 |
| P11-D04 | 提醒分页 | 冻结标准分页对象 `{items,page,page_size,total}`；默认 `page=1/page_size=20`，最大 100。前端接入真正分页，不用 `page_size=100` 假装全量。 |
| P11-D05 | 未读筛选 | 为保证“仅看未读”在分页下准确，增加正式布尔查询参数 `unread_only`，默认 `false`。默认仍不返回已忽略提醒。 |
| P11-D06 | 提醒枚举与排序 | 接受 `category = booking/attendance/membership/training/system`，`priority = high/normal/low`；按优先级后创建时间倒序。枚举必须进入 `enums.json` 或具名 OpenAPI Enum。 |
| P11-D07 | read/dismiss 语义 | 两个动作均为单向、幂等；本阶段不提供“恢复未读”或“恢复已忽略”。成功响应返回更新后的完整 `Reminder`，前端以响应体替换本地项，不盲改状态。 |
| P11-D08 | 错误与隔离 | 未认证 401；角色/租户前置条件不满足 403；不存在、已失效或非当前用户提醒统一 404，避免泄露资源存在性；分页错误 400。 |
| P11-D09 | 动作链接 | 接受后端列出的管理端站内路径白名单，禁止外链和任意路径。前端 adapter 也会执行同一白名单校验，非法路径不渲染入口。 |
| P11-D10 | 来源消失与状态保留 | 前端只依赖“失效 ID 操作返回 404”，不依赖状态保留期限。来源重新出现时是否复用状态作为后端/产品策略记录，不暴露为客户端控制项；如未来影响用户可见行为，再单独版本化。 |
| P11-D11 | GET 是否写状态 | 建议 GET 不创建持久状态：无状态行视为未读/未忽略，只在 read/dismiss 时写入。若后端保留 GET 写入，必须保证幂等、事务安全，且不得改变响应语义或统计结果。 |
| P11-D12 | trainer/student 看板 | 本阶段明确延期，不在前端增加候选路径，也不通过管理端点绕过角色权限。 |

## 3. 契约冻结必须包含的内容

1. 将 `dashboards`、`reminders` 从通用 Draft Schema 替换为具名请求/响应 Schema。
2. 固定路径、方法、尾斜杠、角色、租户/门店范围和统一成功/错误包裹。
3. 将管理看板、提醒、分页和状态动作提供可校验示例。
4. 将分类、优先级和必要状态值写入正式枚举来源。
5. 明确 `unread_only`、`page`、`page_size` 的类型、默认值、上下界和错误格式。
6. read/dismiss 成功响应绑定完整 `Reminder`，请求体允许 `{}`。
7. 更新 `contracts/status.json`；只有 Schema 冻结后才能标记 `CONTRACT_READY`，
   只有对应后端提交可获取且回归通过后才能标记 `API_READY`。
8. 后端候选代码、迁移和交接文档必须进入远程分支或 `main`，提供可追溯提交号。

## 4. 冻结后的前端集中修改

契约和后端提交均可获取后，前端只执行以下范围：

1. 运行 `npm run generate`。
2. `dashboard.adapter.ts` 改用正式生成类型，校验 `timezone` 并保持页面
   ViewModel 稳定。
3. `reminders.adapter.ts` 映射正式分页对象和动作响应，增加动作路径白名单校验。
4. 提醒 API 与页面接入页码、总数和 `unread_only` 服务端筛选。
5. 同步修改提醒 Mock、adapter 测试、分页/筛选组件测试和 E2E。
6. 运行 `npm run check:all` 与 `npm run test:e2e`。
7. 使用超级管理员、公司管理员、店长和两个租户覆盖空数据、分页、
   400/401/403/404、跨公司、跨门店、跨用户及幂等动作。

## 5. 状态提升门槛

- 收到本文不代表 `CONTRACT_READY`。
- 后端候选测试通过不代表 `API_READY`。
- Mock 与自动化通过不代表 `INTEGRATED`。
- 正式契约、可追溯后端提交、真实 API 矩阵和浏览器回归全部完成后，才评估
  `INTEGRATED / VERIFIED`。
