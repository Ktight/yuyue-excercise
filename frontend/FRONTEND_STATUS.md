# 瑜悦练前端工作状态

## Phase 6 前端实现记录（2026-07-22）

- 当前状态：`INTEGRATED / UI_READY / MOCK_READY / PARTIALLY_BLOCKED`。
- 员工排课、单次/周期创建、编辑、删除、代预约、预约列表与取消已经完成。
- 真实 API 已通过冲突 409、周期创建、次卡扣减/恢复和数据清理验证。
- 学员课程发现入口受 `BE-06-01` 阻塞；预约 `student_id` 资源语义差异登记为 `BE-06-02`。
- 完整实现与证据见 `PHASE_6_FRONTEND_DELIVERY.md`。

## Phase 6 启动基线（2026-07-22）

- 已将远端 `main` 的 Phase 6–7 正式提交合入当前前端分支，契约版本更新为 `1.4.0`。
- 合并后重新生成类型和枚举，Phase 1–5 完整 `check:all` 通过：219 个源文件边界、33 个测试文件、113 项测试、548 个模块生产构建。
- Schedules 与 Bookings 均为 `CONTRACT_READY / API_READY`，前端当前为 `FRONTEND_NOT_STARTED`。
- 详细实施顺序和边界见 `PHASE_6_FRONTEND_BASELINE.md`。

## Phase 5 前端完成记录（2026-07-22）

- 当前状态：`INTEGRATED / UI_READY / MOCK_READY / NOT_VERIFIED`。
- 已完成学员、会员资格、Eligibility 与身体评估的领域模型、集中适配器、契约 Mock、页面和自动化测试。
- `check:all` 通过：219 个源文件边界、33 个测试文件、113 项测试、548 个模块生产构建。
- 真实 API 已验证嵌套用户字段、会员状态、资格判定、体测 CRUD/趋势、跨租户 404 与学员角色 403；临时体测数据已删除。
- Phase 5 已满足进入 Phase 6 的前端门槛；完整证据见 `PHASE_5_FRONTEND_DELIVERY.md`。

## Phase 4 前端完成记录（2026-07-22）

- 正式契约 `1.2.0`（提交 `61fe3eb`）已合并并重新生成类型、枚举。
- 课程模板领域模型、后端适配器、契约 Mock、筛选分页、表单、详情、角色只读规则和自动化测试已完成。
- 正式契约同步造成的 Phase 3 Company/Store/Room 编译回归已在领域模型和适配边界修复。
- `npm.cmd run check:all` 通过：212 个源文件边界检查、31 个测试文件、108 项测试、526 个模块生产构建。
- 已清理占用 8000 端口的旧 Django 进程，并从当前仓库启动正式后端；健康检查、七账号登录、角色读写权限、A/B 租户隔离、筛选、详情、状态幂等、删除清理及公司管理员浏览器真实 API 页面均已通过。
- 当前状态提升为核心课程模板路径 `INTEGRATED / NOT_VERIFIED`；五角色完整浏览器矩阵、多页分页、排序、全部标准错误及生产环境验收尚未完成，因此不标记 `VERIFIED`。
- Vue Router 全局守卫已由弃用的 `next()` 回调改为返回值模式；路由定向测试 14 项、完整 `check:all` 和浏览器控制台回归均通过，不再产生弃用警告。
- 完整证据和待联调清单见 `PHASE_4_FRONTEND_DELIVERY.md`。

## Phase 5 测试基线（2026-07-22）

- 后端学员列表、详情、会员、eligibility、身体评估列表和趋势的真实查询基线已执行，角色和双租户隔离符合当前契约。
- 当前 Phase 5 前端仍是旧 DTO 原型；真实学员列表请求成功后在 `StudentCard.vue` 因正式嵌套 `user` 字段未适配而渲染失败。
- Phase 5 当前状态为 `IN_PROGRESS / NOT_UI_READY / NOT_MOCK_READY`，本轮没有修改 Phase 5 业务代码。
- 具体证据、差异和实施边界见 `PHASE_5_TEST_BASELINE.md`。

更新时间：2026-07-22

## 样式分层（2026-07-22）

