# Phase 4 新版契约包前端审查回执

日期：2026-07-22  
审查对象：`contracts.zip`（文件时间 2026-07-22 09:06:49）  
解压位置：`contracts-review-20260722-090649/contracts/`  
结论：新版已经从通用 Draft Schema 前进到课程模板专用 Schema，并可由 `openapi-typescript 7.13.0` 成功生成类型；但在正式仓库同步和以下契约问题解决前，前端仍不能开始正式 Phase 4 接入。

## 1. 已确认完成

- `course_templates` 状态已标为 `CONTRACT_READY / IN_PROGRESS`；
- 列表、创建、详情、部分更新和删除已绑定课程模板专用 Schema；
- ID 已统一为正整数；
- 分类已使用 `private/small_group/group`；
- 管理员可写、门店管理员和训练师只读的端点权限已体现；
- 公司、名称、时长、容量、难度、描述、封面、状态和时间字段已经定义；
- 成功响应和分页响应已绑定统一包裹；
- 正常创建、详情、列表和更新示例已经提供；
- 解压后的 `openapi.yaml` 已通过前端 OpenAPI 类型生成器实际生成验证。

## 2. 当前硬阻塞

### 2.1 新契约尚未进入正式 Git 仓库

正式开发仓库 `contracts/**` 仍是旧的 `1.0.0-draft` 内容。前端 `check:all` 会从正式仓库重新生成类型，因此不能直接依据工作区外的压缩包修改代码。

请由契约负责人将新版契约提交到正式仓库，并提供提交号。前端不代替契约负责人覆盖或提交 `contracts/**`。

### 2.2 `CourseDifficulty` 没有进入枚举唯一事实源

课程 Schema 定义了：

```text
beginner / intermediate / advanced
```

但 `contracts/enums.json` 没有 `CourseDifficulty`。请补充并运行枚举同步校验，避免前端在领域文件中手写重复枚举。

### 2.3 封面字段与前端验收要求冲突

当前契约使用：

```yaml
cover_image:
  type: string
  format: uri
```

前端功能验收明确要求“上传使用后端资源标识，不拼 URL”。请二选一并写入契约：

1. 推荐：请求使用 `cover_media_id`，响应返回 `MediaResource` 或明确的只读 URL；
2. 如果本 Phase 暂不支持上传，则明确排除封面上传，`cover_image` 仅作为可选只读展示字段，并将上传步骤延期到媒体契约冻结后。

前端不会让用户输入或拼接服务器资源 URL。

### 2.4 公司级与全局模板语义不完整

端点标记 `x-tenant-scope: company_or_global`，但响应字段 `company` 是最小值为 1 的必填整数，无法表达全局模板。

请明确：

- 是否真的存在全局模板；
- 若存在，`company` 是否应允许 `null`；
- 哪个角色可以创建和维护全局模板；
- 公司用户能否编辑全局模板；
- 列表如何区分全局与公司模板。

## 3. 完整功能前需要补齐

### 3.1 列表筛选参数

当前列表只有 `page/page_size`，但功能要求分类、难度、状态筛选，并需要为排课提供只返回启用模板的选择器。请补充或明确排除：

- `search`
- `category`
- `difficulty`
- `status`
- 排序字段和默认排序

停用模板不得进入新排课选择器，建议明确支持 `status=active`。

### 3.2 私教容量规则

当前 Schema 只规定 `max_capacity >= 1`，没有表达 `category=private` 时容量必须为 1。请在描述、业务规则和校验错误示例中冻结该规则，并由后端测试证明。

### 3.3 删除规则

新版增加了 DELETE，但原前端范围主要是启停。请明确：

- 已被排课或历史记录引用的模板能否删除；
- 是否推荐只停用而不物理删除；
- DELETE 204 是否没有响应体；
- 冲突时的 HTTP 状态与业务错误码。

前端在删除规则确认前不会显示删除按钮。

### 3.4 状态修改方式

新版决定通过 PATCH `status` 启停，不发布 activate/deactivate 动作。前端可以由适配器吸收这个决定，但请在变更日志和 Schema 描述中明确：

- 重复提交相同状态是否幂等；
- 停用后已有排课如何处理；
- 状态冲突的业务错误码。

### 3.5 错误示例仍为通用占位

当前 `validation-error.json` 仍使用字段名 `field`，`conflict.json` 仍是通用冲突。请至少提供：

- 名称重复；
- 私教容量不是 1；
- 分类或难度非法；
- 跨租户访问；
- 被排课引用时删除或修改冲突。

字段错误 key 应与实际请求字段一致。

## 4. 验证事实

- 压缩包解压成功，未覆盖正式仓库；
- `openapi-typescript 7.13.0` 对新版 `openapi.yaml` 生成成功；
- 生成结果可识别 `CourseTemplateCreateRequest`、分页参数、PATCH 更新和 DELETE；
- 压缩包自带 Python 校验脚本未能在当前系统 Python 环境运行，因为本机没有可用系统 Python，捆绑 Python 又缺少 `PyYAML`；因此不能据此声称契约自带的三项校验已通过；
- 请契约负责人提供其本地 `validate_contracts.py`、`validate_examples.py`、`check_enum_sync.py` 的实际通过输出。

## 5. 前端继续条件

同时满足以下条件后，前端立即继续 FE-4.1：

1. 新契约由契约负责人提交进正式 Git 仓库；
2. 提供契约提交号；
3. `CourseDifficulty` 进入 `enums.json`；
4. 封面资源 ID 或延期策略明确；
5. `company_or_global` 语义与 `company` 可空性一致；
6. 契约校验、枚举同步和示例校验均通过。

列表筛选、私教容量、删除和业务错误码如果未完全补齐，前端只能实施不依赖这些规则的基础领域模型和适配器，不能将整个 Phase 4 标记为 `UI_READY` 或 `VERIFIED`。
