# 瑜悦练前端

Vue 3、TypeScript、Vite 的多角色瑜伽馆管理与学员自助前端。

## 本地开发

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Mock 演示时将 `.env.local` 的 `VITE_ENABLE_MOCK` 改为 `true`。生产构建禁止启用 Mock。

## 质量门禁

```powershell
npm run check:all
npm run test:e2e
```

`check:all` 包含契约类型生成、TypeScript、ESLint、Prettier、模块边界、Vitest、生产构建和包体预算。

## 架构边界

- 页面只使用 `features/*/model` 中的前端领域模型。
- 后端 URL、包装响应、snake_case 和 ID 语义集中在 `src/backend-adapters/`。
- Mock 只位于 `features/*/mocks/`，不进入 Vue 页面。
- 后端更新后优先只修改适配器、生成类型、Mock 和对应适配器测试。
- 完整替换位置见 `FRONTEND_BACKEND_REPLACEMENT_MATRIX.md`。

## Web 部署

```powershell
docker build -t yuyuelian-frontend .
docker run --rm -p 8080:80 yuyuelian-frontend
```

容器内 Nginx 已配置 SPA 回退、静态资源长期缓存、安全响应头和 `/healthz`。

## Android / iOS

```powershell
npm run native:sync
npm run native:android
npm run native:ios
```

- Android 最终构建要求安装 Android Studio/SDK，并配置 `ANDROID_HOME` 或 `android/local.properties`。
- iOS 最终构建和签名必须在 macOS/Xcode 执行。
- 每次前端构建后运行 `npm run native:sync`，不要直接修改原生工程中的 `public/` 构建副本。
