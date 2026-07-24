# 功能 20：测试、打包与部署交付

更新日期：2026-07-24

## 已完成

- 完整 `check:all`：契约生成、类型、Lint、格式、边界、单测、构建、包体预算；
- Playwright 五角色登录、角色壳、越权、Phase 11、学员首页/历史/计划/档案、反馈/报告、移动响应式测试；
- 五角色全部主导航页面、三类手机布局、越权路径、控制台错误、横向溢出和操作名称审计；
- PWA manifest、品牌图标、生产 Service Worker；
- Docker 多阶段构建与 Nginx SPA 配置；
- Nginx `/healthz`、静态缓存和基础安全响应头；
- `.env.example` 与生产禁用 Mock 保护；
- Capacitor 8 Android/iOS 工程与同步脚本；
- Android/iOS Web 资源同步成功。

## 环境验证状态

| 项目 | 状态 | 说明 |
|---|---|---|
| Web 生产构建 | VERIFIED | `npm run build:verified` 通过 |
| 包体预算 | VERIFIED | 单块不超过 400 KiB，总 JS 不超过 1.2 MiB |
| Playwright | VERIFIED | 25 项本地 Mock 浏览器流程通过 |
| Capacitor sync | VERIFIED | Android/iOS 工程生成并同步成功 |
| Android APK | ENV_BLOCKED | 当前电脑未安装/配置 Android SDK；需 `ANDROID_HOME` 或 `sdk.dir` |
| iOS Archive | ENV_BLOCKED | 必须在 macOS/Xcode 完成签名构建 |
| Docker image | PENDING_ENV_VERIFY | 配置已完成；需本机 Docker Engine 执行构建 |

## 最新验证证据

- `check:all`：生成、类型、Lint、Prettier、452 个源文件边界、57 个测试文件共 165 项单测、生产构建及包体预算全部通过；
- 生产构建：890 个模块，最大 JS 分块 320.7 KiB，总 JS 775.4 KiB；
- Playwright：25/25 通过；
- 五角色导航审计：59 个桌面入口、22 个手机入口和 14 个越权路径通过；
- 内置浏览器人工检查：学员聚合首页和训练历史无横向溢出、无页面警告或控制台错误；
- `cap sync`：最新 Web 资源已同步到 Android/iOS。

## 非前端阻塞

- 真实 API 多角色与双租户联调；
- Android SDK、应用签名、商店账号与隐私材料；
- macOS/Xcode、Apple 签名与 App Store Connect；
- 生产域名、TLS、反向代理 `/api`、监控与发布权限。
