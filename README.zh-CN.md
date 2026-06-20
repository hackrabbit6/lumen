# Lumen Admin

一个前后端分离的通用中后台前端模板，适合快速启动 CRM、运营后台、内容管理、内部工具和 SaaS 管理端。项目基于 **Next.js 16 / React 19 / TypeScript**，默认使用本地 mock 数据演示，后续可以接入独立后端，例如 Elysia / Node / Go / Java API。

![Dashboard](public/screenshots/dashboard.png)

## 页面预览

![Leads](public/screenshots/leads.png)

![Audit Logs](public/screenshots/audit-logs.png)

## 功能

- **Demo 登录态**：本地 cookie + localStorage，方便前端模板直接预览和部署。
- **路由守卫**：未登录访问后台会跳转到 `/login`。
- **线索管理 Leads**：分页、关键词搜索、状态筛选、优先级筛选、新增、编辑、删除。
- **CSV 导出**：按当前筛选结果在浏览器端导出线索数据。
- **审计日志 Audit Logs**：展示操作日志列表，为后端审计接口预留 UI。
- **Dashboard**：统计总线索、跟进中、高优先级、已成交，并展示最近线索和最近日志。
- **后台外壳**：可折叠侧边栏、移动端抽屉、用户卡片、登出。
- **主题切换**：明暗主题，无首屏闪烁。
- **工程检查**：lint、typecheck、format、build，可接入 GitHub Actions。

## 技术栈

- Next.js 16 App Router / React 19 / TypeScript
- Tailwind CSS v4 / shadcn/ui / Lucide React
- Zod
- Bun

## 快速开始

```bash
bun install
cp .env.example .env
bun run dev
```

打开 `http://localhost:3000`。Demo 登录页已预填：

```text
admin@lumen.app
password123
```

## 常用命令

```bash
bun run dev
bun run lint
bun run typecheck
bun run format:check
bun run build
```

## 后端接入

当前模板默认使用 mock 数据。后续接 Elysia 后端时，把接口封装放进 `src/lib/api/`，例如：

```text
src/lib/api/client.ts      fetch 基础封装
src/lib/api/leads.ts       Leads 查询、创建、更新、删除
src/lib/api/audit-logs.ts  审计日志查询
```

`.env.example` 里预留了：

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8787
```

推荐后端接口形态：

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

## 部署

这是纯前端模板，可以直接部署到 Vercel、Netlify 或 Cloudflare Pages。默认 mock 模式不需要数据库。

后续接真实后端时，只需要配置：

```text
NEXT_PUBLIC_API_BASE_URL=https://your-api.example.com
```

## 目录

```text
src/app/(dashboard)/page.tsx          Dashboard
src/app/(dashboard)/leads/            Leads 管理页
src/app/(dashboard)/audit-logs/       审计日志页
src/components/LeadFormModal.tsx      线索新增/编辑弹窗
src/components/Sidebar.tsx            后台导航
src/lib/api/                          API client / mock data / CSV helpers
src/lib/data/leads.ts                 Leads 类型与 zod 校验
```

## 复用方式

新增一个业务资源时，照 `leads` 复制一套即可：

1. 在 `src/lib/data/<resource>.ts` 写 zod schema 和类型。
2. 在 `src/lib/api/<resource>.ts` 写 mock 数据处理或真实 fetch 调用。
3. 在 `src/app/(dashboard)/<resource>/` 写页面和客户端交互。
4. 在 `Sidebar` 增加导航。

## 简历描述

```text
Lumen Admin 前后端分离中后台模板
技术栈：Next.js、React、TypeScript、Tailwind CSS、shadcn/ui、Zod

- 独立开发可复用中后台前端模板，集成 demo 登录态、路由守卫、响应式后台布局、明暗主题和用户登出流程。
- 实现 Leads 线索管理模块，支持分页、关键词搜索、状态/优先级筛选、新增、编辑、删除和 CSV 导出。
- 抽离 API client 与 mock 数据层，为后续接入 Elysia / REST 后端预留清晰边界，前端不绑定具体后端技术栈。
- 配置 lint、类型检查、格式检查和生产构建流程，可作为 CRM、运营后台、内部工具等项目的前端起始模板。
```

## 60 秒面试讲法

```text
Lumen 是我做的一个前后端分离中后台模板，用来沉淀 CRM、运营后台、内部工具这类项目的前端基础能力。

技术上用了 Next.js、React、TypeScript、Tailwind 和 Zod。现在默认使用 mock 数据，所以可以直接部署预览；后续只要替换 API client，就能接 Elysia 或其它 REST 后端。

我重点想展示的是业务前端交付能力：表格、筛选、弹窗表单、状态展示、异常校验、响应式后台布局、CSV 导出，以及清晰的前后端边界。
```
