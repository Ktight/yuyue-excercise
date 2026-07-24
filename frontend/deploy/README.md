# 部署说明

## 同域部署

推荐 Web 与后端同域，前端保持 `VITE_API_BASE_URL=/api`。外层网关将 `/api/` 转发到 Django，将其他路径转发到前端容器。

## 构建

```powershell
docker build -t yuyuelian-frontend .
docker run --rm -p 8080:80 yuyuelian-frontend
Invoke-WebRequest http://127.0.0.1:8080/healthz
```

## 发布前条件

- 生产环境 `VITE_ENABLE_MOCK=false`；
- TLS、CSP、监控和错误采集由正式部署方案补齐；
- `/api` 不得被 Service Worker 缓存；
- 原生应用若使用不同 API 域名，必须配置 HTTPS、CORS 与移动端网络安全策略。
