# 瑜悦练前端工作状态

## Phase 11 contracts 1.9.0 正式对齐（2026-07-24）

当前状态：`CONTRACT_READY / API_READY / UI_READY / MOCK_READY / NOT_INTEGRATED`。

- 独立分支直接建立在官方 `main@a7fba3a`，未夹带 PR #8；
- 已生成正式 API 类型和提醒枚举；
- 管理看板接入具名 Schema、生成时间、上海时区、正式指标和七日趋势；
- 提醒中心接入服务端分页、`unread_only`、完整动作响应和内部路径白名单；
- 忽略提醒增加不可撤销确认，操作失败保留页面上下文和结构化错误；
- Mock、适配器测试与 E2E 已同步官方 contracts 1.9.0；
- 完整 `check:all` 通过：452 个源文件边界、57 个测试文件共 165 项测试、
  890 个模块构建；
- Playwright 17/17 通过；最大 JS 分块 320.7 KiB，总 JS 778.5 KiB。

本轮没有手工修改 `backend/**` 或 `contracts/**`。真实角色、双租户和错误矩阵尚未联调，
因此不得标记 `INTEGRATED / VERIFIED`。详细记录见
`PHASE_11_FRONTEND_CONTRACT_1_9_INTEGRATION.md`。

## Phase 1–8 商业化前端加固（2026-07-23）

- Phase 5 学员创建/编辑移除门店、主教练内部 ID 输入和默认门店 `1`，改为可读选择器；停用资源只为既有记录保留显示，不允许新选。
- 次卡、储值卡和期限卡输入语义分离：次卡填写次数，储值卡按“元”展示并在领域边界转换为“分”，期限卡不再提交含混余额。
- 学员、体测、排课及课程发现的默认日期统一使用本地日历日期，避免中国时区凌晨被 UTC 转换成前一天。
- 排课创建移除门店、教室、课程和教练默认 ID `1`，增加资源完整性、结束时间和周期星期校验。
- 11 处原生确认框改为根级应用确认服务，统一危险操作说明、确认文字、键盘 Esc、弹窗焦点和并发请求处理。
- 结构化 API 错误在使用统一错误工具时保留后端消息和 `request_id`；学员、会员、体测、排课、预约、课堂记录及媒体写操作已优先接入。
- Mock 登录按管理员/训练师账号返回对应角色；新增管理员学员表单 E2E，验证可读归属选择器和会员金额单位。
- Playwright E2E：管理员学员表单与训练师登录/布局/退出共 2 项通过。
- 完整 `check:all` 通过：332 个源文件边界、42 个测试文件共 137 项测试、714 个生产模块构建。
- HttpOnly Refresh Token、CSP/CSRF 发布方案及健康/媒体字段级隐私矩阵需要后端、部署和产品共同确认，已登记为 `BE-FE-10`、`BE-FE-11`，本轮未修改认证协议。
- 本轮只修改 `frontend/**`，未修改 `backend/**` 或 `contracts/**`；完整真实角色、双租户和生产安全验收前仍不标记 `VERIFIED`。

## Phase 8 前端完整性补强与缺陷修复（2026-07-23）

- 单条课堂记录不再要求训练师手填考勤内部 ID，改为选择已到课或迟到且尚未建档的学员，前端会排除已有课堂记录的考勤。
- 课堂档案模板不再手填教练和课程模板内部 ID，改为加载正式用户、课程模板领域数据的可读选择器。
- 批量建档新增按学员覆盖评分、改进标签、教练记录和课后作业，并继续通过 `student_overrides` 适配器边界提交。
- 课时档案列表新增学员、教练、开始日期、结束日期筛选；分页和筛选 Mock 与正式查询参数保持一致。
- 课堂媒体新增说明和排序编辑、图片/视频 MIME 类型校验；PATCH 请求集中在 class-media 后端适配器。
- 修复 MSW 演示数据只有缺席学员、导致单条及批量建档没有可选到课学员的问题；保留原缺席数据供 Phase 7 签到测试。
- 媒体列表加载、删除失败均改为页面内错误状态，避免未处理异步异常；上传说明和批量课堂主题同步加入契约长度限制。
- 首轮完整 `check:all` 通过：324 个源文件边界、39 个测试文件共 131 项测试、706 个生产模块构建。
- 浏览器 MSW 回归已验证课时档案筛选、单条建档可选学员、批量建档个性化表单，检查期间未发现控制台错误。
- 当前仍未执行 Phase 8 真实 API 联调，不标记 `VERIFIED`；Phase 9 契约阻塞状态不变。

