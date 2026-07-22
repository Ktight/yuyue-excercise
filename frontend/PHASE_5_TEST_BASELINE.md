# Phase 5 前端测试基线

日期：2026-07-22

范围：学员、会员、身体评估

契约版本：`1.2.0`

契约提交：`61fe3eb`
后端提交：`bff1ebe`

## 结论

- 后端 Phase 5 核心查询接口可用，角色和租户隔离基线通过。
- 当前 Phase 5 前端仍是旧原型，不能消费正式 Student 响应；真实学员列表会在渲染阶段报错。
- 当前状态：后端 `API_READY`；前端 `IN_PROGRESS / NOT_UI_READY / NOT_MOCK_READY`。
- 本轮仅测试和记录，没有修改 Phase 5 业务代码，也没有把 Phase 5 标记为完成。

## 后端真实接口证据

### 学员列表

- 超级管理员：200，可见 2 条。
- 公司 A 管理员：200，可见公司 A 的 1 条。
- 公司 A 店长：200，可见门店 A 的 1 条。
- 公司 A 训练师：200，可见分配给自己的 1 条。
- 公司 B 训练师：200，可见公司 B 的 1 条。
- 学员 A、学员 B：403。

### 详情、会员和体测

- 公司 A 训练师读取学员 1 详情：200。
- 公司 B 训练师读取学员 1 详情：404。
- 公司 A 训练师读取学员 1 会员：200。
- 公司 B 训练师读取学员 1 会员：404。
- 公司 A 训练师读取学员 1 eligibility：200。
- 公司 A 训练师读取体测列表：200，当前 0 条。
- 公司 B 训练师以 `student_id=1` 筛选体测列表：200 空列表；这是列表过滤语义，未判定为后端缺陷。
- 公司 A 训练师读取学员 1 体测趋势：200，`has_trend=false`。
- 公司 B 训练师读取学员 1 体测趋势：404。

## 当前前端真实失败

公司管理员通过真实 API 打开 `/admin/students` 后，列表请求成功，但 `StudentCard.vue` 渲染时报错：

```text
TypeError: Cannot read properties of undefined (reading 'slice')
```

直接原因是页面期望 `student.name`，正式响应将用户身份放在嵌套 `student.user.name` 中，而当前 API 层把正式响应当成旧 `StudentDto` 直接传入组件。

已确认的旧原型差异：

- 学员 ID 仍为 `string`，正式契约为 `number`。
- 当前 DTO 使用顶层 `name/phone/avatar`，正式契约使用嵌套 `user`。
- 当前会员类型为 `none/monthly/quarterly/yearly/count`，与正式会员卡 Schema 不一致。
- 当前使用 `birthday`、`membership_expire_date`、`notes`，正式字段结构不同。
- 当前更新使用 PUT；正式契约使用 PATCH，会员字段使用独立 membership 端点。
- 当前学生 API 没有独立后端适配器，页面和旧 DTO 直接耦合。
- 当前身体评估使用字符串 ID、`student_id`、`assessed_at` 和旧 measurements 结构，与正式契约不一致。
- 当前身体评估 API 缺少详情、PATCH、DELETE 和趋势适配。
- 当前 Mock 仍基于旧原型，不能作为正式契约验收证据。

## 下一步实施边界

Phase 5 需要按以下顺序实现，不能只在 `StudentCard` 增加空值兼容：

1. 重新建立 Student、Membership、BodyAssessment 前端领域模型。
2. 新增学生和身体评估后端适配器，集中映射嵌套 user、snake_case、响应包裹和数字 ID。
3. 重写契约 Mock 和适配器测试。
4. 重写学员列表与筛选。
5. 重写创建/编辑表单，并将会员操作拆到独立端点。
6. 完成学员详情、会员状态、eligibility、身体评估历史和趋势。
7. 运行完整 `check:all`。
8. 再执行五角色、双租户和敏感健康信息权限联调。

禁止通过在页面中猜字段、增加大量可选链或继续扩展旧 DTO 的方式绕过正式适配。
