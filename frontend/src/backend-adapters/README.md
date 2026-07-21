# 后端适配层

这里是前端唯一允许理解后端传输格式的目录。

## 维护规则

- 接口路径、请求方法、snake_case 字段、响应包裹和 OpenAPI 生成类型只放在对应适配器中。
- 页面、组件和 Store 只使用 `features/*/model` 中的前端领域模型。
- 后端发生兼容性变化时，先重新生成 `src/generated`，然后只检查对应的 `*.adapter.ts`。
- 不在页面、组件或 Store 中猜测后端字段，也不直接导入 `src/generated/api-types.ts`。
- 一个业务域对应一个适配文件，并从本目录 `index.ts` 统一导出。

## 当前索引

- `auth.adapter.ts`：登录、刷新令牌、当前用户、修改密码。
- `users.adapter.ts`：用户列表和创建用户。

`features/*/api` 目前仅保留兼容导出，不包含任何后端转换逻辑，后续功能可直接通过本层接入。
