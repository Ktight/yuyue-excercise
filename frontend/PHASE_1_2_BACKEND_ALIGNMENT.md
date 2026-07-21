# Phase 1/2 前后端对齐确认单

更新时间：2026-07-21  
前端分支：`frontend/phase-2-auth-integration`  
核对范围：当前分支中的 `backend/**`、`contracts/**` 与 Phase 1/2 前端适配层

## 说明

本文只记录当前仓库代码和契约中能够查证的事实，不把“尚未实现”直接认定为后端缺陷。

结论分为三类：

1. **当前代码确实未找到**：契约中存在设计，但当前后端路由和实现中没有对应端点。
2. **明确依赖后续 Phase**：当前状态文件已表明依赖模块尚未开始，Phase 2 只能完成临时约束。
3. **状态或范围仍需后端确认**：已有部分实现，但契约状态仍是 DRAFT/IN_PROGRESS，不能由前端自行宣布完成。

## 一、Phase 2 已找到并已由前端适配的后端能力

以下接口已同时在后端路由、视图和当前 OpenAPI 中找到：

| 能力 | 方法与路径 | 后端代码状态 | 契约端点状态 | 前端状态 |
|---|---|---|---|---|
| 登录 | `POST /api/auth/login/` | 已找到 | `API_READY` | 已适配、已测试 |
| 刷新令牌 | `POST /api/auth/refresh/` | 已找到 | `API_READY` | 已适配 Token 轮换、已测试 |
| 获取当前用户 | `GET /api/auth/me/` | 已找到 | `API_READY` | 已适配、已测试 |
| 更新当前用户 | `PATCH /api/auth/me/` | 已找到 | `API_READY` | 后端已找到，当前前端尚未实现对应界面 |
| 修改密码 | `POST /api/auth/change-password/` | 已找到 | `API_READY` | 已适配、已测试 |
| 用户列表 | `GET /api/users/` | 已找到 | `DRAFT` | 已适配、使用契约 Mock 测试 |
| 创建用户 | `POST /api/users/` | 已找到 | `DRAFT` | 已适配、使用契约 Mock 测试 |
| 用户详情 | `GET /api/users/{user_id}/` | 已找到 | `DRAFT` | 后端已找到，当前前端尚未接入页面 |
| 更新用户 | `PATCH /api/users/{user_id}/` | 已找到 | `DRAFT` | 后端已找到，当前前端尚未接入页面 |

已核对的后端路由文件：

- `backend/apps/accounts/urls.py`
- `backend/apps/accounts/user_urls.py`

前端没有修改 `backend/**` 或 `contracts/**`。后端传输格式集中由以下文件适配：

- `frontend/src/backend-adapters/auth.adapter.ts`
- `frontend/src/backend-adapters/users.adapter.ts`

## 二、当前后端代码中确实未找到的端点

### 2.1 注销登录

契约设计中存在：

```text
POST /api/auth/logout/
```

核对结果：

- `contracts/src/paths/auth.yaml` 中存在该端点；
- 该端点的 `x-status` 是 `DRAFT`；
- `backend/apps/accounts/urls.py` 当前只注册了 login、refresh、me、change-password；
- 当前后端路由和视图中未找到 logout 端点实现。

准确结论：**当前代码确实未找到，但契约本身也标记为 DRAFT，不能直接认定为 Phase 2 漏做。**

当前前端行为：只清除本地 access/refresh Token，不调用后端注销接口。将来端点冻结后，只需在 `auth.adapter.ts` 中增加调用。

需要后端确认：注销是否计划在 Phase 2 补齐，还是明确安排到后续 Phase。

### 2.2 管理员重置用户密码

契约设计中存在：

```text
POST /api/users/{user_id}/reset-password/
```

核对结果：

- `contracts/src/paths/users.yaml` 中存在该端点；
- 该端点的 `x-status` 是 `DRAFT`；
- `backend/apps/accounts/user_urls.py` 当前只注册用户列表/创建和用户详情/更新；
- 当前后端路由和视图中未找到 reset-password 端点实现。

准确结论：**当前代码确实未找到，但 Users 契约整体仍为 DRAFT，是否属于 Phase 2 需要后端确认。**

当前前端没有把该能力标记为真实 API 可用。

## 三、明确依赖后续 Phase 的内容

### 3.1 门店是否真实存在及是否属于当前公司

`contracts/status.json` 当前显示：

```text
companies: DRAFT / NOT_STARTED
stores:    DRAFT / NOT_STARTED
```

