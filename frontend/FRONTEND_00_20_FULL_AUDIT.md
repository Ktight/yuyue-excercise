# 瑜悦练前端功能 00～20 完整审查

审查日期：2026-07-23
审查基线：`frontend/phase-10-integration-safety`
后端/契约基线：GitHub `2e4e8dc`，contracts `1.8.0`

## 1. 总体结论

前端工程基础、Phase 1～10 核心管理端业务已经形成可构建、可测试、可 Mock 演示的模块化代码。Phase 9、10 已使用正式生成类型和独立后端适配层。项目仍不能称为全部完成：功能 17 数据看板、功能 18 智能提醒、功能 19 完整学员端和功能 20 原生打包/部署尚未完成；功能 05、07、08、09、11～13 仍有产品级交互缺口。

当前不得宣称全部 `VERIFIED`，因为尚未在当前合并分支执行五角色、双租户和 Phase 9～10 真实浏览器联调。

## 2. 功能逐项状态

| 功能 | 状态 | 审查结论 |
|---|---|---|
| 00 工程基础 | `ENGINEERING_READY` | Vue/TS/Vite、Lint、格式、Vitest、MSW、Playwright、生成脚本、路由、布局、边界检查均存在；已补公共按钮、卡片、字段、工具栏和图片上传边界组件 |
| 01 认证与会话 | `UI_READY / MOCK_READY / PARTIAL_INTEGRATED` | 登录、刷新、会话、守卫、修改密码、资料、退出具备；真实五角色与失效会话矩阵未完成 |
| 02 用户管理 | `UI_READY / MOCK_READY` | 列表、筛选、分页、创建、详情、编辑、启停、重置密码具备；真实跨租户和全部字段错误未验收 |
| 03 公司管理 | `UI_READY / MOCK_READY` | 列表、创建、详情、编辑、启停和确认具备；真实级联/删除业务规则仍需验收 |
| 04 门店与场地 | `UI_READY / MOCK_READY` | 门店/场地 CRUD、选择组件和级联展示具备；真实租户、门店变更边界需补验收 |
| 05 课程模板 | `UI_READY / MOCK_READY` | 列表、筛选、表单、详情、状态和只读选择组件具备；正式契约将封面上传延期 |
| 06 学员档案 | `UI_READY / MOCK_READY` | 列表、创建、详情、编辑、会员、身体评估和训练规划组合具备；复杂表单仍可继续拆分 |
| 07 身体评估 | `UI_READY / MOCK_READY` | 录入、历史和趋势具备；真实照片上传延期，商业级双评估对比仍需加强 |
| 08 排课 | `UI_READY / MOCK_READY` | 创建、列表、详情、资源联动和学员发现具备；完整日/周日历与详情抽屉未达到指令目标 |
| 09 预约 | `UI_READY / MOCK_READY` | 列表、筛选、代预约、取消、学生预约具备；独立详情和更完整的并发防重复验收不足 |
| 10 签到考勤 | `UI_READY / MOCK_READY` | 签到、批量动作、统计和学员查看具备；批量失败项和真实并发验收需加强 |
| 11 课时档案 | `UI_READY / MOCK_READY` | 列表、创建、详情、草稿、完成、媒体展示具备；真实媒体上传队列未完成 |
| 12 小班批量课时 | `UI_READY / MOCK_READY` | 公共内容、学员差异和批量提交具备；失败项定向重试未形成完整闭环 |
| 13 课时模板 | `UI_READY / MOCK_READY` | 模板 CRUD、体式编辑和资源选择具备；从课时保存/加载模板的完整交互仍需加强 |
| 14 训练规划 | `CONTRACT_READY / API_READY / UI_READY / MOCK_READY` | CRUD、状态、进度、关联课时和学员详情接入完成；真实 Phase 9 联调未执行 |
| 15 学员反馈 | `CONTRACT_READY / API_READY / UI_READY / MOCK_READY` | 已按 1.8.0 修正为正式 GET/POST `/feedback/`、不可变、无照片；真实联调未执行 |
| 16 阶段报告 | `CONTRACT_READY / API_READY / UI_READY / MOCK_READY` | 已按 1.8.0 使用 GET 实时预览、User ID、正式统计结构；保存、发布、后端导出和分享由契约明确延期 |
| 17 数据看板 | `PROVISIONAL_UI_READY / MOCK_READY / CONTRACT_DRAFT` | 独立 dashboard 模块、指标卡、七日趋势、今日课程、适配器与 Mock 已完成；统计口径仍待冻结 |
| 18 智能提醒 | `PROVISIONAL_UI_READY / MOCK_READY / CONTRACT_DRAFT` | 独立 reminders 模块、未读筛选、已读/忽略操作、适配器与 Mock 已完成；枚举、角色和动作语义待冻结 |
| 19 学员端 | `PARTIAL_UI` | 首页、课程发现、预约、考勤、资料和底部导航存在；训练历史、计划、反馈入口、报告入口仍未形成完整学员闭环 |
| 20 测试打包部署 | `PARTIAL` | 单测、少量 E2E 骨架和生产构建存在；五角色 E2E、性能、Capacitor、Android/iOS、Docker/Nginx 未完成 |

## 3. Phase 10 GitHub 对齐结果

- 已合并 GitHub `c2d98d7` Phase 9 和 `2e4e8dc` Phase 10；
- contracts 已统一为官方 1.8.0；
- feedback/reports 生成类型成功；
- 反馈照片、反馈修改、student 专用反馈路径均已按正式契约移除；
- 报告 POST preview 已改为 GET `/reports/`；
- 报告参数改为 User ID、`start/end`，范围最多 366 天；
- 出勤率从 0～1 集中转换为百分比；
- 报告保存、分享和后端导出继续禁用或延期。

## 4. 架构审查

通过项：

- 页面不直接读取 OpenAPI 原始字段；
- wire 字段和 ID 语义集中在 `backend-adapters`；
- 每个功能有独立目录和公开 `index.ts`；
- MSW 位于功能 `mocks`；
- 路由集中聚合且按角色守卫；
- 模块边界脚本通过；
- 设计令牌、公共布局和状态组件存在；
- 新增统一按钮、卡片、表单字段、工具栏和图片上传边界组件。

仍需治理：

- 多个旧页面仍保留重复的 button/input/select/card scoped 样式；
- 部分大型表单尚未拆成指令要求的独立分区；
- Phase 8～10 专项组件测试覆盖仍低于早期模块；
- 学员端导航存在“功能代码已有但入口不完整”的情况；
- E2E 数量不足，不能证明完整商业流程。

## 5. 最新质量证据

执行 `npm.cmd run check:all`：

- OpenAPI 类型与枚举生成：通过；
- TypeScript：通过；
- ESLint：通过；
- Prettier：通过；
- 模块边界：394 个源文件通过；
- Vitest：51 个测试文件、152 项测试通过；
- Build：798 个模块转换成功。

## 6. 后续优先级

1. 使用真实后端完成 Phase 9～10 五角色和双租户联调。
2. 补齐学员端训练历史、训练规划、反馈与报告入口。
3. 补排课日/周视图、预约详情、批量失败重试等已知缺口。
4. 等 Phase 11 契约冻结后实现数据看板与提醒。
5. 完成核心 E2E、性能、Capacitor、Android/iOS 和容器部署。
