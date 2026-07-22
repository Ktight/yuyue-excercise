# Phase 4 前端交付记录

日期：2026-07-22  
范围：课程模板  
契约版本：`1.2.0`  
正式契约提交：`61fe3eb`  
后端交付提交：`bff1ebe`

## 状态

- 前端状态：`UI_READY / MOCK_READY`
- 后端声明状态：`API_READY`
- 真实接口联调状态：`NOT_INTEGRATED`
- 最终状态：`UI_READY / MOCK_READY`，不得标记 `INTEGRATED` 或 `VERIFIED`

## 已完成

- 从正式 `contracts/openapi.yaml` 和 `contracts/enums.json` 重新生成 TypeScript 类型与枚举。
- 建立课程模板独立领域模型，页面不直接读取 snake_case 或响应包裹。
- 新增单一 `course-templates.adapter.ts`，集中处理路径、尾斜杠、分页、请求序列化和响应映射。
- 列表支持搜索、分类、难度、状态筛选及分页。
- 表单支持创建和编辑，实施 `private` 课程容量固定为 1 的前端校验。
- 封面字段只读展示；没有伪造上传或服务器 URL 写入能力。
- `super_admin/company_admin` 可维护；`store_manager/trainer` 只读；新建路由仅允许管理员。
- 状态通过详情 PATCH 更新；删除能力保留在适配器但页面不展示，默认优先停用。
- MSW 使用正式数值 ID、枚举、字段、尾斜杠、统一响应包裹和分页结构。
- 补充领域校验、适配器映射/序列化、状态 PATCH 和表单只读/私教容量测试。

## 正式契约同步引起的前置修复

`61fe3eb` 同时冻结了 Phase 3 的 Company、Store、Room Schema。为恢复前端质量门禁，本次仅在 Phase 3 边界内完成必要适配：

- Company：联系人字段改为 `contact_person`，增加合同起止日期，移除契约不存在的地址和更新时间写入。
- Store：归属公司由响应只读字段映射，写入由 Token 租户决定；增加电话和营业时间。
- Room：使用 `store` 与 `facilities`，移除契约不存在的公司和说明字段。
- 三个模块的状态修改统一改为契约规定的普通 PATCH。
- 对应领域模型、表单、Mock 和既有测试同步更新。

这些修改用于保持 Phase 1–3 与正式契约一致，不包含 Phase 5 功能。

## 自动化验证证据

执行：

```powershell
cd frontend
npm.cmd run check:all
```

结果：

- OpenAPI 类型生成：通过
- 枚举生成：通过
- TypeScript：通过
- ESLint：通过
- Prettier：通过
- 模块边界：通过，检查 212 个源文件
- Vitest：31 个测试文件、108 项测试全部通过
- Production build：通过，Vite 转换 526 个模块

## 真实接口状态

本机访问 `GET http://localhost:8000/api/health/` 返回 404，与后端交付文档声明的健康检查不一致。当前无法确认 8000 端口运行的是 `bff1ebe` 对应环境，因此没有继续登录或读写业务数据，也没有判定为后端缺陷。

待启动并确认正式后端提交后，还需要执行：

- 五角色课程模板路由、按钮和接口权限验证；
- 公司 A/B 跨租户列表与详情 404 验证；
- 搜索、筛选、排序、分页真实接口验证；
- 创建、编辑、重复状态 PATCH、私教容量错误响应验证；
- 确认完成后才可提升为 `INTEGRATED / VERIFIED`。

## 不包含

- Phase 5 学员、会员和体测正式契约适配；
- 封面上传；
- 排课引用后的删除策略 UI；
- 对 `backend/**` 或 `contracts/**` 的任何修改。
