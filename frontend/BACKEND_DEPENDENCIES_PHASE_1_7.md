# Phase 1–11 前端后端依赖分层台账

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
| BE-FE-10 | 1–2 | Refresh Token 商业安全策略 | 当前契约返回 Token，前端暂存 `localStorage`；尚未提供 HttpOnly Cookie 会话方案 | 现有刷新、并发 401 恢复和退出流程可用 | 后端与部署共同评审 `HttpOnly + Secure + SameSite` Cookie、CSRF、CSP、撤销与兼容发布顺序；冻结前不在前端单方面改协议 |
| BE-FE-11 | 5、8 | 健康档案、体测和课堂媒体隐私权限 | 端点已有角色声明，但商业数据可见范围、审计、媒体保留和删除规则尚未形成完整验收矩阵 | 前端按现有角色路由和正式接口展示，不缓存到业务代码 | 后端/产品确认公司管理员、店长、训练师的字段级可见范围、审计日志、媒体授权与保留策略，再执行双租户真实验收 |
| BE-FE-12 | 9 | 训练计划与课堂记录使用不同学员资源 ID | 契约 1.7.0：TrainingPlan 使用 StudentProfile ID；ClassRecord/Attendance 使用 User ID | 前端通过学员查询完成映射，页面只操作领域模型，转换集中在选择组件与适配器 | 使用真实学员、跨租户学员和停用学员验证映射与错误响应 |
| BE-FE-13 | 9 | 训练计划状态动作及课堂记录关联/解除关联 | `complete`、`pause`、课堂记录自动关联与 `unlink` 均为 CONTRACT_READY / API_READY | 独立适配器、确认交互、Mock 和单元测试已完成 | 验证状态流转、非所属训练师、重复动作、无可关联计划及 409 冲突 |
| BE-FE-14 | 10 | 学员反馈 Schema、感受枚举、媒体与重复提交规则 | contracts 1.8.0 已冻结 `GET/POST /api/feedback/`、不可修改、暂不支持照片 | 前端已替换正式适配器、Mock、表单和枚举映射；未接真实 API | 使用真实角色和课堂记录完成创建、列表、权限及异常路径联调后关闭 |
| BE-FE-15 | 10 | 阶段报告聚合、保存、发布、导出与分享 | contracts 1.8.0 已冻结 `GET /api/reports/` 实时预览；本期不保存、不发布、不提供后端导出或分享 | 前端已替换正式查询适配器和 Mock；使用 User ID，限制包含首尾最多 366 天 | 使用真实学员数据完成有数据、无数据、越权和日期边界联调后关闭 |
| BE-FE-16 | 11 | 管理/训练师/学员看板指标与统计口径 | contracts 1.8.0 为 DRAFT / NOT_STARTED | 管理看板 UI、稳定视图模型、适配器、Mock 和不兼容响应保护已完成 | 冻结时区、租户/门店范围、指标、趋势粒度和空数据语义后替换适配器并联调 |
| BE-FE-17 | 11 | 提醒列表、已读、忽略、分类与动作链接 | contracts 1.8.0 为 DRAFT / NOT_STARTED | 提醒中心 UI、筛选、操作、适配器和 Mock 已完成 | 冻结枚举、角色、分页排序、链接白名单及操作幂等语义后替换适配器并联调 |
| BE-FE-18 | 11 / 功能 19 | 学员训练历史、训练计划、聚合首页和完整档案自助接口 | `student_self_service` 为 DRAFT / NOT_STARTED；正式 class-records/training-plans 不允许 student | 正式 feedback、reports 学员入口已完成；草案能力未伪造 | 冻结 student home/profile/class-records/training-plans Schema、分页、权限和 ID 语义后继续 |

## Mock 与真实接口切换

- 演示模式：设置 `VITE_ENABLE_MOCK=true`，由 MSW 提供页面所需数据。
- 真实模式：关闭 Mock，设置 `VITE_API_BASE_URL`，页面代码保持不变。
- 如果真实响应与领域模型不一致，只修改对应 `backend-adapters/*.adapter.ts`，不得把兼容逻辑散落到页面。

## 当前结论

前端页面可以在 Mock 模式下演示 Phase 1–11 的当前闭环。官方 contracts 1.8.0 已冻结 Phase 9 训练计划以及 Phase 10 feedback、reports 契约，前端已达到对应的 `CONTRACT_READY / API_READY / UI_READY / MOCK_READY`。Phase 11 的数据看板和提醒仅达到 `PROVISIONAL_UI_READY / MOCK_READY`，不能标记 `CONTRACT_READY / API_READY / INTEGRATED`。由于尚未执行真实角色、租户、状态流转和异常路径联调，BE-FE-12～17 以及其他未关闭条目均保持 `NOT_VERIFIED`。`PHASE_10_BACKEND_HANDOFF.md` 保留为冻结前的需求与决策历史，不再代表当前阻塞状态。BE-FE-10、BE-FE-11 是商业上线前的安全与隐私联合决策，不能由前端静默改变协议或伪造完成。