## Phase 9 契约准入审计（2026-07-23）

- Training Plans 当前为 `DRAFT / NOT_STARTED`。
- 端点仍绑定通用 Draft 请求/响应，`stages` 未定义结构，无法安全生成正式领域映射与契约 Mock。
- 当前状态：`BLOCKED_BY_DRAFT_CONTRACT / FRONTEND_NOT_STARTED`。
- 一次性冻结要求见 `PHASE_9_CONTRACT_FREEZE_REQUEST.md`；本轮没有猜测字段或修改后端/契约。

## Phase 8 前端实现（2026-07-23）

- 已完成课堂记录模板、动作序列编辑、课堂记录单个/批量创建、草稿编辑、完成状态和课堂媒体上传/挂载/移除。
- Class Templates、Class Records、Class Media 均使用独立领域模型、后端适配器、Mock、页面、路由、公开索引和适配器测试。
- 管理端提供公司范围只读查询与模板管理；训练师端提供模板查看、课堂记录创建/编辑/完成和媒体管理入口。
- Training Plans 明确保留到 Phase 9，本阶段没有猜测实现。
- 当前状态：`UI_READY / MOCK_READY / CONTRACT_INTEGRATED / REAL_API_NOT_VERIFIED`。

## 契约 1.6.0 同步与 Phase 1–7 回归（2026-07-23）

- 当前前端分支已通过 fast-forward 同步最新 `origin/main`，包含 PR #3、Phase 8 后端/契约和学员课程发现对齐提交。
- Schedule 正式响应新增 `remaining_capacity`；前端已在领域模型、后端适配器、MSW Fixture/Handler、适配器测试及学员课程发现页面集中适配。
- 学员课程发现改为正式 `GET /api/schedules/`：后端按学员身份过滤资格、容量、截止时间、时间冲突和既有预约。
- 预约 `student_id` 已在契约 1.6.0 冻结为 `accounts.User` ID，不是 StudentProfile ID。
- 完整 `check:all` 通过：282 个源文件边界检查、36 个测试文件共 125 项测试、643 个生产模块构建。
- Playwright 核心 E2E 通过：1 项测试通过。
- 当前结论：同步与静态/Mock 回归完成；真实学员账号联调尚未执行，不标记 `VERIFIED`。

## Phase 1–7 前端演示完整性补齐（2026-07-22）

- 已补用户详情/编辑/启停/重置密码、个人资料、服务器退出、主要列表分页筛选、排课资源选择器、考勤排课选择器以及学员课程发现演示页。
- 前端演示状态更新为 `DEMO_UI_COMPLETE / MOCK_INTEGRATION_READY / REAL_API_NOT_FULLY_VERIFIED`。
- 真实 API 未完成或契约仍为 DRAFT 的能力已集中记录在 `BACKEND_DEPENDENCIES_PHASE_1_7.md`，不会在页面中临时兼容。
- 详细页面补齐记录见 `PHASE_1_7_DEMO_COMPLETENESS.md`。

## Phase 1–7 视觉改造（2026-07-22）

- 已依据 `docs/design-references/` 的移动端与桌面端设计图完成第一轮统一样式改造。
- 改造范围仅为前端 Token、基础样式、三类角色布局、首页展示以及 Phase 1–7 既有表单/列表/卡片呈现；未改 API、契约、适配器、权限、Mock 或业务流程。
- `check:all` 通过：274 个源文件边界、36 个测试文件、124 项测试、619 个生产模块。
- Playwright E2E 通过；桌面端与 390 × 844 移动端浏览器回归均未发现业务内容横向溢出。
- 当前状态：`IMPLEMENTED / AUTOMATED_CHECKS_PASSED / RESPONSIVE_SMOKE_PASSED / NOT_PRODUCT_VERIFIED`。
- 详细变更和验收边界见 `PHASE_1_7_VISUAL_REFRESH.md`。

## Phase 1–7 收口审查（2026-07-22）