- 全局样式改为单一 `src/app/styles/index.css` 入口；
- 固定 `reset → tokens → theme → base → layout → components → utilities` CSS Layer 顺序；
- 原 `tokens.css` 变量名称全部保留，现有 38 个 scoped Vue 样式无需迁移；
- 新增默认主题语义变量，未来换肤只覆盖语义层；
- 新增无业务含义的布局类和少量工具类，目前未强制替换业务页面；
- 移除会改变现有盒模型、标题间距、输入背景和焦点外观的新增规则，确保本次以结构调整为主；
- API、Store、Schema、路由、权限、事件和后端适配器均未因本次分层修改。

验证结果：`check:all` 通过；202 个源文件边界检查、26 个测试文件/98 项测试、514 模块生产构建全部成功。页面视觉方向仍待确认，本次不代表最终 UI 风格冻结。

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
- Phase 1/2 代码逻辑、商业级完成门禁和统一记录模板见 `PHASE_DEVELOPMENT_AND_COMPLETION_STANDARD.md`。

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

1. 审阅并提交当前本地前端改动和新增协作文档。
2. 将 `PHASE_4_CONTRACT_FREEZE_REQUEST.md` 交给后端与契约维护者，一次性冻结课程模板契约。
3. 请后端继续确认 Phase 1/2/3 对齐清单中的待确认事项。
4. Phase 4 达到 `CONTRACT_READY` 后，从 FE-4.1 的领域模型、适配器和契约 Mock 开始实施。
5. 在后端接口和运行环境可用后执行真实联调；在此之前不得标记 VERIFIED。

Phase 3 的契约冻结要求已整理在 `PHASE_3_CONTRACT_FREEZE_REQUEST.md`。在 Companies/Stores/Rooms 契约达到 `CONTRACT_READY` 前，只推进不依赖未确认字段的前端结构和交互，不进行真实联调。

## Phase 2 最终测试清单

以下项目均为待验证项。全部通过并保存测试证据前，Phase 2 只能标记为“前端实现基本完成、部分真实联调完成”，不得整体标记为 `VERIFIED`。

- [ ] 管理员在浏览器中真实创建用户成功，列表能显示新用户。
- [ ] 创建用户时验证重复手机号、必填字段、密码长度和后端字段错误映射。
- [ ] 当前用户在浏览器中真实修改密码成功。
- [ ] 旧密码错误时页面能展示契约规定的错误信息，且不会清除有效会话。
- [ ] 修改密码后验证旧密码不可登录、新密码可以登录；确认既定 Token 失效策略。
- [ ] 使用五种角色分别验证可访问路由、菜单显示、按钮权限和越权响应。
- [ ] 使用至少两个公司及其门店数据验证租户数据隔离，避免跨公司或跨门店读取与操作。
- [ ] 使用真实 Companies/Stores 数据验证创建用户时公司、门店选择及其约束关系。
- [ ] 验证多个并发请求同时返回 401 时只刷新一次 Token，并能重放原请求。
- [ ] 验证 Refresh Token 失效后清理会话并跳转登录页，不出现循环刷新。
- [ ] 后端提供正式契约与路由后，验证 Logout 和管理员重置密码；当前为 DRAFT，不计作前端缺陷。
- [ ] 完成真实联调后重新运行 `npm.cmd run check:all`，记录 lint、typecheck、test、build 结果。

每一项测试应记录：测试日期、前端提交号、后端提交号、使用角色与租户、请求结果、页面结果以及失败归属。后端未实现或偏离契约的情况单独登记，不在页面或 Store 中临时兼容。

## Phase 3 前端完成记录（2026-07-21）

当前状态：`UI_READY / MOCK_READY`。前端范围已实现并通过质量门禁；Companies、Stores、Rooms 契约仍为 `DRAFT`，后端状态仍为 `NOT_STARTED`，因此不得标记 `INTEGRATED` 或 `VERIFIED`。

已完成：

- Company、Store、Room 使用独立领域模型及独立后端适配器；
- 后端路径、尾斜杠、`snake_case`、分页包裹和数字 ID 集中在适配层；
- 公司列表、创建、详情、编辑和启停；公司详情通过 Store 公开入口组合所属门店；
- 公司页面权限区分：超级管理员维护，公司管理员只读，启停必须二次确认；
- 门店列表、创建、详情、编辑和启停；创建门店不再硬编码公司；
- 门店详情通过 Room 公开入口展示、创建、编辑和启停场地；
- `CompanySelect`、`StoreSelect`、`RoomSelect` 独立导出；
- 创建用户支持门店联动：店长必选、教练可选、其他角色自动清除门店；
- 契约型 Company/Store/Room MSW 数据改为数字 ID；
- 选择组件和用户门店校验测试已补充。

