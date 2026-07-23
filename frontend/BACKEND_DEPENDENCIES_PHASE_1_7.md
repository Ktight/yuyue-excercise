# Phase 1–7 前端后端依赖分层台账

更新日期：2026-07-23

## 分层原则

- 页面和组件只使用前端领域模型，不读取 OpenAPI 原始字段。
- 所有真实 API 路径、snake_case、包装响应和资源 ID 语义集中在 `src/backend-adapters/`。
- MSW 只位于各功能的 `mocks/`，不得进入 Vue 页面。
- `API_READY` 可以进入真实联调；`DRAFT` 只用于演示 Mock 和适配层预留，不标记真实联调完成。
- 本轮不修改 `backend/**` 或 `contracts/**`。

## 依赖清单

| 编号 | Phase | 能力 | 契约/后端状态 | 前端演示状态 | 最终动作 |
|---|---:|---|---|---|---|
| BE-FE-01 | 1 | `POST /auth/logout/` 撤销 Refresh Token | API_READY，后端已实现 | 已接入适配器和 Mock | 真实账号验证退出后 Refresh Token 不可复用 |
| BE-FE-02 | 1 | `PATCH /auth/me/` 修改本人姓名/头像 | API_READY，后端已实现 | 个人资料页、适配器和 Mock 已完成 | 验证头像 URL、字段错误和权限 |
| BE-FE-03 | 2 | 用户详情与修改 `GET/PATCH /users/{id}/` | CONTRACT_READY / API_READY | 用户详情、编辑、启停、门店调整、Mock 已完成 | 执行角色限制、跨租户与字段错误真实联调 |
| BE-FE-04 | 2 | 用户密码重置 | API_READY，后端已实现 | 重置表单、二次确认、适配器和 Mock 已完成 | 验证角色限制、跨租户 404 和密码规则 |
| BE-FE-05 | 2–7 | 所有分页列表的筛选、分页和排序参数 | 各正式端点已提供部分参数 | 公司、门店、用户、学员、排课、预约、考勤已补分页/筛选展示 | 分端点验证参数名、总数和越界页 |
| BE-FE-06 | 6 | 学员发现可预约排课 | 已由 `GET /api/schedules/` 统一提供，CONTRACT_READY / API_READY；后端按学员身份过滤资格、容量、截止时间、时间冲突与既有预约 | `/student/courses` 已改用正式 Schedule 领域模型，并适配 `remaining_capacity` | 使用真实学员账号验证发现、满员、资格、冲突和分页后关闭 |
| BE-FE-07 | 6 | 预约中的 `student_id` 资源语义 | 契约 1.6.0 已冻结为 `accounts.User` ID，不是 StudentProfile ID | 页面只传领域层参数，适配器集中转换 | 使用代预约和学员自助预约各验证一次后关闭 |
| BE-FE-08 | 7 | 考勤中的 `student_id` 资源语义 | 后端实际使用 User ID | 页面不解析原始 ID；统计和动作集中在适配器 | 契约补充资源说明并验证本人统计 |
| BE-FE-09 | 4 | 删除课程模板时的关联资源规则 | 删除端点存在，关联排课冲突规则需确认 | 页面已提供危险操作、确认和错误反馈 | 后端明确 204/409 行为和业务错误码 |

## Mock 与真实接口切换

- 演示模式：设置 `VITE_ENABLE_MOCK=true`，由 MSW 提供页面所需数据。
- 真实模式：关闭 Mock，设置 `VITE_API_BASE_URL`，页面代码保持不变。
- 如果真实响应与领域模型不一致，只修改对应 `backend-adapters/*.adapter.ts`，不得把兼容逻辑散落到页面。

## 当前结论

前端页面可以在 Mock 模式下演示完整闭环。契约 1.6.0 已解决 BE-FE-03、BE-FE-06 和 BE-FE-07 的契约阻塞，但真实角色、租户和异常路径尚未全部执行，因此这些条目仍保持 `NOT_VERIFIED`，不再标记为契约阻塞。BE-FE-08、BE-FE-09 继续等待对应真实验收或业务规则确认。