- 当前前端分支已经包含远端 `main` 的全部提交，无需再次拉取或合并后端。
- Phase 1–7 自动化门禁通过，但审查发现路由布局、异步动作错误处理、重试与旧错误、会员只读状态、登录回跳、退出入口、角色菜单及 E2E 覆盖仍需收口。
- 以上项目尚未修复，因此不得据此将 Phase 1–7 整体标记为完全 `VERIFIED`。
- 完整证据、优先级、后端依赖与实施顺序见 `PHASE_1_7_FRONTEND_AUDIT.md`。

### 收口结果

- 审查中记录的路由布局、异步动作、重试与旧错误、会员只读、登录回跳、账户入口和角色菜单问题均已修复。
- `check:all` 通过：274 个源文件边界、36 个测试文件、124 项测试、619 个生产模块。
- 新增的 Playwright 登录回跳与布局 E2E 通过；管理考勤页浏览器烟雾回归通过且无控制台错误。
- 当前达到 `IMPLEMENTED / AUTOMATED_CHECKS_PASSED / BROWSER_SMOKE_PASSED`；完整角色与生产验收前仍不标记整体 `VERIFIED`。

## Phase 7 前端实现记录（2026-07-22）

- 当前状态：`INTEGRATED / UI_READY / MOCK_READY / NOT_VERIFIED`。
- 已完成考勤领域模型、集中适配器、契约 Mock、员工与学员页面、三端路由导航及适配器测试。
- 真实 API 已验证自动生成及幂等、批量签到、请假、本人列表、个人/排课统计和跨租户资源隔离。
- `check:all` 通过：269 个源文件边界、36 个测试文件、121 项测试、612 个生产模块。
- 临时联调数据已清理；本阶段未修改后端或契约。
- 完整证据及尚未完成的最终验收见 `PHASE_7_FRONTEND_DELIVERY.md`。

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

## Phase 9 前端实现记录（2026-07-23）

当前状态：`UI_READY / MOCK_READY / NOT_VERIFIED`。已同步 contracts.zip 的 1.7.0 契约并完成前端实现；契约和后端标记为 `CONTRACT_READY / API_READY`，但本轮未执行真实 API 联调，因此不得标记 `INTEGRATED` 或 `VERIFIED`。

已完成：

- 新增独立 `training-plans` 功能模块，包含领域模型、API 出口、适配器、组件、页面、路由、Mock 和测试；
- 训练师端支持训练计划列表、创建、详情、编辑、暂停、完成与删除；
- 管理端支持按权限只读查看训练计划列表和详情；
- 训练计划详情展示进度、目标、日期、状态及已关联课堂记录；
- 课堂记录创建支持“自动关联 / 不关联 / 指定训练计划”，页面不直接处理后端字段；
- 课堂记录响应中的计划摘要对象已在适配器集中转换；
- 课堂记录详情支持按独立契约端点解除训练计划关联；
- TrainingPlan 使用 StudentProfile ID、课堂记录和考勤使用 User ID 的差异由选择组件与适配层集中处理；
- 学员详情新增“训练规划”Tab，通过训练规划模块公开组件按 StudentProfile ID 加载，不在学员模块复制计划逻辑；
- 学员详情标签在窄屏下支持横向滚动；
- OpenAPI 类型已根据 1.7.0 契约重新生成。

质量证据：

- TypeScript：通过；
- ESLint：通过；
- Prettier：通过；
- 模块边界：353 个源文件通过；
- Vitest：46 个测试文件、145 项测试通过；
- Build：741 个模块转换成功。

待真实联调：

- 使用训练师真实账号验证计划创建、编辑、暂停、完成和删除；
- 验证管理员/店长只读权限以及跨租户、非所属训练师写操作；
- 验证课堂记录自动关联、明确不关联、指定计划和解除关联；
- 验证 StudentProfile ID 与 User ID 的映射及不存在、停用、跨租户异常；
- 验证 400、401、403、404、409 的正式错误响应映射。

## Phase 10 契约阻塞记录（2026-07-23）

历史状态：`BLOCKED`。该阻塞已由 contracts 1.8.0 / GitHub `2e4e8dc` 解除。

