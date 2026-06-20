# Lumen Admin 通用后台模板优化设计

## 目标

把 Lumen 从“基础后台脚手架”打磨成可复用、可展示的通用中后台模板。它应当能作为 CRM、运营后台、内容管理、内部工具的起始项目，也能放进简历证明中后台业务前端与轻量全栈能力。

## 定位

主线是中后台业务前端：列表、筛选、表单、弹窗、状态展示、分页、异常提示、响应式后台布局。

辅助展示全栈闭环：Next.js server actions、better-auth、Drizzle、SQLite、审计日志、CSV 导出、CI 检查。

## 功能范围

保留现有登录认证、受保护路由、Dashboard、Sidebar、Settings、主题切换、Drizzle + SQLite、CI 检查。

把模板感较重的 Items 替换为 Leads 线索管理模块：

- 字段：id、company、contactName、contactEmail、status、priority、owner、notes、createdAt、updatedAt。
- 状态：New、Contacted、Qualified、Won、Lost。
- 优先级：Low、Medium、High。
- 能力：服务端分页、关键词搜索、状态筛选、优先级筛选、新增、编辑、删除、CSV 导出。

新增 Audit Logs 审计日志模块：

- 字段：id、action、resource、resourceId、summary、createdAt。
- 记录线索新增、编辑、删除。
- 页面展示最近操作列表。

新增简单角色字段：

- 在用户表保留 role 字段，用于展示模板扩展能力。
- 本次不实现复杂 RBAC，不按角色控制菜单或按钮。

Dashboard 调整为模板展示页：

- 统计总线索、跟进中线索、高优先级线索、已成交线索。
- 展示最近线索和最近审计日志。

README 和简历文案调整：

- README 说明模板用途、技术栈、启动方式、可复用模块。
- 补一段可直接写入简历的项目描述。

## 不做

- 不做多租户。
- 不做复杂权限系统。
- 不做导入功能，先只做 CSV 导出。
- 不接邮件、短信、第三方 CRM。
- 不引入图表库。
- 不做拖拽工作流。

## 数据与边界

服务端查询继续放在 `src/lib/*`，数据库 schema 放在 `src/db/schema.ts`，server actions 放在对应路由目录。客户端组件只负责交互展示，不直接访问数据库。

写操作统一经过 server actions：校验 session、用 zod 校验输入、写业务表、写 audit log、revalidate 相关页面。

## 验收

- 登录后默认进入收起侧边栏的后台。
- Dashboard、Leads、Audit Logs、Settings 可访问。
- Leads 支持搜索、状态筛选、优先级筛选、分页、新增、编辑、删除、CSV 导出。
- 新增、编辑、删除线索后 Audit Logs 有记录。
- `bun run typecheck` 和 `bun run lint` 通过。
- README 能清楚说明这是一个可复用中后台模板。
