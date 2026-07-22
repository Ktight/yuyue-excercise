# Phase 4–5 前端对后端与契约的一次性交付反馈

日期：2026-07-22  
提出方：前端  
处理方：后端与契约维护者  
覆盖范围：前端 Phase 4 课程模板、Phase 5 学员档案与身体评估  
目标：本文件一次性消除双方对 Phase 编号、契约完成范围、字段、权限和业务规则的信息差。请统一处理后再向前端交付正式 Git 提交，不需要分多轮发送压缩包。

## 1. 先统一 Phase 编号

当前存在两套编号：

| 前端 Phase | 功能文件编号 | 内容 |
|---|---|---|
| Phase 4 | 功能 05 | 课程模板 |
| Phase 5 | 功能 06 | 学员档案 |
| Phase 5 | 功能 07 | 身体评估 |

新版 `contracts.zip` 已将“功能 05 课程模板”标记为 `CONTRACT_READY`，这对应前端 **Phase 4**；`students` 和 `body_assessments` 仍是 `DRAFT / NOT_STARTED`，因此前端 **Phase 5 尚未达到 CONTRACT_READY**。

后续沟通请同时写“前端 Phase + 功能编号 + 模块名”，例如：

```text
前端 Phase 5 / 功能 06 学员档案 / 功能 07 身体评估
```

## 2. 新版契约包的验证结果

- 收到文件：`contracts.zip`，时间 2026-07-22 09:06:49；
- 安全解压到独立审查目录，没有覆盖正式仓库；
- 契约版本：`1.1.0-draft`；
- `openapi-typescript 7.13.0` 已对新版 `openapi.yaml` 实际生成成功；
- 课程模板专用请求、响应和分页类型可以生成；
- 压缩包自带 Python 校验脚本未在前端机器完成运行：系统无可用 Python，捆绑 Python 缺少 `PyYAML`；
- 请契约负责人提供 `validate_contracts.py`、`validate_examples.py`、`check_enum_sync.py` 的实际通过输出；
- 正式 Git 仓库仍是旧契约，前端不能把压缩包审查目录当成正式事实源。

## 3. 共同交付要求

请不要再次只发送压缩包。最终交付必须：

1. 由契约负责人修改并提交正式仓库的 `contracts/**`；
2. 从 `contracts/src/**` 重新 bundle `contracts/openapi.yaml`；
3. 更新 `contracts/enums.json`、示例、`CHANGELOG.md` 和 `status.json`；
4. 提供契约 Git 提交号；
5. 提供三项契约校验通过输出；
6. 后端达到 `API_READY` 时另提供后端提交号、启动方式、测试账号和租户数据；
7. 前端不会替契约负责人覆盖或提交 `contracts/**`。

---

# 第一部分：前端 Phase 4 / 功能 05 课程模板

## 4. 已完成且可以保留

新版课程模板契约已有以下有效进展：

- 使用正整数 ID；
- 定义 `CourseTemplate`、Create、Update、Success、ListSuccess；
- 定义列表、创建、详情、PATCH 更新和 DELETE；
- 管理员写入、门店管理员与训练师只读的权限方向已经体现；
- 分类使用 `private/small_group/group`；
- 响应包含公司、名称、分类、时长、容量、难度、描述、封面、状态和时间；
- 成功和分页响应使用统一包裹；
- 已提供正常创建、详情、列表和更新示例。

## 5. Phase 4 必须修正

### 5.1 枚举唯一事实源

Schema 使用 `beginner/intermediate/advanced`，但 `contracts/enums.json` 没有 `CourseDifficulty`。请补充：

```json
"CourseDifficulty": {
  "beginner": "初级",
  "intermediate": "中级",
  "advanced": "高级"
}
```

最终中文名称由产品确认；关键是 Schema 和枚举文件必须同步。状态继续复用 `ResourceStatus`。

### 5.2 封面上传

当前 `cover_image` 是可写 URL，但前端验收要求使用后端资源标识，不由页面拼接 URL。请二选一：

- 推荐：请求使用 `cover_media_id`，响应返回资源 ID 和只读 URL；
- 或明确 Phase 4 不提供上传，将封面上传延期，`cover_image` 只作为可选只读字段。

前端不会提供让用户手填服务器 URL 的控件。

