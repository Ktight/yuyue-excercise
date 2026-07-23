# Phase 9 训练计划契约冻结请求

更新日期：2026-07-23  
前端基线分支：`frontend/phase-8-training-records`  
当前结论：`BLOCKED_BY_DRAFT_CONTRACT`

## 当前可核实状态

- `contracts/status.json`：Training Plans 为 `DRAFT / NOT_STARTED`。
- 端点已经列出列表、创建、详情、修改、激活、完成和进度查询。
- 所有端点仍绑定通用 `DraftWriteRequest`、`DraftSuccessResponse` 或 `DraftListSuccessResponse`。
- `planning.yaml#/TrainingPlan` 只提供候选对象；`stages` 仍是没有字段定义的任意对象数组，且候选对象尚未绑定正式端点。
- 因此当前不能生成可靠 DTO、字段校验、表单、Mock 和适配器测试。

## 请一次性冻结的 Schema

请提供并绑定以下专用 Schema：

1. `TrainingPlan`
2. `TrainingPlanCreateRequest`
3. `TrainingPlanUpdateRequest`
4. `TrainingPlanSuccessResponse`
5. `TrainingPlanListSuccessResponse`
6. `TrainingPlanProgress`
7. `TrainingPlanProgressSuccessResponse`
8. `TrainingPlanStage`
9. 如阶段内含训练项，再提供 `TrainingPlanStageItem`

## TrainingPlan 必须明确

- `student_id` 表示 `accounts.User` ID 还是 StudentProfile ID。
- 教练、公司、门店归属字段由客户端提交还是服务端推导。
- 名称、目标、说明的长度和可空性。
- `starts_on`、`ends_on` 的包含关系和最大周期。
- 状态是否固定为 `draft / active / completed / cancelled`。
- 同一学员是否允许多个 active 计划。
- 创建后默认状态。
- 是否返回学员、教练的展示名称，避免列表页逐条补请求。
- 是否返回整体进度、已完成课次和计划总课次。

## Stage 必须明确

- 稳定的阶段 ID 是否由服务端生成。
- 阶段名称、目标、说明和顺序字段。
- 每阶段开始/结束日期或周次。
- 目标课次数、训练频率、重点体式和强度字段。
- 完成判定是手动、按课堂记录自动计算，还是二者组合。
- 阶段能否增删、重排，以及 active 计划是否允许修改。
- 空阶段、日期重叠和顺序冲突的校验规则。

## 状态动作必须明确

### 激活

- 仅 draft 可激活，还是 cancelled 可恢复。
- 激活时是否要求至少一个阶段。
- 是否自动终止同一学员的既有 active 计划。
- 重复激活返回幂等 200 还是 409。

### 完成

- 仅 active 可完成，还是 draft 也可直接完成。
- 未完成阶段是否允许计划完成。
- 完成后是否完全只读。
- 重复完成返回幂等 200 还是 409。

### 取消/删除

- 当前端点没有 cancel/delete，请明确产品是否不需要。
- 若需要取消，请增加独立动作端点并冻结权限及历史数据保留规则。
- 不建议删除已有课堂记录引用的训练计划。

## 列表与进度查询

请冻结列表参数：

- `page / page_size`
- `student_id / trainer_id`
- `status`
- `date_from / date_to`
- `company_id` 是否仅超级管理员可用
- 排序字段及默认排序

请冻结进度响应：

- 整体完成比例
- 当前阶段
- 每阶段完成比例
- 计划课次、已完成课次
- 是否由 Phase 8 Class Records 聚合
- 没有课堂记录时返回 0 还是 null

## 权限和租户

请确认：

- 超级管理员、公司管理员、店长和教练各自的读写权限。
- 教练是否只能管理自己负责的学员计划。
- 店长是否仅能访问所属门店学员。
- 学员自助端何时开放只读计划；当前 `/api/student/training-plans/` 仍为 DRAFT。
- 跨租户资源统一返回 403 还是 404。

## 错误响应和示例

每个端点至少提供：

- 成功请求与响应示例。
- 400 字段校验。
- 401 未认证。
- 403 角色禁止。
- 404 资源不存在或跨租户隐藏。
- 409 状态转换、日期冲突或重复 active 计划。
- 统一 `code / message / errors / request_id` 结构。

## 前端收到冻结契约后的实施顺序

1. 重新生成 API 类型和枚举。
2. 创建 `features/training-plans/model/` 领域模型。
3. 创建单一 `backend-adapters/training-plans.adapter.ts`。
4. 创建契约一致的 MSW Fixture 与 Handler。
5. 实现计划列表、筛选和分页。
6. 实现计划创建/编辑及阶段编辑器。
7. 实现详情、进度、激活和完成动作。
8. 接入管理端、教练端和学员只读端权限路由。
9. 完成适配器、组件、权限、状态动作和 E2E 测试。

契约未冻结前，前端不会用候选字段制作可被误认为正式实现的页面，也不会把 Mock 页面标记为 Phase 9 完成。
