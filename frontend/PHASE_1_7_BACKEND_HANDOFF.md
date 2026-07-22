# 瑜悦练 Phase 1–7 前后端对接文档

更新日期：2026-07-22  
前端分支：`frontend/phase-3-5-ui-prep`  
前端提交：`70314d5`  
对接范围：Phase 1–7 现有页面、适配器、正式契约与真实 API

## 1. 本次对接目标

本次不是要求后端配合前端页面结构，而是共同确认正式接口是否与仓库契约一致，并完成真实环境联调。

- 前端页面只依赖领域模型，不直接读取后端 `snake_case` 字段。
- URL、请求参数、响应包装和字段转换集中在 `frontend/src/backend-adapters/`。
- 演示数据只存在于各功能的 `mocks/`，不写进 Vue 页面。
- 后端响应如与契约不同，双方先修改或冻结契约；前端不在多个页面中增加临时兼容。
- 前端当前状态是 `DEMO_UI_COMPLETE / MOCK_INTEGRATION_READY / REAL_API_NOT_FULLY_VERIFIED`，不能把演示完成等同于真实联调完成。

## 2. 前端已经完成

| Phase | 前端能力 |
|---:|---|
| 1 | 登录、Token 刷新、退出、当前用户资料、修改密码、鉴权与角色路由 |
| 2 | 用户列表、搜索/筛选/分页、创建、详情、编辑、启停、管理员重置密码 |
| 3 | 公司、门店、教室的列表、详情、创建、修改、状态管理及选择组件 |
| 4 | 课程模板列表、详情、表单、筛选分页和受控删除入口 |
| 5 | 学员、会员、资格判断、身体评估及趋势展示 |
| 6 | 排课、周期排课、预约、代预约、取消预约、学员发现课程演示页 |
| 7 | 考勤列表、自动生成、签到、批量签到、请假及统计 |

前端完整门禁最近一次记录：`check:all` 通过，282 个源文件边界检查通过，36 个测试文件共 125 项测试通过，生产构建通过；Playwright E2E 通过。

## 3. 契约状态与联调结论

状态含义：

- `API_READY`：可以立即进行真实接口联调。
- `CONTRACT_READY`：请求和响应结构已形成正式契约，但仍需确认目标后端环境确实部署了对应实现。
- `DRAFT`：前端已有页面/Mock/适配器预留，不得标记真实联调完成。

| 模块 | 主要接口 | 当前契约状态 | 前端状态 | 本次动作 |
|---|---|---|---|---|
| Auth | `/api/auth/login/`、`refresh/`、`logout/`、`me/`、`change-password/` | API_READY | 已完成 | 验证真实账号、Token 轮换、退出撤销和改密 |
| Users | `/api/users/`、`/api/users/{id}/` | DRAFT | 页面、适配器、Mock 已完成 | 后端确认实现与 Schema 后，将端点冻结为 API_READY |
| Users 密码重置 | `/api/users/{id}/reset-password/` | API_READY | 已完成 | 验证角色限制、密码规则、跨租户 404 |
| Companies | `/api/companies/`、`/{id}/` | CONTRACT_READY | 已完成 | 确认目标环境实现并验证超级管理员权限 |
| Stores / Rooms | `/api/stores/`、`/api/rooms/` | CONTRACT_READY | 已完成 | 验证公司归属、跨租户隔离和启停/删除规则 |
| Course Templates | `/api/course-templates/`、`/{id}/` | CONTRACT_READY | 已完成 | 验证筛选、权限、删除时的关联资源冲突 |
| Students | `/api/students/`、会员、资格 | CONTRACT_READY | 已完成 | 验证 User ID 与 StudentProfile ID 的边界、会员组合规则 |
| Schedules | `/api/schedules/`、排课预约动作 | CONTRACT_READY；交付文档记录后端 API_READY | 已完成 | 验证周期排课原子性、冲突、容量与资源选择 |
| Bookings | `/api/bookings/`、取消 | CONTRACT_READY；交付文档记录后端 API_READY | 已完成 | 验证 `student_id` 语义、次卡扣减和取消恢复 |
| Attendance | `/api/attendances/` 及动作/统计 | CONTRACT_READY；交付文档记录后端 API_READY | 已完成 | 验证自动生成幂等、角色权限、统计和跨租户隔离 |
| Student self-service | `/api/student/schedules/` 等 | DRAFT | 学员课程发现仅完成演示 | 冻结 Schema、筛选、资格和满员语义后再真实接入 |

## 4. 必须由后端确认的问题

