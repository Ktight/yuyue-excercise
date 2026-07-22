# Phase 1–7 前端后端依赖分层台账

更新日期：2026-07-22

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
| BE-FE-03 | 2 | 用户详情与修改 `GET/PATCH /users/{id}/` | OpenAPI 仍为 DRAFT；后端已有实现和测试 | 用户详情、编辑、启停、门店调整、Mock 已完成 | 后端将契约状态冻结为 API_READY 后执行真实联调 |
| BE-FE-04 | 2 | 用户密码重置 | API_READY，后端已实现 | 重置表单、二次确认、适配器和 Mock 已完成 | 验证角色限制、跨租户 404 和密码规则 |
| BE-FE-05 | 2–7 | 所有分页列表的筛选、分页和排序参数 | 各正式端点已提供部分参数 | 公司、门店、用户、学员、排课、预约、考勤已补分页/筛选展示 | 分端点验证参数名、总数和越界页 |
| BE-FE-06 | 6 | 学员发现可预约排课 | `GET /student/schedules/` 仍为通用 DRAFT；正式后端缺少稳定端点 | `/student/courses` 演示页已完成；Mock 下可预约 | 冻结列表 Schema、资格/满员标记、筛选和分页后更换适配器；当前不得标记真实联调完成 |
| BE-FE-07 | 6 | 预约中的 `student_id` 资源语义 | 后端实际引用 User ID，既有文档曾混用 StudentProfile ID | 页面只传领域层参数，现有适配器集中转换 | 契约明确 `student_id` 的资源类型并补示例 |
| BE-FE-08 | 7 | 考勤中的 `student_id` 资源语义 | 后端实际使用 User ID | 页面不解析原始 ID；统计和动作集中在适配器 | 契约补充资源说明并验证本人统计 |
| BE-FE-09 | 4 | 删除课程模板时的关联资源规则 | 删除端点存在，关联排课冲突规则需确认 | 页面已提供危险操作、确认和错误反馈 | 后端明确 204/409 行为和业务错误码 |

## Mock 与真实接口切换

- 演示模式：设置 `VITE_ENABLE_MOCK=true`，由 MSW 提供页面所需数据。
- 真实模式：关闭 Mock，设置 `VITE_API_BASE_URL`，页面代码保持不变。
- 如果真实响应与领域模型不一致，只修改对应 `backend-adapters/*.adapter.ts`，不得把兼容逻辑散落到页面。

## 当前结论

前端页面可以在 Mock 模式下演示完整闭环。BE-FE-03、BE-FE-06、BE-FE-07、BE-FE-08、BE-FE-09 在完成真实接口和契约验收前保持 `NOT_VERIFIED`。
