# Phase 4 课程模板契约冻结任务书

日期：2026-07-22  
提出方：前端  
处理方：后端与契约维护者  
目标：一次性冻结课程模板的查询、写入、权限、启停和封面资源边界，使前端只在适配器中处理后端变化，页面和组件不因联调返工。

## 1. 当前已核实事实

- `contracts/status.json` 将 `course_templates` 标记为 `DRAFT / NOT_STARTED`。
- OpenAPI 已声明列表、创建、详情、更新、启用和停用路径，但请求与响应仍使用 `DraftWriteRequest`、`DraftSuccessResponse` 和 `DraftListSuccessResponse`。
- `contracts/src/schemas/courses.yaml` 已有候选 `CourseTemplate`，但尚未绑定到上述端点。
- `contracts/enums.json` 已有 `CourseCategory`、`ResourceStatus`，但 `CourseDifficulty` 尚未进入枚举事实源。
- 当前前端课程模板仅为原型，并与候选契约存在确定冲突；不能作为契约或后端实现依据。
- 前端不会修改 `backend/**`、`contracts/**`，也不会在契约冻结前猜测请求字段和响应结构。

## 2. 当前前端原型与候选契约的确定差异

| 项目 | 当前前端原型 | 当前契约候选 | 处理要求 |
|---|---|---|---|
| ID | `string`，如 `ct-001` | 正整数 `int64` | 冻结后前端统一改为 `number` |
| 分类 | `yoga/pilates/meditation/personal` | `private/small_group/group` | 以最终 `enums.json` 为准 |
| 难度 | 3 个值 | Schema 另有 `all_levels` | 将正式枚举加入 `enums.json` |
| 公司 | 原型缺少 `company_id` | 候选响应必填 | 明确创建归属和响应字段 |
| 封面 | 原型缺少 | 候选响应必填 `MediaResource` | 明确可空性和写入使用的资源 ID 字段 |
| 描述 | 可缺省 | 候选响应必填且可为 `null` | 明确创建/更新可选性 |
| 更新时间 | 原型使用 `PUT` | OpenAPI 使用 `PATCH` | 以冻结后的 OpenAPI 为准 |
| 启停 | 原型使用 `PATCH .../status` | OpenAPI 使用 `POST .../activate|deactivate` | 以冻结后的 OpenAPI 为准 |
| 路径尾斜杠 | 原型缺少 | OpenAPI 路径带尾斜杠 | 由适配器统一处理 |

这些差异是前端原型问题或契约未冻结问题，不应要求后端兼容错误的原型格式。

## 3. 需要冻结的端点

```text
GET   /api/course-templates/
POST  /api/course-templates/
GET   /api/course-templates/{template_id}/
PATCH /api/course-templates/{template_id}/
POST  /api/course-templates/{template_id}/activate/
POST  /api/course-templates/{template_id}/deactivate/
```

如需删除能力，请先定义排课历史引用、审计和恢复策略；当前前端范围不假定存在删除端点。

## 4. 必须提供的具体 Schema

请将下列具体 Schema 绑定到对应端点，不再使用通用 Draft 对象：

- `CourseTemplate`
- `CourseTemplateCreateRequest`
- `CourseTemplateUpdateRequest`
- `CourseTemplateSuccessResponse`
- `CourseTemplateListSuccessResponse`

成功响应继续遵守 `{code, message, data}`，列表继续遵守 `{items, page, page_size, total}`，失败继续遵守 `{code, message, errors, request_id}`。

创建和更新请求不能包含响应专用字段。请明确 PATCH 是部分更新，未传字段不得被清空。

## 5. 字段冻结清单

至少逐项确认：

- `id`：正整数、只读；
- `company_id`：响应是否必填；由 Token 租户推导还是创建时提交；创建后能否改变；
- `name`：必填、最大长度、公司内唯一性、空白处理；
- `category`：只允许 `private/small_group/group`；
- `difficulty`：是否为 `beginner/intermediate/advanced/all_levels`；
- `duration_minutes`：最小值、最大值及允许步长；
- `capacity`：最小值、最大值；私教是否必须严格为 1；
- `description`：可选性、`null` 语义和最大长度；
- `cover`：响应中是否允许 `null`；
- 封面写入字段：是 `cover_id`、其他资源标识，还是独立关联端点；不得要求客户端拼接 URL；
- `status`：是否只允许 `active/inactive`，创建时默认值；
- `created_at/updated_at`：是否需要、是否只读、ISO 8601 格式。

## 6. 枚举交付

请确认并更新唯一事实源：

