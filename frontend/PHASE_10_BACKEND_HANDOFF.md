# Phase 10 前端—后端契约冻结与交付要求

更新日期：2026-07-23
前端基线：Phase 9 `UI_READY / MOCK_READY`
契约基线：`contracts` 1.7.0

## 1. 当前结论

Phase 10 暂停在契约冻结点，尚不能安全开始正式前端实现。

当前 `feedback`、`reports` 和相关 `student_self_service` 端点均为 `DRAFT / NOT_STARTED`，请求与响应仍引用 `DraftWriteRequest`、`DraftSuccessResponse` 或 `DraftListSuccessResponse`。现有 `Report` 候选 Schema 只包含报告标识、学员、日期、状态和快照时间，不能支持报告预览页面所需的训练统计、评分趋势、体态对比和反馈汇总。

前端不会根据空示例或候选字段自行创建正式 DTO、Mock、权限规则或分享链接。请后端/契约负责人完成本文件的冻结项后，以新的 `contracts.zip` 或 Git 提交交付。

## 2. 本轮前端不实施的原因

- `contracts/examples/feedback/create.request.json` 仍为 `{}`；
- `contracts/examples/reports/create.request.json` 仍为 `{}`；
- 反馈模块没有正式 Feedback Schema；
- 反馈感受值尚未进入 `contracts/enums.json`；
- 学员提交反馈的合法课时范围、重复提交和修改规则未冻结；
- 报告聚合响应没有正式 Schema；
- 报告保存、发布、导出和分享的返回语义未冻结；
- 所有员工角色目前都被列为可写，无法确认训练师归属和管理端只读边界；
- 照片字段没有明确使用既有 ClassMedia、上传资源 ID 还是 URL。

## 3. 反馈模块必须冻结的内容

### 3.1 资源与标识

请明确并写入 Schema 描述：

- `class_record_id` 使用 ClassRecord ID；
- `student_id` 使用 User ID 还是 StudentProfile ID；
- 是否由登录学员身份自动确定 `student_id`，禁止客户端提交；
- 一个 ClassRecord 是否只允许一条反馈；
- 小班课记录中一名学员的反馈如何唯一定位。

### 3.2 正式 Schema

至少需要独立定义并绑定端点：

- `Feedback`
- `FeedbackCreateRequest`
- `FeedbackUpdateRequest`（如果允许修改）
- `FeedbackSuccessResponse`
- `FeedbackListSuccessResponse`

请由后端确认字段名称、类型、必填性和长度。前端产品需求至少需要表达：

- 反馈 ID；
- 课堂记录 ID；
- 学员摘要；
- 训练师或课堂摘要（如果页面需要展示）；
- 训练感受；
- 改善感受或身体反应；
- 文字评语；
- 照片/媒体；
- 创建时间；
- 更新时间；
- 是否可修改。

以上仅为页面能力清单，不代表前端已经决定字段名或数据库结构。

### 3.3 感受枚举

产品要求存在“轻松、适中、吃力”三种训练感受。请后端选择正式枚举 key，并加入 `contracts/enums.json` 作为唯一事实源，同时在 OpenAPI Schema 中引用完全相同的值。

还需确认“改善感受”是：

- 另一个枚举；
- 布尔值；
- 自由文本；
- 或本期不实现。

前端不会在契约外维护第二套枚举。

### 3.4 照片与媒体

请明确下列方案中的正式方案：

- 复用 Phase 8 ClassMedia，并提交媒体 ID；
- 使用独立反馈媒体上传端点，并提交资源 ID；
- 仅接受已上传资源 URL；
- Phase 10 暂不支持照片。

必须提供上传大小、数量、MIME 类型、删除权限和响应示例。前端不会拼接存储路径或把 Base64 图片塞入反馈 JSON。

### 3.5 端点与查询

建议至少冻结以下业务能力，最终路径由契约负责人确认：

- 学员创建自己的反馈；
- 员工按 `class_record_id` 查询反馈；
- 员工按 `student_id` 查询反馈历史（如果报告聚合需要）；
- 学员查询自己是否已经反馈；
- 允许修改时，修改自己的反馈。

现有 `/api/feedback/` 和 `/api/feedback/{feedback_id}/` 可以保留，但必须补齐正式查询参数、分页、排序和角色语义。`/api/student/feedback/` 若保留，应说明它与员工端反馈资源的关系，避免出现两套不一致模型。

### 3.6 权限和业务错误

请冻结并测试：

- 学员只能反馈自己的、满足条件的课堂记录；
- 训练师只能查看自己负责范围内的反馈；
- 管理角色是只读还是可修改；
- 跨租户与越权对象返回 404 还是 403；
- 草稿/已完成/已取消课堂中哪些允许反馈；
- 重复提交返回 409 及稳定业务错误码；
- 超过反馈期限、记录不存在、记录未完成的错误码；
- 修改期限、允许修改次数及照片替换规则。