请后端按编号回复，未知项直接写“待定”，不要用推测代替契约。

1. Users 的列表、创建、详情和修改端点何时由 `DRAFT` 提升为 `API_READY`？
2. 用户创建/修改中，`store_id` 对店长、教练、学员分别有什么必填和禁止规则？
3. 所有分页端点是否统一返回 `items / page / page_size / total`？支持哪些筛选和排序参数？
4. `student_id` 在预约与考勤接口中表示 User ID 还是 StudentProfile ID？请在契约说明和示例中固定一种语义。
5. `/api/student/schedules/` 何时冻结？列表是否直接返回可预约、满员、资格不足、预约截止等状态？
6. 删除课程模板时，如果已有排课，返回 409 还是其他状态？对应业务错误码是什么？
7. 公司、门店和教室停用或删除时，已有用户、排课和历史记录如何处理？
8. 标准错误响应是否统一为 `code / message / errors / request_id`？请提供 400、401、403、404、409 示例。
9. 测试环境的 API 基址、CORS 允许来源、测试账号、双租户数据和启动方式分别是什么？
10. 后端是否要求“删除用户”？当前 Users 契约没有 DELETE。若需要，请先明确是硬删除、软删除还是移除成员，以及历史预约/考勤/课程记录的保留规则。

## 5. 用户删除能力的当前边界

当前前端没有调用用户删除接口，原因是 `contracts/src/paths/users.yaml` 未定义 `DELETE /api/users/{user_id}/`。

- 现有“停用账号”可以阻止继续登录。
- 用户可能关联预约、考勤和课程历史，不建议在未定义数据保留规则时直接硬删除。
- 如果产品确定需要“移除成员”，请后端先提供端点、权限、幂等规则、关联数据规则、成功状态和 409 错误码。
- 契约冻结后，前端只在 `users.adapter.ts` 增加传输实现，并在用户详情危险操作区接入；其他页面无需修改。

## 6. 建议联调顺序

1. 双方固定前端提交、后端提交、契约版本和测试环境。
2. 后端执行自身检查、迁移检查、测试及契约校验。
3. 前端从契约重新生成 API 类型和枚举，确认 Git 没有非预期生成差异。
4. 先联调 Auth，确认登录、刷新、权限、退出和改密。
5. 再按 Users → Companies/Stores/Rooms → Course Templates → Students → Schedules/Bookings → Attendance 顺序联调。
6. 每个模块依次验证正常路径、字段校验、401、403、404、409、跨租户隔离和空列表/分页边界。
7. 最后验证学员自助接口；仍为 DRAFT 时不得用管理员接口临时代替正式学员接口。
8. 联调后重新运行前端 `npm.cmd run check:all` 和核心浏览器 E2E。

## 7. 每项联调证据模板

```text
模块/接口：
测试日期：
前端提交：70314d5
后端提交：
契约版本/提交：
角色与租户：
请求条件：
HTTP 状态与业务错误码：
页面结果：
是否通过：
失败归属：前端 / 后端 / 契约 / 环境 / 待确认
遗留问题：
```

## 8. 双方修改边界

### 前端负责

- 页面、交互、领域模型、适配器、错误展示和前端自动化测试。
- 契约冻结后的类型重新生成与字段映射。
- 不要求后端按 Vue 页面组件组织响应。

### 后端负责

- 真实端点、权限、租户隔离、事务、幂等、数据约束和错误码。
- 确保实际实现与正式 OpenAPI、枚举和示例一致。
- 提供可重复使用的测试账号、数据与启动说明。

### 共同负责

- 冻结契约、确认 ID 语义、保存联调证据并判定问题归属。
- 任何接口差异先更新事实来源，不在前端页面或后端序列化器中分别维护两套临时规则。

## 9. 相关文件

- `frontend/BACKEND_DEPENDENCIES_PHASE_1_7.md`：详细依赖台账。
- `frontend/PHASE_1_7_DEMO_COMPLETENESS.md`：前端演示完成范围。
- `frontend/FRONTEND_STATUS.md`：各 Phase 的历史状态和验证记录。
- `contracts/openapi.yaml`：打包后的正式 OpenAPI。
- `contracts/src/paths/`：各模块源契约。
- `contracts/PHASE_6_DELIVERY.md`、`contracts/PHASE_7_DELIVERY.md`：后端 Phase 6/7 冻结决策。

## 10. 当前完成判定

Phase 1–7 当前可以用于完整前端演示，但只有在上述真实接口逐项通过、DRAFT 项冻结、跨租户与错误路径验证完成后，才能整体标记为 `VERIFIED`。
