# 前端—后端最终替换总台账

更新日期：2026-07-23
契约基线：contracts 1.8.0

## 替换原则

1. 后端交付后先更新 `contracts/**`，执行 `npm run generate`。
2. 响应字段与前端领域模型的转换只修改 `src/backend-adapters/*.adapter.ts`。
3. 同步修改该模块 `mocks/*.handlers.ts` 和适配器测试。
4. Vue 页面、布局和领域组件原则上不因 wire 字段变化而修改。
5. 真实联调完成前不得把 `MOCK_READY` 标成 `INTEGRATED / VERIFIED`。

## 已有正式契约模块

| 模块 | 唯一真实接口入口 | Mock 位置 | 后端交付后验证重点 |
|---|---|---|---|
| 认证会话 | `backend-adapters/auth.adapter.ts` | `features/auth/mocks` | 五角色、刷新轮换、退出撤销、失效会话、修改资料/密码 |
| 用户 | `backend-adapters/users.adapter.ts` | `features/users/mocks` | 角色、门店、启停、重置密码、跨租户 404 |
| 公司 | `backend-adapters/companies.adapter.ts` | `features/companies/mocks` | 超级管理员范围、启停、关联门店、冲突 |
| 门店/场地 | `stores.adapter.ts`、`rooms.adapter.ts` | 对应 `features/*/mocks` | 公司/门店范围、容量、启停与关联冲突 |
| 课程模板 | `course-templates.adapter.ts` | `features/course-templates/mocks` | 私教容量、状态、删除冲突；封面上传仍延期 |
| 学员/会员 | `students.adapter.ts` | `features/students/mocks` | User ID 与 StudentProfile ID、门店/教练、会员类型与余额 |
| 身体评估 | `body-assessments.adapter.ts` | `features/body-assessments/mocks` | 指标空值、趋势排序、照片能力仍延期 |
| 排课 | `schedules.adapter.ts` | `features/schedules/mocks` | 周期排课、容量、截止时间、时区、删除冲突 |
| 预约 | `bookings.adapter.ts` | `features/bookings/mocks` | 本人/代预约、取消、并发重复、权益返还 |
| 考勤 | `attendance.adapter.ts` | `features/attendance/mocks` | User ID、批量动作、重复签到、统计口径 |
| 课堂记录 | `class-records.adapter.ts` | `features/class-records/mocks` | 草稿/完成、计划关联、原子批量创建 |
| 课堂媒体 | `class-media.adapter.ts` | 当前组件/测试 | 上传签名、格式/大小、删除权限、保留策略 |
| 课时模板 | `class-templates.adapter.ts` | `features/class-templates/mocks` | 个人/公司共享范围、训练师权限、课程关联 |
| 训练计划 | `training-plans.adapter.ts` | `features/training-plans/mocks` | StudentProfile ID、状态动作、记录关联与解绑 |
| 学员反馈 | `feedback.adapter.ts` | `features/feedback/mocks` | 不可修改、唯一课时反馈、自助权限、无照片 |
| 阶段报告 | `reports.adapter.ts` | `features/reports/mocks` | User ID、366 天、统计空值、出勤率 0～1 |

## 等待后端冻结后只替换适配层的模块

| 编号 | 能力 | 当前前端位置 | 后端必须交付 | 交付后的修改 |
|---|---|---|---|---|
| BE-FE-16 | 管理看板；trainer/student 待正式裁决 | `dashboard.adapter.ts`、`features/dashboard` | 候选后端已实现 admin；仍需具名正式 Schema、`timezone`、指标口径、租户/门店范围和趋势粒度，并提供远程提交号 | 契约冻结后替换 adapter 的 Draft payload，更新 Mock 与测试；页面 ViewModel 原则上不改 |
| BE-FE-17 | 提醒中心 | `reminders.adapter.ts`、`features/reminders` | 候选后端已实现分页列表及幂等动作；仍需冻结分页、`unread_only`、枚举、排序、角色、动作白名单和状态语义，并提供远程提交号 | 映射分页和动作响应，增加服务端未读筛选、分页 UI、路径白名单、Mock 与测试 |
| BE-FE-18 | 学员聚合首页 | `student-self-service.adapter.ts`、`StudentSelfHomePage.vue`、稳定 ViewModel 与 Mock 已完成 | `/student/home/` 正式 Schema、空状态、推荐规则、统计口径和时区 | 只替换 self-service adapter、Mock 与测试；首页组件不改 |
| BE-FE-19 | 学员训练历史 | 列表、日期筛选、分页、详情、体式、作业、反馈入口和媒体空状态已完成 | `/student/class-records/` 正式列表/详情、分页、排序、反馈关联和媒体可见范围 | 替换 self-service adapter 的 history/record 映射；页面不复用管理权限 |
| BE-FE-20 | 学员训练计划 | 列表、状态筛选、进度卡和只读详情已完成 | `/student/training-plans/` 正式列表/详情、进度口径和状态可见范围 | 替换 self-service adapter 的 plan 映射；页面保持只读 |
| BE-FE-21 | 学员完整档案 | `/student/profile` 的身份、门店、主教练、会员、目标和最近体测页面已完成 | `/student/profile/` 正式 Schema、会员单位、体测范围与字段隐私 | 替换 self-service adapter 的 profile 映射；不把档案字段写进认证 Profile |
| BE-FE-22 | 批量课堂记录部分失败 | 当前正式契约为原子批量操作 | 若产品要求部分成功，提供失败项 `student_id/code/message/retryable` 结构和重试请求 | 扩展 batch result/adapter 后再显示定向重试；当前不伪造 |
| BE-FE-23 | 媒体/图片上传 | `AppImageUploader`、`ClassMediaPanel` | 上传凭证、MIME/大小、缩略图、病毒扫描、删除与保留规则 | 实现上传 service 并注入组件；业务页面不直接上传 |
| BE-FE-24 | 报告保存/分享/后端导出 | 当前仅实时预览与浏览器打印 | 若后续支持，冻结保存、发布、导出任务和分享链接生命周期 | 新增 report delivery adapter；当前禁用入口保持不变 |
| BE-FE-25 | 安全会话升级 | `auth.adapter.ts`、`token-storage.ts` | HttpOnly Cookie、CSRF、CSP、刷新撤销与兼容发布方案 | 按联合方案替换 token 存储；不可单方面修改 |

## Phase 11 后端候选交接状态（2026-07-24）

- 后端候选实现自述状态：`IMPLEMENTED / TESTED / AWAITING_CONTRACT_FREEZE`。
- 当前远程事实状态：contracts 1.8.0 中 `dashboards/reminders` 仍为
  `DRAFT / NOT_STARTED`，远程分支未发现候选后端提交。
- 管理看板候选结构可被当前暂定 adapter 基本识别，但这不构成正式兼容证据。
- 提醒候选返回分页对象，当前 adapter 读取扁平数组，直接联调必然失败。
- 前端不按候选实现提前修改代码；一次性冻结建议见
  `PHASE_11_CONTRACT_DECISION_RESPONSE.md`。

## 每次后端交付后的固定验收

```powershell
npm run generate
npm run check:all
npm run test:e2e
```

还必须使用超级管理员、公司管理员、店长、训练师、学员五个真实账号，覆盖正常、空数据、400、401、403、404、409、500 和双租户越权。
