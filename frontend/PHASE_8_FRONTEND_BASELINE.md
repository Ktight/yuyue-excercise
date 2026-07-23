# Phase 8 前端实施基线

更新日期：2026-07-23
契约版本：`1.6.0`
分支：`frontend/phase-8-training-records`

## 准入结论

- Class Templates、Class Records、Class Media 均为 `CONTRACT_READY / API_READY`。
- Training Plans 属于 Phase 9；本阶段只保留 Class Record 的可空 `plan` 字段。
- Phase 1–7 已在新契约下通过 `check:all` 和核心 Playwright E2E。

## 独立模块与顺序

1. `features/class-templates/`：课堂记录模板、动作序列和共享范围。
2. `features/class-records/`：单个/批量课堂记录、草稿编辑和完成动作。
3. `features/class-media/`：文件上传及课堂记录媒体元数据。
4. 每个模块依次完成领域模型、适配器、Mock、页面、路由、测试和公开索引。

## 固定边界

- 记录只能从 present/late Attendance 创建，学生、教练、门店、排课及日期由后端推导。
- completed 记录不可编辑；Pose Sequence 固定为 warmup、main、cooldown。
- 上传最大 10MB；前端预校验不替代后端校验。
- 不实现 Phase 9 Training Plans，不修改 `backend/**` 或 `contracts/**`。