### 5.3 全局模板与公司模板

`x-tenant-scope` 写为 `company_or_global`，但 `company` 是必填正整数。请明确：

- 是否存在全局模板；
- 如果存在，`company` 是否允许 `null`；
- 谁可以创建、修改、删除全局模板；
- 公司用户能否修改全局模板；
- 列表如何区分全局和公司模板。

如果当前不支持全局模板，请把 scope 改为明确的 `company`。

### 5.4 列表能力

当前只提供 `page/page_size`。前端需要冻结：

- `search`
- `category`
- `difficulty`
- `status`
- 排序参数和默认顺序

排课选择器必须能稳定请求启用模板，建议支持 `status=active`。

### 5.5 私教容量

请明确 `category=private` 时 `max_capacity` 必须为 1，并提供后端校验和字段错误示例。仅设置默认值 1 不足以约束非法请求。

### 5.6 PATCH 状态与删除

新版决定通过 PATCH `status` 启停，前端可以由适配器吸收。仍需明确：

- 重复提交相同状态是否幂等；
- 停用模板是否只禁止新排课；
- 已有未来排课和历史记录如何显示；
- 已被引用的模板能否 DELETE；
- 推荐停用还是物理删除；
- DELETE 冲突时的 HTTP 状态与业务码。

规则冻结前，前端不显示删除按钮。

### 5.7 课程专用错误示例

补充：名称重复、私教容量非法、分类/难度非法、跨租户访问、封面资源非法、被排课引用时删除或修改冲突。字段错误 key 必须对应真实请求字段。

---

# 第二部分：前端 Phase 5 / 功能 06 学员档案

## 6. 当前状态

新版包中 Students 端点仍全部使用：

```text
DraftWriteRequest
DraftSuccessResponse
DraftListSuccessResponse
```

`contracts/status.json` 为 `DRAFT / NOT_STARTED`。候选 `Student` 和 `Membership` Schema 不能代替端点请求/响应冻结。

当前前端已有旧原型，但仍存在字符串 ID、旧会员枚举、扁平会员字段和 PUT 更新等问题。管理员/训练师复用页面的硬编码跳转已由前端独立修正；其余传输字段会在冻结契约后通过适配层修正，不要求后端兼容旧原型。

## 7. 学员端点与具体 Schema

请冻结并绑定：

```text
GET   /api/students/
POST  /api/students/
GET   /api/students/{student_id}/
PATCH /api/students/{student_id}/
GET   /api/students/{student_id}/membership/
PATCH /api/students/{student_id}/membership/
GET   /api/students/{student_id}/eligibility/
```

至少提供：

- `Student`
- `StudentCreateRequest`
- `StudentUpdateRequest`
- `StudentSuccessResponse`
- `StudentListSuccessResponse`
- `Membership`
- `MembershipUpdateRequest`
- `MembershipSuccessResponse`
- `StudentEligibility`
- `StudentEligibilitySuccessResponse`

创建和编辑必须分开定义，PATCH 不得要求前端回传所有未修改字段。

## 8. 学员字段必须确认

### 8.1 身份和归属

- `id`、`user_id`、`company_id`、`store_id`、`trainer_id` 的类型和可空性；
- 创建学员时是同时创建 User，还是必须绑定已有 User；
- `user_id` 由请求提交还是后端根据手机号建立；
- `company_id` 是否由 Token 租户推导；
- `store_id` 是否必填、能否转店；
- `trainer_id` 是否可空、谁可以分配或更换；
- 学员手机号在全局、公司内还是 User 范围唯一。

### 8.2 个人字段

- `name` 长度与空白处理；
- `phone` 的格式和变更规则；
- `gender` 当前候选为必填，但前端原需求允许未填写，请明确可空性；
- `birthday` 可空性、未来日期规则；
- 是否存在头像；如存在必须复用媒体资源协议；
- `goals`、`health_notes` 的最大长度和可空语义；
- `status` 的状态流转和停用影响。

### 8.3 敏感信息

`health_notes` 已标记敏感字段，请明确：

- 哪些角色可以读取和修改；
- 无权限时字段被省略、返回 `null`，还是整个请求 403；
- 学员本人是否可见；
- 是否记录访问与修改审计；
- 前端错误和日志不得回显敏感内容。

