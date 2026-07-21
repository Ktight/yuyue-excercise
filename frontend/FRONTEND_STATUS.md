# 瑜悦练前端工作状态

更新时间：2026-07-21

## 当前 Git 状态

- 仓库：`Ktight/yuyue-excercise`
- 本地目录：`C:\Users\82759\Desktop\reporteveryday\projects\yuyue-excercise-work`
- 当前分支：`frontend/phase-2-auth-integration`
- 推送目标：仅推送当前前端分支，不修改或合并 `main`
- 前端代码及根 `.gitignore` 已提交并推送。
- 最新提交：`4df538f feat(frontend): add phase 1-2 app and backend adapter layer`。
- 已上传基线提交为 `4df538f`；当前又有 Phase 0～2 完善代码和两份协作文档尚未提交，因此本地工作区不再与远程完全一致。
- `main` 未被修改或合并。

## 前后端责任边界

- 本分支只负责前端正确性，不修改 `backend/**`。
- 不修改后端维护的 `contracts/**`。
- 后端未实现、实现错误或偏离契约的内容不在前端修复。
- 前端通过 Mock、生成类型和适配器保证自身可独立开发和验证。
- 后端接口发生变化时，优先只修改 `src/backend-adapters/`，避免改动页面、组件和 Store。

## 已完成的适配层

- `src/backend-adapters/auth.adapter.ts`
  - 登录
  - 刷新令牌
  - 当前用户
  - 修改密码
  - 认证响应 snake_case 到前端 camelCase 的转换
- `src/backend-adapters/users.adapter.ts`
  - 用户列表
  - 创建用户
  - 用户及分页字段转换
- `src/backend-adapters/index.ts`
  - 后端适配器统一索引
- `src/backend-adapters/README.md`
  - 适配层维护规则和当前功能索引

页面、组件和 Store 只使用 `features/*/model` 中的前端领域模型。后端路径、请求方法、原始响应字段和 OpenAPI 生成类型集中保留在适配器中。

## 已修正的 Phase 1/2 前端问题

- 登录响应由单 Token 改为 access/refresh Token 对。
- 刷新接口在请求体中发送 `refresh_token`。
- 支持刷新 Token 轮换并同时更新两个 Token。
- 修改密码使用契约规定的路径和 POST 方法。
- 用户 ID、公司 ID、门店 ID 改为数字或空值。
- 用户响应增加启用状态并映射为前端领域字段。
- Auth、Users 的 MSW 数据、处理器和测试与当前契约对齐。
- 页面和 Store 不再直接解析后端响应包裹或 snake_case 字段。

## 最近验证结果

执行命令：

```powershell
cd frontend
npm.cmd run check:all
```

结果：

- TypeScript 类型检查：通过
- ESLint：通过
- Prettier：通过
- 模块边界检查：通过，共检查 178 个源文件
- 单元测试：通过，20 个测试文件、91 项测试
- 生产构建：通过，Vite 成功转换 492 个模块
- 模块边界检查：通过，共检查 186 个源文件

## 真实后端联调（2026-07-21）

已实际验证：

- 后端 accounts 自带测试：14 项全部通过。
- `POST /api/auth/login/`：真实请求通过。
- `GET /api/auth/me/`：真实请求通过。
- `POST /api/auth/refresh/`：真实请求通过，新 Refresh Token 与旧值不同。
- 旧 Refresh Token 再次使用返回 401，轮换行为符合前端设计。
- `GET /api/users/`：真实请求通过，分页包裹可被前端适配器解析。
- 浏览器以真实 API 模式登录成功，并跳转 `/admin`。
- 浏览器打开 `/admin/users` 后显示真实用户和分页。
- 已登录状态下可打开 `/change-password` 页面；未提交真实密码修改，避免改变测试账号。

环境限制：后端当前 CORS 允许 `http://localhost:5173`，不允许 `http://127.0.0.1:5173`。本地联调必须使用 `localhost`。

仍未验证：

- 浏览器实际提交修改密码。
- 浏览器实际创建用户。
- Logout 和管理员重置密码（当前后端路由未找到，契约为 DRAFT）。
- Users 与真实 Companies/Stores 的关系约束。

## 下一步

1. 审阅并提交两份新增协作文档。
2. 请后端确认 Phase 1/2 对齐清单中的待确认事项。
3. 在后端接口和运行环境可用后执行真实联调；在此之前不得标记 VERIFIED。
4. 确认 Phase 3 边界后，再选择一个独立前端步骤实施。
