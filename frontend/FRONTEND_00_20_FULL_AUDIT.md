# 瑜悦练前端功能 00～20 完整审查

审查日期：2026-07-24
审查基线：`frontend/frontend-quality-hardening`，已合入 `origin/main` 提交 `f2f2127`
后端/契约基线：GitHub `2e4e8dc`，contracts `1.8.0`

## 1. 总体结论

前端工程基础、Phase 1～11、三类角色页面和功能 00～20 已形成可构建、可测试、可 Mock 演示的模块化前端闭环。Phase 9、10 使用正式生成类型；看板、提醒和学员自助草案使用独立稳定 ViewModel、后端适配器和 Mock。已知纯前端交互缺口已补齐，剩余事项均属于正式契约、真实 API、上传服务、发布基础设施或原生构建环境。

当前可标记 `FRONTEND_DEMO_COMPLETE / MOCK_READY / AUTOMATED_CHECKS_PASSED`，但不得宣称全项目 `VERIFIED`，因为尚未执行五角色、双租户和 Phase 9～11 的真实 API 浏览器联调。

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
| 07 身体评估 | `UI_READY / MOCK_READY` | 录入、历史、趋势和任意两次评估对比具备；真实照片上传延期 |
| 08 排课 | `UI_READY / MOCK_READY` | 创建、列表、周视图、详情、资源联动和学员发现具备；本地日期已统一避免 UTC 跨日 |
| 09 预约 | `UI_READY / MOCK_READY` | 列表、筛选、代预约、取消、学生预约及三端共用详情具备；真实并发防重复仍需后端验收 |
| 10 签到考勤 | `UI_READY / MOCK_READY` | 签到、批量动作、统计和学员查看具备；部分失败定向重试受正式结果 Schema 阻塞 |
| 11 课时档案 | `UI_READY / MOCK_READY` | 列表、创建、详情、草稿、完成、媒体展示具备；真实媒体上传队列未完成 |
| 12 小班批量课时 | `UI_READY / MOCK_READY` | 公共内容、学员差异和批量提交具备；失败项定向重试未形成完整闭环 |
| 13 课时模板 | `UI_READY / MOCK_READY` | 模板 CRUD、体式编辑、资源选择及课堂记录加载/保存模板工作流具备 |
| 14 训练规划 | `CONTRACT_READY / API_READY / UI_READY / MOCK_READY` | CRUD、状态、进度、关联课时和学员详情接入完成；真实 Phase 9 联调未执行 |
| 15 学员反馈 | `CONTRACT_READY / API_READY / UI_READY / MOCK_READY` | 已按 1.8.0 修正为正式 GET/POST `/feedback/`、不可变、无照片；真实联调未执行 |
| 16 阶段报告 | `CONTRACT_READY / API_READY / UI_READY / MOCK_READY` | 已按 1.8.0 使用 GET 实时预览、User ID、正式统计结构；保存、发布、后端导出和分享由契约明确延期 |
| 17 数据看板 | `PROVISIONAL_UI_READY / MOCK_READY / CONTRACT_DRAFT` | 独立 dashboard 模块、指标卡、七日趋势、今日课程、适配器与 Mock 已完成；统计口径仍待冻结 |
| 18 智能提醒 | `PROVISIONAL_UI_READY / MOCK_READY / CONTRACT_DRAFT` | 独立 reminders 模块、未读筛选、已读/忽略操作、适配器与 Mock 已完成；枚举、角色和动作语义待冻结 |
| 19 学员端 | `PROVISIONAL_UI_READY / MOCK_READY / CONTRACT_DRAFT` | 聚合首页、课程发现、预约、考勤、训练历史/详情、训练计划/详情、完整档案、反馈和报告入口全部具备；草案字段集中在单一适配器 |
| 20 测试打包部署 | `ENGINEERING_READY / ENV_PARTIALLY_BLOCKED` | 完整门禁、25 项 E2E、包体预算、PWA、Capacitor Android/iOS、Docker/Nginx 均已完成；APK、iOS Archive 和 Docker image 仅受本机环境阻塞 |

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

仍需长期治理但不阻塞当前前端交付：

- 旧页面可在后续视觉重构时继续迁移到公共原子组件；
- 大型历史表单可按真实产品变更频率继续拆分，当前边界检查已通过；
- 真实 API 错误矩阵、双租户、并发和权限只能在后端交付后完成；
- 前端性能预算已建立，后续每次新增依赖继续由 `check:bundle` 守门。

## 5. 最新质量证据

执行 `npm.cmd run check:all`：

- OpenAPI 类型与枚举生成：通过；
- TypeScript：通过；
- ESLint：通过；
- Prettier：通过；
- 模块边界：452 个源文件通过；
- Vitest：57 个测试文件、165 项测试通过；
- Build：890 个模块转换成功；
- 包体：最大 JS 分块 320.7 KiB，总 JS 775.4 KiB；
- Playwright：25 项 E2E 通过；
- 五角色导航与移动端审计覆盖 59 个桌面入口、22 个手机入口和 14 个越权路径；
- Capacitor：Android/iOS 最新 Web 资源同步通过。

## 6. 后续优先级

1. 后端冻结并交付 `FRONTEND_BACKEND_REPLACEMENT_MATRIX.md` 中 BE-FE-16～25。
2. 前端按“更新 contracts → generate → adapter/Mock/测试 → 真实联调”的固定顺序替换草案。
3. 使用五个真实角色、双租户和 400/401/403/404/409/500 完成联调矩阵。
4. 在具备 Android SDK、macOS/Xcode 和 Docker Engine 的环境完成最终产物验证。