## 4. 阶段报告模块必须冻结的内容

### 4.1 报告输入

请为预览和创建分别定义正式请求 Schema，至少确认：

- `student_id` 的资源类型；
- `range_start`、`range_end` 的日期格式与时区边界；
- 是否允许未来日期；
- “全部”范围由前端传空值还是由专用参数表达；
- 训练师评语是在预览时传入、创建时保存，还是创建后 PATCH；
- 同一学员和时间范围是否允许创建多份报告。

### 4.2 报告预览响应

正式聚合响应应足以支持以下独立页面区块：

- 报告头：学员摘要、训练师摘要、报告范围、生成时间；
- 统计：训练次数、计划完成度、出勤率、平均评分；
- 评分趋势：日期、课堂记录、评分；
- 体态对比：首末两次有效身体评估及字段差值；
- 反馈汇总：反馈数量、感受分布、代表性文字；
- 训练计划摘要；
- 无数据原因或空数组。

请明确每个数值的计算口径：

- 训练次数统计哪些课堂状态；
- 出勤率的分子、分母及请假/缺席处理；
- 平均评分来源及无评分时返回 `null` 还是省略；
- 计划完成度使用哪个计划、多个计划如何处理；
- 体态对比如何选择首末评估；
- 小数精度和单位；
- 数据按公司、门店、训练师的可见范围。

前端要求“无反馈、无评估照片、仅一次训练”均返回结构稳定的合法响应，不使用虚构的零值代替缺失数据。

### 4.3 保存、状态与发布

请冻结：

- 预览是否持久化；
- `draft → generated → published → archived` 的允许流转；
- 谁可以创建、编辑评语、发布和归档；
- 发布后是否可修改；
- 报告快照是否固定，原始数据变化后是否重算；
- GET 列表的筛选、分页与排序；
- PATCH 可修改字段；
- 并发修改或重复发布的 409 行为。

### 4.4 导出

请明确由谁生成导出文件：

- 后端生成：`POST /export/` 应返回任务、文件资源或下载 URL 的正式 Schema，并说明过期时间和鉴权；
- 前端本地生成：后端无需 export 端点，但需明确报告响应允许本地导出，前端会将导出器保持在独立文件。

不要返回服务器本地文件路径。

### 4.5 分享

如果本期支持分享，请冻结：

- 创建分享的请求与响应；
- 分享 token/URL、过期时间、撤销状态；
- 公开访问是否需要登录；
- 敏感健康数据、照片和评语的授权范围；
- 防猜测 token、访问审计、频率限制；
- 撤销接口的 HTTP 状态和幂等性。

如果本期不支持，请从 Phase 10 `CONTRACT_READY` 范围中明确排除。前端会展示禁用入口并说明“暂未开放”，不会虚构链接。

## 5. 必须提供的示例与错误码

每个正式端点至少提供：

- 正常请求与正常响应；
- 无反馈、无评估、单次训练的成功响应；
- 400 字段校验；
- 401 未登录；
- 403 角色不允许（如采用）；
- 404 跨租户、越权或资源不存在；
- 409 重复反馈、非法状态流转或并发冲突；
- 文件上传/导出/分享相关失败（如纳入本期）。

错误示例必须使用统一 `{code, message, errors, request_id}` 包装，并提供稳定业务 `code`，前端只在适配器中映射。

## 6. 后端交付门槛

请一次性交付：

- 更新后的 `contracts/status.json`；
- 模块化 `contracts/src/paths/feedback.yaml`、`reports.yaml` 和相关 student self-service 路径；
- 正式 Schema；
- `contracts/enums.json` 中的反馈枚举；
- 覆盖成功与关键错误的 examples；
- 重新生成的 `contracts/openapi.yaml`；
- Phase 10 delivery/change log，列出冻结决策；
- 后端 API_READY 状态、迁移与自动化测试结果；
- 可用于联调的五类角色测试账号或种子数据说明；
- 前端需要使用的后端提交号。

交付前应运行：

```powershell
python contracts/scripts/bundle_openapi.py
python contracts/scripts/validate_contracts.py
python contracts/scripts/validate_examples.py
python contracts/scripts/check_enum_sync.py
```

## 7. 前端收到交付后的执行顺序

1. 校验契约脚本和 `status.json`。
2. 重新生成 TypeScript API 类型与枚举。
3. 完成 feedback 领域模型、适配器、Mock 和测试。
4. 完成训练师只读反馈摘要与学员反馈表单。
5. 完成 reports 领域模型、适配器、Mock 和测试。
6. 完成报告生成条件、预览组件组与约定范围内的导出。
7. 仅在分享契约冻结后启用分享。
8. 运行 `npm.cmd run check:all`。
9. 使用真实角色和双租户数据完成联调，再升级为 `INTEGRATED / VERIFIED`。