Phase 2 用户代码目前使用整数 `company_id`、`store_id`，并已实现角色与 `store_id` 是否允许为空的基础规则；但公司和门店模块尚未开始，因此当前阶段无法完成基于真实公司、门店表的完整关系校验，例如：

- `store_id` 对应的门店是否存在；
- 门店是否属于当前操作者所在公司；
- 是否存在跨公司伪造门店归属；
- 公司或门店停用后是否仍允许关联用户。

准确结论：**这部分依赖 Companies/Stores 后续 Phase，不应作为 Phase 2 后端缺陷。**

后续 Phase 完成公司与门店模型时，需要回到 Users 模块补充并重新验证这些关系约束。

### 3.2 学员的正式创建流程

当前 `UserCreateSerializer` 明确拒绝通过管理员用户接口创建 `student`，代码错误信息说明“本阶段不通过管理员接口创建学员”。同时 `students` 在 `contracts/status.json` 中为：

```text
students: DRAFT / NOT_STARTED
```

准确结论：**学员创建属于后续 Students Phase，不是当前用户接口漏做。**

前端当前不应通过 `/api/users/` 创建学员；后续应以 Students 模块冻结后的契约为准。

## 四、已经实现但状态仍需后端确认的内容

### 4.1 Auth 模块整体状态未更新

单个认证端点中，login、refresh、me、change-password 已标记为 `API_READY`，后端也存在实现和测试；但 `contracts/status.json` 仍显示：

```text
auth: DRAFT / IN_PROGRESS
```

需要后端确认：

- 是否因为 logout 仍为 DRAFT，所以 Auth 整体继续保持 IN_PROGRESS；
- 还是认证核心能力已经可以冻结，logout 单独留到后续阶段；
- 前端联调时应该以单端点 `x-status` 还是模块 `status.json` 为最终准入标准。

### 4.2 Users 模块已有实现但整体仍为 DRAFT

后端已经实现用户列表、创建、详情、更新，以及租户范围、角色限制、筛选和排序；但当前状态仍是：

```text
users: DRAFT / IN_PROGRESS
```

这个状态目前是合理的，因为：

- reset-password 尚未找到实现；
- Companies/Stores 尚未开始，完整组织关系校验无法冻结；
- 学员创建由后续 Students 模块承担。

需要后端确认：Users 在 Phase 2 的完成口径是“完成现有四个端点”，还是必须等待上述依赖后才能改为 `API_READY`。

### 4.3 错误码最终名称需要冻结

前端已经支持统一错误响应结构：

```json
{
  "code": "ERROR_CODE",
  "message": "错误说明",
  "errors": {},
  "request_id": "..."
}
```

但业务错误码名称仍应以后端契约最终冻结结果为准。例如手机号重复的实现使用 `PHONE_ALREADY_EXISTS`，前端不应自行发明另一套名称。

需要后端在端点改为 `API_READY` 前确认错误码、HTTP 状态和字段级错误格式。

## 五、前端已经完成的责任

前端已修复并验证以下自身问题：

- 正确读取 access/refresh Token 对；
- 刷新请求体发送 `refresh_token`；
- 支持刷新 Token 轮换；
- 修改密码使用正确路径和 POST 方法；
- 用户、公司和门店 ID 使用数字或空值；
- 页面和 Store 不直接依赖后端 snake_case 字段；
- 后端变化集中由 `frontend/src/backend-adapters/` 处理；
- Auth/Users 的契约 Mock 与适配器测试已通过。

完整前端质量门禁结果：

- TypeScript：通过；
- ESLint：通过；
- 模块边界：通过；
- 单元测试：18 个测试文件、86 项测试全部通过；
- 生产构建：通过。

以上证明前端自身和契约适配逻辑通过验证，不代替真实后端运行环境的端到端验收。

## 六、请后端同学只需回复的确认项

请按编号回复即可：

1. `POST /api/auth/logout/` 是 Phase 2 补齐，还是后续 Phase 实现？
2. `POST /api/users/{user_id}/reset-password/` 是 Phase 2 补齐，还是后续 Phase 实现？
3. Auth 核心四类端点是否可以按各自 `API_READY` 状态开始联调？
4. Auth 模块保持 `IN_PROGRESS` 是否仅因为 logout 尚未冻结？
5. Users Phase 2 的完成口径是否只包含列表、创建、详情、更新？
6. 门店真实性和跨公司门店归属校验是否确认留到 Companies/Stores Phase？
7. 学员创建是否确认留到 Students Phase？
8. 端点冻结前，是否会统一检查业务错误码及错误响应格式？

收到确认后，前端只更新适配层和依赖记录，不要求后端为页面结构做特殊修改。
