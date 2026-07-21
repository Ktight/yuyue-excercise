# 瑜悦练 API 契约

前端唯一消费入口是 `openapi.yaml`，API 基地址为
`http://localhost:8000/api/`。前端可用 `VITE_API_BASE` 覆盖该地址。

所有成功响应固定为 `{code, message, data}`，分页数据固定为
`{items, page, page_size, total}`，错误固定为
`{code, message, errors, request_id}`。认证使用 Bearer JWT，字段名为
`access_token` 和 `refresh_token`。

`src/` 是模块化事实来源，`openapi.yaml` 是构建产物。运行：

```powershell
python contracts/scripts/bundle_openapi.py
python contracts/scripts/validate_contracts.py
```

模块成熟度见 `status.json`。DRAFT/NOT_STARTED 接口仅用于设计与 Mock，不能用于真实联调。

## 前端 Step 1.7 对接约定

- `VITE_API_BASE` 未配置时使用 `http://localhost:8000/api/`。
- axios 的成功分支读取 `response.data.data`；如需错误码，保留完整响应体。
- 401 的响应体仍为统一错误格式，前端清理本地 Token 后跳转登录。
- 500 使用 `INTERNAL_ERROR`（当前实现兼容期仍可能返回 `SERVER_ERROR`，冻结前将统一）。
- 列表只读取 `data.items/page/page_size/total`，不依赖 DRF 原生分页字段。

## 尚待业务确认/后续实现

- `Gender` 是否增加 `other/unknown`。
- 候选枚举（提醒、会员、难度、排课、预约、媒体、计划、反馈、报告）尚未写入
  `enums.json`；对应 DRAFT Schema 中的值仅为设计候选。
- 周期排课重复规则、批量操作全回滚策略、取消时限、上传限制、报告快照和分享期限待冻结。
- Company/Store 模型在 Phase 3 建立前，用户接口只能校验角色与 `store_id` 的空值规则，
  尚不能验证门店存在性及跨公司归属，因此 users 模块不得标记 API_READY。
- logout、管理员重置密码、health/version 及 Phase 3～13 接口均尚未实现。
