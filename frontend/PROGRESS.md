# 瑜悦练前端主动维护交接文档

更新时间：2026-07-24
事实基线：前端功能提交 `49cdab0`，contracts `1.8.0`

## 1. 当前结论

- 当前分支：`frontend/phase-11-dashboard-reminders`
- 前端功能基线：`49cdab0 feat(frontend): complete frontend-only delivery`
- 当前准确状态：`FRONTEND_DEMO_COMPLETE / MOCK_READY / AUTOMATED_CHECKS_PASSED / REAL_API_NOT_FULLY_VERIFIED`
- Phase 1～11 及功能 00～20 的纯前端范围已经收口，可在 Mock 模式下完整演示。
- Phase 9、10 已按正式 contracts 1.7.0/1.8.0 对齐；Phase 11 看板、提醒和学员自助仍依赖草案契约。
- 当前分支已推送至 `origin/frontend/phase-11-dashboard-reminders` 并设置远程上游。
- PR [#5](https://github.com/Ktight/yuyue-excercise/pull/5) 已创建，目标分支为 `main`；检查时状态为 `OPEN / MERGEABLE / CLEAN`。
- GitHub 当前没有为该分支报告自动化检查，合并前需要结合本地质量证据进行人工审查。
- 仓库根目录仍有两个来源不明的未跟踪文件，不属于前端交付，禁止使用 `git add .` 将其带入提交。

## 2. 已完成事项

### Phase 1～7

- 完成认证、用户、公司、门店、场地、课程模板、学员、会员、身体评估、排课、预约和考勤前端。
- 页面只读取稳定的前端领域模型，后端路径、方法、分页包裹和 `snake_case` 字段集中在 `src/backend-adapters/`。
- 已完成主要列表、详情、创建、编辑、启停、取消、状态切换、角色导航、错误状态和 Mock 演示闭环。

### Phase 8

- 完成课堂模板、体式序列、课时档案、单条/批量建档和课堂媒体前端。
- 完成从课堂记录加载模板、将课堂记录保存为模板、媒体说明和排序等交互。

### Phase 9～10

- 完成训练计划 CRUD、状态动作、进度显示、课堂记录关联与解除关联。
- 完成学员反馈提交/查询、重复提交处理和不可修改规则。
- 完成阶段报告查询、日期范围、统计、体态对比、反馈汇总和浏览器打印。
- 已按 contracts 1.8.0 修正反馈路径、正式字段、User ID 语义和出勤率映射。

### Phase 11 和学员自助

- 完成数据看板和提醒中心的暂定 UI、适配器、Mock 与测试。
- 建立独立 `student-self-service` 模块，完成学员聚合首页、训练历史/详情、训练计划/详情和完整档案。
- 暂定 wire 字段只存在适配器，演示数据只存在 Mock，页面只使用稳定 ViewModel。

### 商业演示与工程能力

- 补齐超级管理员、公司管理员、店长、训练师和学员五角色 Mock 登录。
- 补齐排课周视图、预约详情、身体评估对比、角色感知 404 和学员导航。
- 完成 PWA、Docker/Nginx、包体预算和 Capacitor Android/iOS 工程。

## 3. 关键决策

1. 本人只负责 `frontend/**`；不修改 `backend/**` 和 `contracts/**`。
2. OpenAPI 和 enums 是正式生成源，禁止在前端复制维护后端枚举和 DTO。
3. 页面、组件和 Store 不直接解析后端原始响应。
4. 后端差异优先只修改 `src/backend-adapters/`、对应 Mock 和适配器测试。
5. 后端未交付时允许契约一致的 MSW 演示，但 Mock 通过不等于真实 API 联调完成。
6. DRAFT 接口的假设必须集中记录，禁止分散写入多个页面。
7. 真实接口、角色权限、双租户和异常矩阵完成前，不把项目标记为 `VERIFIED`。
8. 当前用户生命周期没有正式硬删除契约，前端不猜测 `DELETE`，使用契约已有的停用能力。

## 4. 当前验证证据

基于提交 `49cdab0`：

- `check:all`：通过
- 模块边界：452 个源文件通过
- Vitest：57 个测试文件、164 项测试通过
- 生产构建：890 个模块转换成功
- 包体：最大 JS 分块 320.7 KiB，总 JS 775.3 KiB
- Playwright：17 项 E2E 通过
- `npm audit`：0 个漏洞
- Android/iOS `cap sync`：通过
- 学员首页和训练历史人工浏览器检查：无横向溢出、页面警告或控制台错误

这些证据证明前端工程和 Mock 演示可用，不代表完整真实 API 或生产环境验收通过。

## 5. 尚未完成和后端依赖

当前统一以 [FRONTEND_BACKEND_REPLACEMENT_MATRIX.md](./FRONTEND_BACKEND_REPLACEMENT_MATRIX.md) 为准：

- `BE-FE-16`：管理、训练师和学员看板正式契约
- `BE-FE-17`：提醒中心正式契约
- `BE-FE-18～21`：学员首页、训练历史、训练计划和完整档案正式契约
- `BE-FE-22`：批量课堂记录部分失败结果
- `BE-FE-23`：媒体和图片上传服务
- `BE-FE-24`：报告保存、发布、后端导出和分享
- `BE-FE-25`：HttpOnly Cookie、CSRF、CSP 和刷新撤销联合方案

此外尚未完成：

- 五个真实角色、双租户和空数据的完整真实 API 联调
- 400、401、403、404、409、500 错误矩阵
- Android APK 构建（本机缺 Android SDK）
- iOS Archive（需要 macOS/Xcode）
- Docker image 最终验证（需要 Docker Engine）

## 6. 下一步执行顺序

### A. 当前分支安全交付

- [x] 执行 `git fetch origin`，确认当前分支已包含 `origin/main`。
- [x] 只推送 `frontend/phase-11-dashboard-reminders`，未暂存两个异常根目录文件。
- [x] 创建以 `main` 为目标分支的 PR #5。
- [x] 检查 PR 文件范围，确认全部位于 `frontend/**`。
- [ ] 等待协作者审查；GitHub 当前没有报告 CI 检查。
- [ ] 审查通过后由仓库维护者决定是否合并，不在本地直接修改 `main`。

### B. 后端契约交付后

在 `frontend/` 中依次执行：

```powershell
npm run generate
npm run check:all
npm run test:e2e
```

然后按以下顺序处理：

1. 更新生成类型和枚举。
2. 只修改对应 `backend-adapters` 映射。
3. 更新同模块 Mock 和适配器测试。
4. 使用真实账号执行角色、租户和错误矩阵。
5. 保存前端提交号、后端提交号、契约版本和验证证据。
6. 只有完成真实联调的模块才能从 `MOCK_READY` 提升为 `INTEGRATED`。

## 7. 新对话继续前的读取顺序

1. 本文件 `frontend/PROGRESS.md`
2. [FRONTEND_STATUS.md](./FRONTEND_STATUS.md)
3. [FRONTEND_BACKEND_REPLACEMENT_MATRIX.md](./FRONTEND_BACKEND_REPLACEMENT_MATRIX.md)
4. `contracts/status.json`
5. 当前任务对应的 Phase 或功能文档

开始修改前必须再次检查：

```powershell
git branch --show-current
git status --short
git log -5 --oneline
git log --oneline HEAD..origin/main
```

## 8. 禁止事项

- 禁止执行 `git add .`。
- 禁止把来源不明的根目录文件带入前端提交。
- 禁止修改 `backend/**`、`contracts/openapi.yaml` 或 `contracts/enums.json`。
- 禁止在 Vue 页面中猜测接口字段或写入 Mock 数据。
- 禁止为了通过演示绕过真实角色权限。
- 禁止把草案接口、Mock 演示或自动化测试记录成真实 API 验收完成。