1. `CourseCategory` 已存在，确认最终值和中文含义；
2. 将正式 `CourseDifficulty` 加入 `contracts/enums.json`；
3. 状态继续复用 `ResourceStatus`，不要再建立重复课程状态枚举；
4. 生成类型中的 Schema 枚举必须与 `enums.json` 完全一致；
5. 私教容量为 1 属于业务规则，需在 Schema、后端校验和错误示例中同时体现。

## 7. 列表查询、分页和选择器规则

请冻结：

- `page`、`page_size` 默认值和上限；
- `search` 搜索字段和空白处理；
- `category`、`difficulty`、`status` 筛选；
- 是否允许 `company_id` 筛选，以及哪些角色可使用；
- 排序字段和默认顺序；
- 无权访问其他公司的筛选条件返回 403 还是空结果；
- 为排课提供选择数据时，是否通过 `status=active` 复用列表；停用模板不得进入新排课选择器；
- 已停用模板在历史排课和历史记录中是否仍可显示摘要。

## 8. 权限与租户隔离

当前功能文件要求“管理员可维护、训练师只读”，但 DRAFT OpenAPI 暂时允许训练师执行写入和启停。请逐端点冻结五角色权限：

- `super_admin`：是否可以跨公司查看、创建和维护；
- `company_admin`：是否可以维护所属公司模板；
- `store_manager`：是否可以维护公司级模板；
- `trainer`：应只读还是允许维护；
- `student`：是否禁止管理接口；
- 列表和详情如何执行公司租户隔离；
- 租户外 ID 返回 403 还是 404。

前端隐藏按钮只负责交互体验，后端必须逐接口执行授权和租户隔离。

## 9. 启停与关联业务规则

请明确：

- 停用模板是否只禁止新排课；
- 已存在的未来排课是否继续有效；
- 历史课时和报告是否继续显示模板名称；
- 重复启用或停用是幂等成功还是 409；
- 有关联排课时能否编辑分类、时长和容量；
- 容量降低到已有预约人数以下如何处理；
- 公司停用后其课程模板能否被启用或编辑；
- 是否需要并发版本或更新时间防止覆盖更新。

## 10. 稳定错误码与示例

请为以下场景提供 HTTP 状态、业务码和标准示例：

- 名称重复；
- 分类或难度非法；
- 私教容量不是 1；
- 时长或容量越界；
- 封面资源不存在、类型错误或不属于当前租户；
- 模板不存在或跨租户访问；
- 上级公司已停用；
- 模板状态与编辑/排课操作冲突；
- 字段校验失败；
- 重复启停或并发修改冲突。

字段错误 key 必须与请求字段一致，并保留 `request_id`。

## 11. OpenAPI 和后端交付要求

契约维护者需要：

1. 在 `contracts/src/**` 绑定具体请求、响应和查询参数；
2. 从源文件重新 bundle `contracts/openapi.yaml`，不得只手改 bundle 产物；
3. 更新 `contracts/enums.json`、示例、`contracts/CHANGELOG.md` 和 `contracts/status.json`；
4. 运行契约校验、枚举同步和示例校验；
5. 稳定后将模块标为 `CONTRACT_READY`；
6. 后端实现和自动化测试完成后才标记 `API_READY`；
7. 提供契约提交号、后端提交号、测试账号、公司租户数据、启动方法和基地址；
8. 提供正常、分页、筛选、权限、跨租户、校验和启停测试证据。

## 12. 前端收到冻结契约后的顺序

前端只执行：

1. 重新生成 `src/generated/**`；
2. 将课程模板后端 DTO、路径、尾斜杠和响应包裹集中到 `backend-adapters/course-templates.adapter.ts`；
3. 建立独立领域模型、Schema、契约 Mock 和适配器测试；
4. 修正当前错误 ID、枚举、PATCH 和启停路径；
5. 再依次完成筛选列表、表单、封面上传、详情、权限和只读选择器；
6. 运行 `check:all`；
7. 在真实接口 `API_READY` 后执行五角色、双租户和关键错误联调；
8. 保持状态为 `BLOCKED/UI_READY`，直到证据满足 `INTEGRATED/VERIFIED`。

## 13. 请后端一次性回复

请逐项回复：

1. 六个端点的最终路径与方法；
2. 五个具体 Schema 及字段可空性；
3. 分类、难度和状态枚举；
4. 公司归属和封面资源写入方式；
5. 查询、分页和排序规则；
6. 五角色权限矩阵和租户外资源行为；
7. 私教容量、启停和排课关联规则；
8. 正式错误码和示例；
9. 契约何时达到 `CONTRACT_READY`；
10. 哪些端点达到 `API_READY`，以及联调提交、环境和测试数据。

在收到上述冻结结果前，前端不会继续固化当前原型中的猜测字段，也不会将 Phase 4 标记为 `MOCK_READY`、`INTEGRATED` 或 `VERIFIED`。