- `feedback`、`reports` 和相关 `student_self_service` 端点均为 `DRAFT / NOT_STARTED`；
- 请求与响应仍绑定通用 Draft Schema，示例请求为空对象；
- 反馈正式 Schema、感受枚举、照片资源、重复提交和修改规则尚未冻结；
- 报告聚合结构、统计口径、保存/发布状态、导出与分享语义尚未冻结；
- 为避免前端猜测字段，本轮未创建 Phase 10 业务 Mock 或页面；
- 已生成 `PHASE_10_BACKEND_HANDOFF.md`，作为后端/契约负责人一次性交付清单。

解除阻塞条件：反馈与报告模块达到 `CONTRACT_READY`，正式 Schema、枚举、示例、权限、错误码和本期导出/分享范围均通过契约校验并交付。

### 前端先行实现（用户确认，2026-07-23）

当前补充状态：`PROVISIONAL_UI / PROVISIONAL_MOCK / NOT_CONTRACT_READY`。契约阻塞仍然存在，但为先完成前端演示，所有暂定决策已集中登记在 `PHASE_10_PROVISIONAL_ASSUMPTIONS.md`。

已实现：

- 独立 feedback 模块：领域模型、感受映射、适配器、MSW、感受选择、反馈表单、只读摘要和学员提交页；
- 已完成课堂记录详情组合反馈摘要，无反馈时显示明确空状态；
- 重复反馈 Mock 返回 409，页面显示提交失败状态；
- 图片暂用 URL 演示并明确提示未连接真实上传服务；
- 独立 reports 模块：领域模型、适配器、MSW、报告条件表单和报告预览；
- 支持最近 4 周、8 周和自定义范围，校验开始日期不晚于结束日期；
- 报告展示训练统计、评分趋势、体态对比、反馈汇总和教练评语；
- 导出封装为独立打印服务；分享入口禁用，不生成虚构链接；
- 管理端和训练师端均已增加阶段报告入口；
- 所有暂定路径、字段、枚举、权限和计算口径均未进入生成类型或既有业务页面。

质量证据：

- TypeScript、ESLint、Prettier：通过；
- 模块边界：383 个源文件通过；
- Vitest：46 个测试文件、145 项既有测试通过；
- Build：782 个模块转换成功。
- Phase 10 专项补充：2 个测试文件、2 项测试通过（感受枚举集中映射、报告无数据状态）。

当时限制：该门禁只证明暂定 UI/Mock 没有造成工程回归，不代表字段正确或完成真实联调。该字段风险现已由下方 contracts 1.8.0 对齐记录关闭。

### contracts 1.8.0 正式对齐（2026-07-23）

当前状态：`CONTRACT_READY / API_READY / UI_READY / MOCK_READY / NOT_INTEGRATED`。

- 已合并 GitHub Phase 10 后端与官方 contracts 1.8.0；
- 反馈改用正式 `GET/POST /api/feedback/`，移除错误的 student 专用路径；
- 反馈表单改为 `class_record`、`feeling`、`improvement_note`、`comment`；
- 按正式决策移除反馈照片提交和修改能力；
- 报告改用 `GET /api/reports/?student_id=&start=&end=`；
- 报告学员 ID 已从 StudentProfile ID 修正为 User ID；
- 出勤率从正式 0～1 比例集中映射为页面百分比；
- 正式 body comparison、feedback summary、trainer comments 与 training plan 已集中映射；
- PA-10-01～PA-10-10 已全部确认、替换或按正式契约延期；
- 分享继续禁用，不生成虚构链接。

尚未执行当前安全分支与真实 Phase 10 后端的浏览器联调，因此不得标记 `INTEGRATED / VERIFIED`。

最新 contracts 1.8.0 完整质量门禁：

- 生成、TypeScript、ESLint、Prettier：通过；
- 模块边界：394 个源文件通过；
- Vitest：51 个测试文件、152 项测试通过；
- Build：798 个模块转换成功；
- 完整功能审查见 `FRONTEND_00_20_FULL_AUDIT.md`。

## Phase 11 暂定前端实现（2026-07-23）

当前状态：`PROVISIONAL_UI_READY / MOCK_READY / CONTRACT_DRAFT / NOT_INTEGRATED`。

- 已切换至独立分支 `frontend/phase-11-dashboard-reminders`；
- 新增独立 `features/dashboard`：指标卡、七日预约趋势、今日课程和管理看板页；
- 新增独立 `features/reminders`：提醒列表、仅看未读、标为已读、忽略及业务入口；
- 草案字段集中于领域模型、`backend-adapters` 和 MSW，页面不读取后端字段；
- 真实响应不符合暂定结构时明确报契约不匹配，不静默显示错误数据；
- 管理端导航与路由已接入，并显示“演示数据”状态；
- 暂定假设见 `PHASE_11_PROVISIONAL_ASSUMPTIONS.md`；
- 新增 BE-FE-16、BE-FE-17，等待后端冻结正式契约。