如果字段可能省略，响应 Schema 不能仍将其定义为所有角色必填。

## 9. 会员模型与规则

### 9.1 枚举

`MemberCardType` 已有 `count/month/quarter/year/stored`。候选 `Membership.status` 又定义 `active/expired/suspended/exhausted`，请新增唯一事实源 `MembershipStatus`，不要让前端手写。

### 9.2 字段语义

- `expires_on` 对哪类卡必填；永久卡是否允许 `null`；
- `remaining_count` 只对次卡有意义还是所有卡返回；
- `balance` 只对储值卡有意义还是所有卡返回 `0.00`；
- 候选 Schema 把 `balance` 设为必填且不可空，请确认；
- 余额的货币单位、精度和展示规则；
- 到期、次数耗尽、余额不足如何计算最终状态；
- 是否允许管理员手工设置 `expired/exhausted`，还是由后端计算；
- 续卡、充值、扣次是否属于当前 Phase；不属于则明确排除。

### 9.3 资格接口

请定义 `StudentEligibility`：

- 是否允许预约/签到/消费；
- 失败原因使用稳定机器码还是自由文本；
- 到期、次数不足、余额不足、停用、门店不匹配分别如何表达；
- 是否针对具体课程/排课计算，若需要应有哪些请求参数。

前端不会自行根据展示字段推断最终业务资格。

## 10. 学员列表、分页和权限

请冻结列表参数：

- `page/page_size`
- `search` 搜索姓名和手机号的规则
- `status`
- `membership_status` 或等价筛选
- `store_id`
- `trainer_id`
- 排序字段和默认顺序

请逐角色明确可见范围：超级管理员、公司管理员、店长、训练师。尤其要说明训练师看到全公司学员、所属门店学员、自己负责的学员，还是参与过课程的学员。

至少用两个公司、两个门店和两个训练师验证列表与详情的跨租户隔离。

## 11. 学员业务错误

提供稳定错误码和示例：手机号重复、User 已绑定学员、门店/教练不属于公司、学员不存在、跨租户访问、会员字段组合非法、转店/换教练冲突、敏感字段无权限、并发修改冲突。

---

# 第三部分：前端 Phase 5 / 功能 07 身体评估

## 12. 当前状态

Body Assessments 全部端点仍为 DRAFT，使用通用 Draft Schema。候选 `BodyAssessment` 只定义了身高、体重、任意围度对象和任意评分对象，尚不能满足正式评估录入、照片、备注、对比和趋势。

## 13. 身体评估端点与 Schema

请冻结：

```text
GET    /api/body-assessments/
POST   /api/body-assessments/
GET    /api/body-assessments/{assessment_id}/
PATCH  /api/body-assessments/{assessment_id}/
DELETE /api/body-assessments/{assessment_id}/
GET    /api/students/{student_id}/body-assessment-trend/
```

提供：

- `BodyAssessment`
- `BodyAssessmentCreateRequest`
- `BodyAssessmentUpdateRequest`
- `BodyAssessmentSuccessResponse`
- `BodyAssessmentListSuccessResponse`
- `BodyAssessmentTrendPoint`
- `BodyAssessmentTrendSuccessResponse`

列表必须明确 `student_id`、分页和日期排序参数。趋势接口必须明确指标选择和时间范围。

## 14. 测量字段与单位

逐字段明确类型、单位、范围、精度和可空性：

- 测量日期：使用日期还是含时区的 date-time；
- 身高：厘米；
- 体重：千克；
- 体脂率：百分比；
- BMI：后端计算还是前端计算，只能有一个权威来源；
- 围度：胸、腰、臀、上臂、大腿、小腿等支持哪些固定 key；
- 体态或能力评分：允许哪些固定 key，0～100 的含义；
- 备注：可空性和最大长度；
- 评估人 `assessor_id` 是否需要；
- 创建和更新时间是否需要。

不建议将正式业务字段长期定义为无约束的 `additionalProperties`。如果需要扩展字典，应给出允许 key 的枚举、单位和展示名称事实源。

缺失指标必须返回 `null` 或省略，不能返回 0 代替缺失。趋势数据不能把缺失值补成 0。

## 15. 体态照片与媒体

请明确：

