# Phase 3 公司、门店、场地契约冻结任务书

日期：2026-07-21  
提出方：前端  
处理方：后端与契约维护者  
目标：一次性冻结 Phase 3 的 Company、Store、Room 边界，使前端能够通过独立适配层开发，后端后续实现不迫使页面、组件和 Store 返工。

## 1. 当前事实

- `contracts/status.json` 中 companies、stores、rooms 均为 `DRAFT / NOT_STARTED`。
- 对应 OpenAPI 路径存在，但使用 `DraftSuccessResponse`、`DraftListSuccessResponse` 和 `DraftWriteRequest`。
- `Company`、`Store`、`Room` 候选 Schema 已存在，但尚未绑定到具体端点。
- 前端已有 UI/Mock 原型，不代表 Phase 3 已正式完成或已经联调。
- 前端不会修改 `backend/**`、`contracts/**`，也不会自行猜测未冻结字段。

## 2. 本次需要覆盖的端点

### Companies

```text
GET   /api/companies/
POST  /api/companies/
GET   /api/companies/{company_id}/
PATCH /api/companies/{company_id}/
POST  /api/companies/{company_id}/activate/
POST  /api/companies/{company_id}/deactivate/
```

### Stores

```text
GET   /api/stores/
POST  /api/stores/
GET   /api/stores/{store_id}/
PATCH /api/stores/{store_id}/
POST  /api/stores/{store_id}/activate/
POST  /api/stores/{store_id}/deactivate/
```

### Rooms

请按相同原则冻结列表、创建、详情、更新、启用和停用端点。路径以最终 OpenAPI 为准，不由前端猜测。

## 3. 必须冻结的 Schema

请为每个资源提供相互独立的类型，不再使用通用 Draft 对象：

- `Company`
- `CompanyCreateRequest`
- `CompanyUpdateRequest`
- `CompanySuccessResponse`
- `CompanyListSuccessResponse`
- `Store`
- `StoreCreateRequest`
- `StoreUpdateRequest`
- `StoreSuccessResponse`
- `StoreListSuccessResponse`
- `Room`
- `RoomCreateRequest`
- `RoomUpdateRequest`
- `RoomSuccessResponse`
- `RoomListSuccessResponse`

所有成功响应继续使用 `{code, message, data}`，所有分页继续使用 `{items, page, page_size, total}`，错误继续使用 `{code, message, errors, request_id}`。

## 4. 字段确认清单

### Company

至少确认：

- `id` 类型，建议与现有 User 关联统一为正整数；
- `name` 的必填、长度、唯一性和空白处理；
- `address` 是否必填及最大长度；
- `contact_name` 是否必填及最大长度；
- `contact_phone` 的格式、必填性和唯一性；
- `status` 是否只允许 `active/inactive`；
- `created_at`、`updated_at` 的格式与只读属性；
- 是否存在 logo、合同日期等字段；不存在则从当前范围明确排除。

### Store

至少确认：

- `id`、`company_id` 类型；
- `company_id` 在创建后是否允许修改；
- `name` 在全局、公司内还是不要求唯一；
- `address`、联系人、联系电话等正式字段；
- `status`、`created_at`、`updated_at`；
- 公司停用后是否允许新增、编辑或启用门店。

### Room

至少确认：

- `id`、`company_id`、`store_id` 类型；
- `company_id` 是否只读并由所属门店推导；
- `name` 在门店内的唯一性；
- `capacity` 的整数范围及能否降到已有排课人数以下；
- `description` 的可空性与最大长度；
- 是否存在场地类型；如未确认，不应加入正式枚举；
- `status`、`created_at`、`updated_at`。

请明确区分响应字段、创建字段和更新字段，避免前端提交只读字段。

## 5. 查询与分页参数

每个列表端点请明确：

- `page`、`page_size` 的默认值、最小值、最大值；
- `search` 搜索哪些字段，是否去除首尾空格；
- `status` 筛选值；
- Stores 是否接受 `company_id`；
- Rooms 是否接受 `company_id`、`store_id`；
- 排序参数、允许字段和默认顺序；
- 无权访问的筛选目标返回空列表还是 403。

## 6. 权限与租户隔离

