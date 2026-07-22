# Phase 5 前端交付记录

日期：2026-07-22

状态：`INTEGRATED / UI_READY / MOCK_READY / NOT_VERIFIED`

## 已完成

- Student、Membership、Eligibility、BodyAssessment 使用独立前端领域模型。
- 新增 `students.adapter.ts` 与 `body-assessments.adapter.ts`，集中处理正式路径、数字 ID、响应包装及 snake_case/camelCase 转换。
- 学员列表、搜索、新建、档案编辑、会员资格、资格判定、体测历史、体测新增/编辑/删除和体重趋势已接入适配层。
- MSW 使用正式 OpenAPI Schema、尾斜杠路径和 PATCH 方法；Mock 数据不进入 Vue 页面。
- 权限界面按契约区分：教练只读会员资格；仅超级管理员和公司管理员可改归属及删除体测；店长可维护会员资格。
- 新增适配器测试，覆盖嵌套用户映射、分页、档案 PATCH、会员资格、Eligibility、体测 CRUD 与趋势。

## 验证证据

- `npm.cmd run check:all`：通过。
- 模块边界：219 个源文件通过。
- Vitest：33 个测试文件、113 项测试通过。
- 生产构建：548 个模块转换成功。
- 真实 API：学员 1 的嵌套用户、会员状态与 Eligibility 查询通过。
- 真实 API：身体评估创建、PATCH、趋势查询和 DELETE 清理通过。
- 权限：公司 B 教练读取公司 A 学员返回 404；学员角色读取管理端列表返回 403。

## 未标记 VERIFIED 的原因

- 尚未完成五种角色全部页面按钮、表单错误态、分页筛选组合和浏览器端视觉回归矩阵。
- 尚未执行生产环境验收和安全专项测试。

以上不阻塞 Phase 6 开发；Phase 5 已满足进入 Phase 6 所需的 `UI_READY / MOCK_READY` 和核心真实 API 联调门槛。