质量证据：

- TypeScript：通过；
- ESLint：通过；
- Prettier：全部前端源文件通过；
- 模块边界：202 个源文件通过；
- Vitest：26 个测试文件、98 项测试通过；
- Build：514 个模块转换成功。

待后端后续提供并联调：具体请求/响应 Schema、正式权限矩阵、多租户隔离、启停端点与级联规则、正式业务错误码、Company/Store/Room `API_READY` 环境。详细要求见 `PHASE_3_CONTRACT_FREEZE_REQUEST.md`。

合同日期和场地类型尚未进入冻结 Schema/枚举，因此前端未猜测实现；后端确认加入或明确排除后，仅更新领域模型、适配器、Schema 与对应表单文件。

## Phase 4 契约审计记录（2026-07-22）

当前状态：`BLOCKED`。课程模板已有 UI/MSW 原型，但契约仍为 `DRAFT / NOT_STARTED`，不能据此标记 `MOCK_READY` 或继续固化字段。

已确认问题：

- 端点请求和响应仍绑定通用 Draft Schema，无法安全生成正式请求/响应类型；
- 原型使用字符串 ID，候选契约使用正整数 ID；
- 原型课程分类与 `contracts/enums.json` 不一致；
- 候选 Schema 包含 `all_levels` 难度，但枚举事实源尚无 `CourseDifficulty`；
- 原型缺少 `company_id` 和封面资源；
- 原型使用 PUT 和自定义状态 PATCH，OpenAPI 草案使用 PATCH 及 activate/deactivate POST；
- 管理员维护、训练师只读的产品要求与 DRAFT 写接口角色声明不一致。

本轮未修改课程模板业务代码，也未修改 `backend/**` 或 `contracts/**`。完整冻结要求见 `PHASE_4_CONTRACT_FREEZE_REQUEST.md`。

### 新版 contracts.zip 审查

- 新包版本为 `1.1.0-draft`，课程模板标记为 `CONTRACT_READY / IN_PROGRESS`；
- 新 OpenAPI 已通过前端 `openapi-typescript 7.13.0` 隔离生成验证；
- 正式 Git 仓库尚未同步新版契约，因此 `check:all` 仍会生成旧类型；
- `CourseDifficulty` 未进入 `enums.json`，封面 URL 与资源标识验收冲突，`company_or_global` 与必填公司 ID 语义不一致；
- 列表筛选、私教容量、删除关联和课程专用错误示例仍需补齐；
- 详细审查回执见 `PHASE_4_CONTRACT_REVIEW_RESPONSE.md`。

### Phase 5 契约审计

- 新包中的 Students、Body Assessments 仍为 `DRAFT / NOT_STARTED`，端点继续使用通用 Draft 请求和响应；
- 候选 Student/Membership/BodyAssessment Schema 尚未绑定端点，不能作为正式前端 DTO；
- 学员创建与 User 关系、门店/教练归属、会员组合规则、训练师可见范围和敏感健康信息权限尚未冻结；
- 身体评估字段可空性、单位、体脂/围度/备注/照片、趋势数据和媒体权限尚未冻结；
- 当前前端相关代码继续只算 UI/MSW 原型，不提升完成状态；
- Phase 4 与 Phase 5 的一次性反馈已合并到 `PHASE_4_5_CONTRACT_FEEDBACK.md`，后续只需向协作者发送这一份。

### Phase 5 不依赖后端的前端修正

- 新增集中式学员导航函数，管理员端和训练师端复用页面会保留当前角色路由前缀；
- 修正训练师在学员列表、新建成功、详情选择和编辑成功后错误进入 `/admin` 的问题；
- 学员列表错误状态的“重试”现在会重新执行加载；
- 学员详情 Tabs 从页面中拆为独立 `StudentDetailTabs.vue`，包含横向窄屏滚动和 `aria-current`；
- 新增路由导航和 Tabs 测试，共新增 2 个测试文件、3 项测试；
- 完整 `check:all` 通过：206 个源文件边界检查、28 个测试文件、101 项测试、518 模块生产构建；
- 本次完整门禁仍基于正式仓库中的旧契约生成，只证明当前前端没有回归，不代表新版 zip 或 Phase 5 真实接口已联调。
