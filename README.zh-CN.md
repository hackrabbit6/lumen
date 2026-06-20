# Lumen Admin

一个可复用的通用中后台模板，适合快速启动 CRM、运营后台、内容管理、内部工具和 SaaS 管理端。项目基于 **Next.js 16 / React 19 / TypeScript**，集成登录认证、受保护后台、线索管理、审计日志、CSV 导出、SQLite 持久化和 CI 检查。

![Dashboard](public/screenshots/dashboard.png)

## 页面预览

![Leads](public/screenshots/leads.png)

![Audit Logs](public/screenshots/audit-logs.png)

## 功能

- **登录认证**：better-auth 邮箱密码登录/注册，路由中间件 + 服务端 layout 双层守卫。
- **线索管理 Leads**：服务端分页、关键词搜索、状态筛选、优先级筛选、新增、编辑、删除。
- **CSV 导出**：按当前搜索和筛选条件导出线索数据。
- **审计日志 Audit Logs**：记录线索新增、编辑、删除，Dashboard 展示最近操作。
- **Dashboard**：统计总线索、跟进中、高优先级、已成交，并展示最近线索和最近日志。
- **后台外壳**：可折叠侧边栏、移动端抽屉、用户卡片、登出。
- **主题切换**：明暗主题，无首屏闪烁。
- **工程检查**：lint、typecheck、format、build，可接入 GitHub Actions。

## 技术栈

- Next.js 16 App Router / React 19 / TypeScript
- Tailwind CSS v4 / shadcn/ui / Lucide React
- better-auth
- Drizzle ORM / SQLite / better-sqlite3
- Zod
- Bun

## 快速开始

```bash
bun install
cp .env.example .env
bun run db:migrate
bun run db:seed
bun run dev
```

打开 `http://localhost:3000`。可以在登录页注册新账号，也可以使用开发账号：

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
bun run db:migrate
bun run db:seed
```

## 目录

```text
src/app/(dashboard)/page.tsx          Dashboard
src/app/(dashboard)/leads/            Leads 管理页 + server actions
src/app/(dashboard)/audit-logs/       审计日志页
src/app/api/leads/export/route.ts     CSV 导出
src/components/LeadFormModal.tsx      线索新增/编辑弹窗
src/components/Sidebar.tsx            后台导航
src/db/schema.ts                      数据表
src/lib/leads.ts                      Leads 数据访问
src/lib/audit-logs.ts                 审计日志数据访问
src/lib/data/leads.ts                 Leads 类型与 zod 校验
```

## 数据模型

`leads`：

- `id`
- `company`
- `contactName`
- `contactEmail`
- `status`: `New | Contacted | Qualified | Won | Lost`
- `priority`: `Low | Medium | High`
- `owner`
- `notes`
- `createdAt`
- `updatedAt`

`audit_logs`：

- `id`
- `action`: `create | update | delete`
- `resource`
- `resourceId`
- `summary`
- `createdAt`

## 复用方式

新增一个业务资源时，照 `leads` 复制一套即可：

1. 在 `src/db/schema.ts` 加表。
2. 在 `src/lib/data/<resource>.ts` 写 zod schema 和类型。
3. 在 `src/lib/<resource>.ts` 写服务端数据访问。
4. 在 `src/app/(dashboard)/<resource>/actions.ts` 写 server actions。
5. 写一个服务端 page 负责读取查询参数，一个客户端组件负责交互。
6. 在 `Sidebar` 增加导航。

## 简历描述

```text
Lumen Admin 通用中后台模板
技术栈：Next.js、React、TypeScript、Tailwind CSS、shadcn/ui、better-auth、Drizzle、SQLite

- 独立开发可复用中后台模板，集成登录认证、受保护路由、响应式后台布局、明暗主题和用户登出流程。
- 实现 Leads 线索管理模块，支持服务端分页、关键词搜索、状态/优先级筛选、新增、编辑、删除和 CSV 导出。
- 使用 Drizzle + SQLite 设计线索与审计日志表，结合 server actions 与 zod 完成服务端校验、写入、日志记录和页面刷新。
- 配置 lint、类型检查、格式检查和生产构建流程，可作为 CRM、运营后台、内部工具等项目的起始模板。
```

## 60 秒面试讲法

```text
Lumen 是我做的一个通用中后台模板，用来沉淀 CRM、运营后台、内部工具这类项目的基础能力。

技术上用了 Next.js、React、TypeScript、better-auth、Drizzle 和 SQLite。功能上包括登录认证、受保护路由、线索管理、服务端分页筛选、CSV 导出和审计日志。

我重点想展示的是业务前端交付能力：表格、筛选、弹窗表单、状态展示、异常校验、响应式后台布局，以及和服务端数据写入的完整闭环。
```

## 备注

`better-sqlite3` 是 Node 原生模块，独立数据库脚本使用 Node 执行；Next 服务端代码同样运行在 Node 环境。SQLite 文件适合本地模板、演示和长驻容器/VM，部署到 serverless 前需要确认文件持久化方案。
