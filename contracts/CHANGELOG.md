# Contract Changelog

## CONTRACT-20260722-07

- Released contract version `1.4.0` for Phase 7 attendance and statistics.
- Replaced attendance draft placeholders with implemented attendance records, check-in, batch check-in, leave, auto-create and statistics shapes.
- Froze automatic absent-record creation for active bookings, present/late classification at schedule start time, and trainer-or-higher operational permissions.
- Froze student self check-in and own-statistics access while retaining company tenant isolation for all records and actions.
- Froze student attendance rate, late/leave counts and consecutive attendance, plus course booking/arrival counts and attendance rate.
- Excluded cancelled bookings and their stale attendance records from course booking and arrival statistics.
- Promoted attendance to `CONTRACT_READY / API_READY` after migration drift, backend tests, permission checks and Phase 7 integration scenarios passed.
- Rebundled `openapi.yaml` exclusively from `contracts/src/**`.

## CONTRACT-20260722-06

- Released contract version `1.3.0` for Phase 6 schedules and bookings.
- Replaced schedule and booking draft placeholders with the implemented date/time, recurrence, nested summary, membership validation and count-card consumption shapes.
- Froze ISO weekday recurrence (`1=Monday` through `7=Sunday`), atomic recurring creation, room/trainer collision responses, and the annotated `bookings_count` list field.
- Froze student self-booking, trainer/manager proxy booking, deadline/capacity/student-time/membership validation, duplicate protection, and count-card decrement/restore behavior.
- Published only implemented routes, including `/api/schedules/{schedule_id}/book/`, `/api/bookings/`, and DELETE cancellation routes; removed unimplemented draft publish/confirm operations.
- Promoted schedules and bookings to `CONTRACT_READY / API_READY` after migration drift, empty-database migration, 32 backend tests, and Phase 6 integration checks passed.
- Rebundled `openapi.yaml` exclusively from `contracts/src/**`.

## CONTRACT-20260722-05

- Released contract version `1.2.0` for frontend Phase 4 / feature 05 Course Templates and frontend Phase 5 / features 06–07 Students and Body Assessments.
- Added `CourseDifficulty` and `MembershipStatus` to the enum source of truth.
- Replaced student/body draft placeholders with dedicated create, update, success, list, membership, eligibility and trend schemas.
- Froze company-only course scope, list filters, private capacity validation, idempotent PATCH status and deferred cover upload.
- Froze tenant/role visibility, membership calculation, sensitive data policy, assessment units, score range, trend null policy, deferred photo upload and admin-only assessment deletion.
- Promoted system health, users, organization, course templates, students and body assessments to `CONTRACT_READY / API_READY` after empty-database migrations, backend tests and three contract validators passed.
- Rebundled `openapi.yaml` exclusively from `contracts/src/**`.

## CONTRACT-20260721-04

- 契约版本提升为 `1.1.0-draft`，冻结 Phase 3 的 Company、Store、Room 和 Phase 4 的 CourseTemplate 数据边界。
- 用资源专用的 Create、Update、Success 和 ListSuccess Schema 替换通用 Draft 占位类型。
- 对齐后端实际字段：公司合同日期、门店营业时间及嵌套场地、场地设施数组、课程容量与封面 URL。
- 冻结 `/api/companies/`、`/api/stores/`、`/api/rooms/`、`/api/course-templates/` 的列表、创建、详情、部分更新和删除操作。
- 按当前权限类标注角色与租户范围；状态启停通过 PATCH `status` 完成，不发布尚未实现的 activate/deactivate 动作。
- 四个模块标记为 `CONTRACT_READY / IN_PROGRESS`：模型、路由和租户查询已实现，但非列表成功响应尚未统一为 `{code, message, data}`，跨租户写入校验仍需补强，通过后方可标记 `API_READY`。

## CONTRACT-20260721-03

- 对齐前端实际读取的环境变量名 `VITE_API_BASE_URL`，明确无 Vite 代理时的本地联调配置。
- 实现并冻结 `POST /api/auth/logout/`，注销时撤销当前用户的 Refresh Token。
- 实现 `POST /api/users/{user_id}/reset-password/`，沿用用户租户隔离与管理员权限。
- Auth 模块提升为 `CONTRACT_READY / API_READY`。
- Users 因真实 Store 归属校验依赖 Phase 3，继续保持 `DRAFT / IN_PROGRESS`。

## CONTRACT-20260721-02

- 契约版本：`1.0.0-draft`
- 发起人：后端与契约负责人
- 原因：按全项目一次性交付任务书建立模块化契约、构建产物、状态和校验工具。
- 影响范围：Phase 1～13、前端功能 00～20 所需后端接口。
- 旧定义：Phase 2 单文件草案、裸成功响应/DRF 分页/旧 Token 字段和重复认证路径。
- 新定义：统一 `code/message/data`、`items/page/page_size/total`、
  `code/message/errors/request_id`、`access_token/refresh_token` 和 `/api/.../` 路径。
- 是否破坏兼容：是。
- 后端完成提交：待用户批准提交后填写。
- 前端完成提交：待联调。
- 计划合入时间：待双方确认。

### 状态说明

- 已实现且测试通过的 Phase 2 operation 单独标记 `x-status: API_READY`。
- auth/users 模块因 logout、重置密码和 Store 归属校验尚未完成，整体仍为 DRAFT/IN_PROGRESS。
- Phase 3～13 路径均为 DRAFT，API 为 NOT_STARTED，不得据此真实联调。
- 未确认候选枚举不写入 `enums.json`，避免把建议误当成冻结事实。

## CONTRACT-20260721-01

- 建立 7 组已确认枚举的唯一事实来源和 Phase 2 初版草案。