必须按五种角色逐端点填写 `x-roles` 和 `x-tenant-scope`，不要让所有 DRAFT 路径共享相同占位权限。

至少冻结：

- `super_admin` 能否查看和管理全部公司；
- `company_admin` 是否只能查看/编辑所属公司及其门店、场地；
- `store_manager` 能否查看公司信息，能管理哪些门店和场地；
- `trainer` 是否只读，以及可见范围；
- `student` 是否完全禁止管理端组织接口；
- 未登录返回 401，无角色权限返回 403，不存在或租户外资源返回 403 还是 404；
- 列表必须由后端按租户过滤，前端隐藏菜单不能替代后端授权。

后端测试必须包含两个公司、多个门店，并证明跨租户访问和修改失败。

## 7. 启停业务规则

请明确以下决策及错误码：

- 停用公司是否级联停用门店和场地；
- 停用公司后所属用户是否还能登录；
- 公司重新启用是否自动恢复下属资源；
- 停用门店是否影响用户归属、现有排课和未来排课；
- 停用场地是否只禁止新排课，历史数据是否继续可见；
- 重复启用/停用是幂等成功还是 409；
- 有关联数据时能否停用，以及错误响应如何表示。

Phase 3 不建议物理删除组织资源。若需要删除端点，必须定义历史数据、审计和恢复策略后再加入契约。

## 8. 错误码

请为以下场景提供稳定业务码、HTTP 状态和示例：

- 名称冲突；
- 联系电话格式错误；
- 公司/门店/场地不存在；
- 跨租户访问；
- 上级资源已停用；
- 门店不属于指定公司；
- 场地不属于指定门店；
- 容量非法或与现有业务冲突；
- 字段校验错误；
- 重复启停。

错误示例必须包含 `code`、`message`、`errors`、`request_id`，字段错误的 key 与请求字段一致。

## 9. OpenAPI 与示例交付要求

请在契约仓库完成：

1. 将具体请求和响应 Schema 绑定到每个端点；
2. 为查询参数、权限、租户范围、状态码补齐定义；
3. 为正常、校验失败、未认证、无权限、不存在和冲突提供示例；
4. 保证 `openapi.yaml` 可重新 bundle，不手工制造与 `src/` 不一致的产物；
5. 运行契约验证脚本并保存结果；
6. 更新 `contracts/CHANGELOG.md` 和 `contracts/status.json`；
7. 只有契约稳定时标记 `CONTRACT_READY`；
8. 只有后端实现和自动化测试通过的端点标记 `API_READY`。

## 10. 后端实现验收证据

后端交付时请提供：

- 后端提交号；
- 契约版本或提交号；
- 数据库迁移结果；
- 测试账号及其角色、公司、门店；
- Company/Store/Room 正常 CRUD 与启停测试；
- 五角色权限矩阵测试；
- 两公司跨租户隔离测试；
- 统一响应与错误格式测试；
- 可用于前端联调的启动方式和基地址。

## 11. 前端收到交付后的处理

前端只执行以下工作：

1. 重新生成 `src/generated`；
2. 在 `src/backend-adapters/` 分别实现 companies、stores、rooms 适配器；
3. 保持页面、组件和 Store 使用前端领域模型；
4. 更新契约型 MSW 与适配器测试；
5. 按 Company → Store → Room → 组合页 → 用户门店联动的顺序实现；
6. 完成真实 API、角色和多租户联调后再标记 `INTEGRATED/VERIFIED`。

## 12. 请后端一次性回复

请逐项回复：

1. 上述端点最终路径和方法是否确认；
2. 三个资源的最终字段及创建/更新差异；
3. 列表查询与分页规则；
4. 五角色权限矩阵；
5. 跨租户资源使用 403 还是 404；
6. 公司、门店、场地的启停级联规则；
7. 正式错误码；
8. 契约何时达到 `CONTRACT_READY`；
9. 哪些端点已经达到 `API_READY`；
10. 可供前端联调的提交号、环境和测试数据。

在收到冻结契约前，前端可以整理纯 UI 和领域结构，但 Phase 3 只能保持 `IN_PROGRESS/UI_READY`，不得声明真实联调完成。
