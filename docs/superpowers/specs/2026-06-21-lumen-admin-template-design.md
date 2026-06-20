# Lumen Admin 前后端分离模板设计

## 目标

把 Lumen 定位为可复用的中后台前端模板，而不是绑定 SQLite、Drizzle 或某个认证方案的全栈 demo。项目默认用 mock 数据跑通展示，后续通过 `src/lib/api/*` 接入独立后端，例如 Elysia。

## 范围

保留：

- Dashboard、Leads、Audit Logs、Settings。
- demo 登录态和路由守卫。
- 列表、筛选、分页、弹窗表单、状态展示、CSV 导出。
- 明暗主题、可折叠侧边栏、响应式布局。
- README 截图、简历描述、面试讲法。

移除：

- SQLite、Drizzle、better-auth。
- server actions 和数据库迁移。
- 绑定长驻服务/持久磁盘的部署说明。

## API 边界

前端只依赖 `src/lib/api/*`：

- `client.ts`：未来真实 fetch 封装。
- `leads.ts`：当前 mock 数据处理；未来替换为 REST 调用。
- `audit-logs.ts`：审计日志类型与 helper。
- `mock-data.ts`：演示数据。

建议后端接口：

```text
POST   /auth/login
POST   /auth/logout
GET    /me
GET    /leads
POST   /leads
PATCH  /leads/:id
DELETE /leads/:id
GET    /audit-logs
```

## 验收

- 项目不包含数据库依赖。
- `bun run dev` 能直接预览 demo。
- `bun run build` 能在纯前端部署平台通过。
- README 明确说明这是前后端分离模板。
