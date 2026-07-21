# Contract Changelog

## CONTRACT-20260721-02

- 契约版本：`1.0.0-draft`
- 发起人：后端与契约负责人
- 原因：按全项目一次性交付任务书建立模块化契约、构建产物、状态和校验工具。
- 影响范围：Phase 1～13、前端功能 00～20 所需后端接口。
- 旧定义：Phase 2 单文件草案、裸成功响应/DRF 分页/旧 Token 字段和重复认证路径。
- 新定义：统一 `code/message/data`、`items/page/page_size/total`、
  `code/message/errors/request_id`、`access_token/refresh_token` 和 `/api/.../` 路径。
- 是否破坏兼容：是。
- 后端完成提交：待用户批准提交后填写。
- 前端完成提交：待联调。
- 计划合入时间：待双方确认。

### 状态说明

- 已实现且测试通过的 Phase 2 operation 单独标记 `x-status: API_READY`。
- auth/users 模块因 logout、重置密码和 Store 归属校验尚未完成，整体仍为 DRAFT/IN_PROGRESS。
- Phase 3～13 路径均为 DRAFT，API 为 NOT_STARTED，不得据此真实联调。
- 未确认候选枚举不写入 `enums.json`，避免把建议误当成冻结事实。

## CONTRACT-20260721-01

- 建立 7 组已确认枚举的唯一事实来源和 Phase 2 初版草案。