本轮完整质量门禁：

- 生成、TypeScript、ESLint、Prettier：通过；
- 模块边界：420 个源文件通过；
- Vitest：53 个测试文件、154 项测试通过；
- Build：834 个模块转换成功。

### 功能 19 学员端安全补齐与阻塞

- 使用正式 `/api/feedback/` 完成“我的反馈”列表；
- 使用正式 `/api/reports/` 和当前会话 User ID 完成“我的阶段报告”；
- 补充学员首页和桌面导航入口；
- 报告日期继续执行包含首尾最多 366 天的正式规则；
- 学员训练历史、训练计划、聚合首页和完整档案未实现：对应 `student_self_service` 仍为 DRAFT，且正式管理端端点不允许 student；
- 新增 BE-FE-18，等待后端冻结后继续，不以管理端接口绕过角色权限。

本次补齐后的完整门禁：

- 模块边界：423 个源文件通过；
- Vitest：53 个测试文件、155 项测试通过；
- Build：842 个模块转换成功；
- 生成、TypeScript、ESLint、Prettier：通过。

## 功能 00～20 前端独立收口（2026-07-23）

当前状态：`FRONTEND_DEMO_COMPLETE / MOCK_READY / AUTOMATED_CHECKS_PASSED / REAL_API_NOT_FULLY_VERIFIED`。

本轮只修改 `frontend/**`，未修改 `backend/**` 或 `contracts/**`。

### 已完成的纯前端能力

- 五角色 Mock 登录补齐超级管理员、公司管理员、店长、训练师和学员；
- 排课新增周视图和列表/周视图切换，并修复中国时区下 UTC 日期导致的跨日前移；
- 预约新增管理员、训练师和学员共用的只读详情页；
- 身体评估新增任意两次评估对比；
- 课堂记录新增“从模板加载”和“保存为模板”的独立工作流；
- 404 页面新增按会话角色返回首页，并保持 App 层模块边界；
- 新增独立 `student-self-service` 功能模块，补齐学员聚合首页、训练历史/详情、训练计划/详情和完整档案；
- 学员自助草案 wire 字段只存在 `student-self-service.adapter.ts`，演示数据只存在模块 Mock，页面只读取稳定 ViewModel；
- 学员导航不再出现“训练历史待开发”，桌面导航和移动端“我的”入口均已接通；
- PWA manifest、品牌图标、Service Worker、Docker/Nginx、环境示例、包体预算和生产构建脚本已完成；
- Capacitor 8 Android/iOS 工程已生成，最新 Web 资源同步成功；
- 后端最终替换点统一记录在 `FRONTEND_BACKEND_REPLACEMENT_MATRIX.md`。

### 质量证据

- 完整 `check:all` 通过；
- 模块边界：452 个源文件通过；
- Vitest：57 个测试文件、164 项测试通过；
- Build：890 个模块转换成功；
- 包体：最大 JS 分块 320.7 KiB，总 JS 775.3 KiB；
- Playwright：17 项 E2E 全部通过；
- 内置浏览器人工检查：学员聚合首页、训练历史无横向溢出，无页面警告和控制台错误；
- Android/iOS `cap sync` 通过。

### 如实保留的外部阻塞

- 数据看板、提醒和学员自助接口仍是草案，不能标记 `CONTRACT_READY / INTEGRATED`；
- 批量课堂记录当前正式契约为原子操作，部分失败项和定向重试必须等待后端结果 Schema；
- 课程封面、身体评估照片和课堂媒体的真实上传需要后端上传凭证、权限和保留规则；
- 报告保存、发布、后端导出和分享尚无正式契约；
- HttpOnly Cookie、CSRF、CSP 和刷新撤销需要前后端及部署联合方案；
- Android APK 因本机缺 Android SDK 环境阻塞，iOS Archive 需 macOS/Xcode，Docker 镜像需 Docker Engine；
- 全部真实角色、双租户和异常码联调未执行，因此不标记全项目 `VERIFIED`。
