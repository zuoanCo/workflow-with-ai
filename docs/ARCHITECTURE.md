# Workflow AI 技术方案 v0.1

## 总体架构

当前版本先交付 Web 端产品壳与核心交互，后续按以下模块演进为完整生产系统：

- Frontend：React + TypeScript + Vite，负责 Web 工作台、画布和运营后台。
- API：BFF 层，统一账户、项目、成果、工作流和监控接口。
- Auth：组织租户、RBAC、项目授权、审计日志。
- Workflow Engine：DAG 编排、节点执行、重试、人工审核、幂等。
- AI Provider Adapter：OpenAI、Seedance、Kling、LibTV 类渠道等统一适配。
- Asset Store：素材、成果、版本、缩略图、元数据。
- Observability：任务成本、耗时、成功率、队列、风险命中。

## 领域模型

- Organization：组织、计费、密钥范围。
- User：账号、成员状态、认证方式。
- Role：权限集合。
- Project：项目空间，隔离素材和工作流。
- Workflow：节点图、运行配置、版本。
- WorkflowRun：一次执行记录，含输入、状态、耗时、成本。
- Asset：图片、视频、文本、参考素材。
- Deliverable：最终成果，含渠道、审核状态、版本和质量分。
- AuditLog：关键操作记录。

## 扩展点

- Provider Adapter：每个 AI 模型实现统一的 `generateText`、`generateImage`、`generateVideo` 接口。
- Workflow Node：节点类型可插拔，如 Prompt、ImageBatch、VideoRender、ReviewGate、PublishPack。
- Channel Adapter：抖音、小红书、公众号、Web、下载包分别独立适配。
- Packaging Adapter：Web、PWA、Desktop、Mobile 使用相同业务 API。

## 技术选型建议

- Web：React + TypeScript + Vite。
- Canvas：`@xyflow/react`，后续承载节点编辑和运行态可视化。
- Backend：NestJS 或 Hono，建议从 Hono + PostgreSQL + Drizzle 起步，轻量可控。
- Queue：BullMQ + Redis，处理生图/生视频长任务。
- Storage：S3 兼容对象存储。
- Auth：Clerk/Auth.js 或自建 JWT + Session，生产建议支持 SSO。
- Desktop：Tauri 优先，Electron 作为兼容备选。
- Mobile：PWA 先行，成熟后接 Capacitor。

## 安全原则

- 模型 API Key 只保存在服务端密钥库。
- 前端只拿短期任务令牌。
- 发布、删除、密钥读取必须走高权限角色和审计。
- 成果审核状态必须由 Reviewer 或 Owner 变更。
