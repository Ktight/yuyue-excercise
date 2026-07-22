# Phase 1/2 后端对齐结论

更新时间：2026-07-21

## 对前端确认单的正式回复

1. `POST /api/auth/logout/` 纳入 Phase 2，已实现 Refresh Token 所有者校验和黑名单撤销。
2. `POST /api/users/{user_id}/reset-password/` 纳入 Users Phase 2，已实现管理员权限、租户隐藏式 404 和 Django 密码校验。
3. login、refresh、logout、me、change-password 均可按 `API_READY` 开始真实联调。
4. Auth 模块现已完整提升为 `CONTRACT_READY / API_READY`。
5. Users Phase 2 包含列表、创建、详情、更新和重置密码；但模块整体暂不提升为 API_READY。
6. 门店真实性、启用状态和跨公司门店归属确认留到 Companies/Stores Phase，完成后必须回归 Users。
7. 学员创建确认留到 Students Phase，`POST /api/users/` 不创建 student。
8. 每个端点冻结前必须同时检查错误码、HTTP 状态、字段错误、权限矩阵、租户范围、示例和自动化测试。

## 本地联调约定

- 后端：`http://localhost:8000/api/`
- 当前前端读取：`VITE_API_BASE_URL`
- 当前 Vite 配置没有 `/api` 代理，因此启动真实联调前必须设置：

  ```powershell
  $env:VITE_API_BASE_URL='http://localhost:8000/api/'
  $env:VITE_ENABLE_MOCK='false'
  npm.cmd run dev
  ```

- 后端允许 `localhost:5173` 与 `127.0.0.1:5173` 跨域。
- Mock 和真实 API 不得同时启用。

## 前端只读审查发现的待办

- 用户创建表单目前只校验密码最少 6 位；OpenAPI 和 Django 均要求至少 8 位并继续执行 Django 密码校验器。前端应在自身分支调整，后端不降低安全规则。
- 当前 Axios 响应拦截器只转换 401，没有执行“刷新、保存轮换 Token、重试原请求”的闭环。现有 `authStore.refresh()` 可作为后续接入点。
- 当前前端默认 API 地址为 `/api`，但 Vite 未配置代理；必须使用上述环境变量，或由前端负责人以后增加代理。
- Node 25 会与当前测试环境的 `localStorage` 发生冲突；Node 22 下 18 个文件、86 项测试全部通过。建议在前端声明并固定支持的 Node LTS 版本。
- 当前仓库前端文件未通过配置中的 Prettier 检查，属于前端分支格式/行尾问题；后端不代为批量改写。

## 后续后端编码规范

1. 先更新 `contracts/src/**`、examples 和 `status.json`，再实现接口并重新生成 `contracts/openapi.yaml`。
2. API 成功、分页和错误只允许使用既定三种包装，不返回 DRF 默认结构。
3. 正式路径固定 `/api/.../` 且保留尾斜杠；JSON 固定 `snake_case`。
4. 所有租户 QuerySet 必须先限定 company/store/self，再执行筛选和对象查找；跨租户详情默认隐藏式 404。
5. 权限必须由后端执行；前端按钮隐藏不构成授权。
6. 新增业务分支前先登记稳定错误码，不依赖 message 判断流程。
7. 每个写接口必须定义事务、幂等、并发冲突和 Token/敏感数据日志规则。
8. 只有实现、迁移、权限测试、契约校验和真实响应验证全部通过，operation 才能标记 `API_READY`。