- 支持正面、侧面、背面还是任意照片；
- 请求提交媒体资源 ID，不提交客户端拼接 URL；
- 响应返回媒体 ID、类型、只读 URL 和必要元数据；
- 文件类型、大小、数量和分辨率限制；
- 删除或替换评估时媒体如何处理；
- 上传成功但评估保存失败时如何回收孤立资源；
- 谁可以查看敏感身体照片；
- URL 是否需要签名和过期时间；
- 学员本人是否可见、是否允许下载。

媒体协议未冻结前，前端只保留上传插槽，不实现假上传。

## 16. 对比与趋势

请冻结：

- 历史记录默认倒序；
- 是否允许选择任意两次记录比较；
- 差值由后端返回还是前端根据统一单位计算；
- 趋势支持哪些指标；
- 只有一条记录时不得返回或展示误导趋势；
- 相同日期多条记录的排序规则；
- 指标缺失时趋势点如何表达；
- 时区和日期边界。

## 17. 评估权限、删除和审计

逐角色明确查看、创建、修改和删除权限。至少确认：

- 店长是否能查看身体数据；
- 训练师只能访问负责学员还是所属门店全部学员；
- 学员本人是否只读；
- 跨租户返回 403 还是 404；
- 评估是否允许物理删除；
- 修改和删除是否保留审计记录；
- 医疗或健康敏感信息的日志、导出和截图限制。

## 18. 身体评估错误码和示例

补充：学员不存在、跨租户访问、测量范围非法、未来测量时间、非法指标 key、媒体资源非法、无权查看照片、记录被引用或并发修改冲突。

---

# 第四部分：后端一次性交付清单

## 19. 契约文件

- [ ] 正式仓库包含新版 Phase 4 课程模板契约
- [ ] 正式仓库包含 Phase 5 学员专用 Schema 和端点绑定
- [ ] 正式仓库包含 Phase 5 身体评估专用 Schema 和端点绑定
- [ ] `CourseDifficulty` 和 `MembershipStatus` 进入 `enums.json`
- [ ] 封面和评估照片使用统一媒体资源协议或明确延期
- [ ] OpenAPI 从源文件重新 bundle
- [ ] 示例覆盖正常、校验、权限、不存在和冲突
- [ ] `CHANGELOG.md` 和 `status.json` 更新
- [ ] 三项契约校验全部通过

## 20. 后端实现证据

- [ ] 后端提交号
- [ ] 数据库迁移从空库通过
- [ ] 五角色测试账号
- [ ] 两公司、两门店、多个训练师和学员测试数据
- [ ] 正常 CRUD/查询测试
- [ ] 角色权限与跨租户隔离测试
- [ ] 会员资格和边界规则测试
- [ ] 身体敏感数据和媒体权限测试
- [ ] 可联调基地址和启动方法

## 21. 请按此格式回复

```markdown
### Phase 4–5 契约与后端交付

- 契约提交号：
- 后端提交号：
- 契约版本：
- Course Templates：CONTRACT_READY / API_READY / 其他
- Students：CONTRACT_READY / API_READY / 其他
- Body Assessments：CONTRACT_READY / API_READY / 其他
- 已补枚举：
- 媒体资源策略：
- 全局课程模板策略：
- 学员与 User 建立方式：
- 训练师学员可见范围：
- 会员资格规则：
- 身体评估单位和可空性：
- 敏感数据权限：
- 删除与历史保留策略：
- 契约校验结果：
- 后端测试结果：
- 联调地址：
- 测试账号与租户数据：
- 尚未完成：
```

## 22. 前端收到正式交付后的处理

前端将按以下顺序执行：

1. 拉取正式契约提交；
2. 运行契约生成，禁止手改 `src/generated/**`；
3. 先完成课程模板领域模型、适配器、Schema 和契约 Mock；
4. 再完成学员档案领域模型、适配器、会员状态和契约 Mock；
5. 再完成身体评估、单位 Mapper、媒体插槽、对比和趋势；
6. 页面和组件只使用前端领域模型；
7. 运行 `check:all`；
8. 对 API_READY 端点执行真实接口、角色、租户和错误联调；
9. 只有全部证据通过才提升为 `INTEGRATED/VERIFIED`。

在此之前，现有课程、学员和身体评估页面只能视为 UI 原型，不能声明 Phase 4 或 Phase 5 已完成真实接入。
