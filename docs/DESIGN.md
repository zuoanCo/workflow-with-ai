# Workflow AI 设计方案 v1.0

状态：阶段二设计文档。  
依据：PRD v1.0 已通过需求阶段审批。  
目标：在正式开发前，明确架构、数据模型、API、AI Provider、工作流引擎、多端打包和 UI 信息架构。

## 1. 总体架构

```text
Client Apps
  Web Console
  PWA / Mobile Shell
  Desktop Shell
        |
        v
BFF API Gateway
        |
        +-- Auth & RBAC Service
        +-- Project Service
        +-- Workflow Service
        +-- Asset Service
        +-- Deliverable Service
        +-- Observability Service
        |
        v
Execution Layer
  Workflow Engine
  Queue Workers
  AI Provider Adapters
  Channel Packaging Adapters
        |
        v
Infrastructure
  PostgreSQL
  Redis Queue
  Object Storage
  Audit Log
```

## 2. 技术选型

| 层级 | 选型 | 原因 |
| --- | --- | --- |
| Web | React + TypeScript + Vite | 当前仓库已初始化，适合快速开发后台工作台 |
| 画布 | @xyflow/react | 成熟 DAG/节点画布能力，适合工作流编排 |
| API | Hono 或 NestJS | Hono 更轻量，NestJS 更强规范；MVP 推荐 Hono，复杂企业版可升级 NestJS |
| ORM | Drizzle + PostgreSQL | 类型安全、迁移清晰、适合结构化业务数据 |
| 队列 | Redis + BullMQ | 适合生图、生视频长任务、重试和状态追踪 |
| 存储 | S3 兼容对象存储 | 存放图片、视频、参考素材和交付包 |
| 测试 | Vitest + Testing Library + Playwright | 覆盖单元、组件和关键 E2E 流程 |

## 3. 模块边界

| 模块 | 职责 | 不负责 |
| --- | --- | --- |
| Auth/RBAC | 组织、成员、角色、权限、审计 | 模型调用 |
| Project | 项目空间、成员项目权限、项目配置 | 成果文件存储 |
| Workflow | DAG 定义、运行记录、节点状态、重试 | 外部模型细节 |
| AI Provider | 文本、图片、视频模型统一适配 | 业务权限判断 |
| Asset | 素材、文件、版本、元数据 | 审核决策 |
| Deliverable | 成果状态、审核、返修、渠道打包记录 | 原始模型执行 |
| Observability | 成本、耗时、成功率、风险、队列 | 修改业务状态 |

## 4. 数据模型

### 4.1 核心表

| 表 | 关键字段 |
| --- | --- |
| organizations | id, name, plan, created_at |
| users | id, email, name, status, created_at |
| memberships | id, org_id, user_id, role_id, status |
| roles | id, org_id, name, scope |
| permissions | id, key, description |
| role_permissions | role_id, permission_id |
| projects | id, org_id, name, owner_id, status |
| workflows | id, project_id, name, version, graph_json, status |
| workflow_runs | id, workflow_id, trigger_user_id, status, cost, started_at, ended_at |
| workflow_node_runs | id, run_id, node_id, type, status, input_json, output_json, error |
| assets | id, project_id, type, uri, metadata_json, created_by |
| deliverables | id, project_id, asset_id, channel, status, quality_score, version |
| audit_logs | id, org_id, actor_id, action, target_type, target_id, metadata_json |
| provider_keys | id, org_id, provider, encrypted_secret_ref, status |

### 4.2 状态枚举

| 对象 | 状态 |
| --- | --- |
| workflow_runs | pending, running, waiting_review, succeeded, failed, canceled |
| deliverables | draft, generated, review_pending, approved, rejected, rework_required, packaged |
| assets | active, archived, deleted |
| memberships | invited, active, disabled |

## 5. API 设计

### 5.1 账户与权限

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | /api/me | 当前用户、组织和权限 |
| GET | /api/orgs/:orgId/members | 成员列表 |
| POST | /api/orgs/:orgId/members | 邀请成员 |
| PATCH | /api/orgs/:orgId/members/:memberId | 修改角色或状态 |
| GET | /api/orgs/:orgId/audit-logs | 审计日志 |

### 5.2 工作流

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | /api/projects/:projectId/workflows | 工作流列表 |
| POST | /api/projects/:projectId/workflows | 创建工作流 |
| PATCH | /api/workflows/:workflowId | 更新工作流图 |
| POST | /api/workflows/:workflowId/runs | 触发运行 |
| GET | /api/workflow-runs/:runId | 查询运行状态 |
| POST | /api/workflow-runs/:runId/retry | 重试失败节点 |

### 5.3 AI 能力

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | /api/ai/chat | 对话生成 |
| POST | /api/ai/images | 生图任务 |
| POST | /api/ai/videos | 生视频任务 |
| GET | /api/ai/tasks/:taskId | 查询模型任务状态 |

### 5.4 成果与监控

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | /api/projects/:projectId/deliverables | 成果列表 |
| PATCH | /api/deliverables/:id/review | 审核通过、拒绝或返修 |
| POST | /api/deliverables/:id/package | 生成渠道交付包 |
| GET | /api/orgs/:orgId/metrics | 组织监控指标 |

## 6. AI Provider Adapter

统一接口：

```ts
type ProviderTask<TInput, TOutput> = {
  orgId: string
  projectId: string
  userId: string
  input: TInput
  idempotencyKey: string
}

type AIProviderAdapter = {
  generateText(task: ProviderTask<TextInput, TextOutput>): Promise<TextOutput>
  generateImage(task: ProviderTask<ImageInput, ImageOutput>): Promise<ImageOutput>
  generateVideo(task: ProviderTask<VideoInput, VideoOutput>): Promise<VideoOutput>
}
```

设计原则：

- 每个 Provider 独立适配，禁止业务代码直接调用第三方 SDK。
- 所有长任务必须写入 `workflow_node_runs`，支持查询、重试和补偿。
- 成本、耗时、模型、输入摘要和输出 URI 必须记录到监控数据。
- 密钥通过服务端密钥引用读取，禁止出现在前端。

## 7. 工作流引擎

### 7.1 节点类型

| 节点 | 说明 |
| --- | --- |
| BriefInput | 输入创作 Brief |
| PromptTemplate | 应用提示词模板 |
| ChatGenerate | AI 对话生成脚本、分镜或策略 |
| ImageGenerate | AI 生图 |
| VideoGenerate | AI 生视频 |
| ReviewGate | 人工审核卡点 |
| AssetTransform | 裁剪、转码、压缩、元数据处理 |
| PackageChannel | 渠道打包 |

### 7.2 执行规则

- DAG 拓扑排序执行。
- 节点输入来自上游输出和项目上下文。
- 每个节点运行必须有幂等键。
- 失败节点可单独重试。
- ReviewGate 阻塞后续节点，直到审核通过。
- 运行记录必须可追踪成本、耗时和失败原因。

## 8. 多端打包

| 目标 | 策略 |
| --- | --- |
| Web | 第一交付端，作为完整后台工作台 |
| PWA | 复用 Web，支持移动端查看、审核和轻量操作 |
| Desktop | Tauri 壳层，复用 Web 与 API，增强本地文件能力 |
| Mobile | 后续用 Capacitor 包装 PWA 能力 |
| API Worker | 独立后台任务服务，负责队列、模型和渠道适配 |

## 9. UI 信息架构

主导航：

- 总览：指标、风险、队列、最近成果。
- 创作：AI 对话、生图、生视频统一入口。
- 画布：工作流编排、节点运行态、人工审核卡点。
- 成果：成果库、版本、渠道、审核、返修。
- 权限：组织、成员、角色、项目授权。
- 监控：成本、耗时、成功率、风险命中。
- 打包：Web、公众号、短视频、小红书、下载包。
- 安全：密钥、审计日志、异常访问。

关键页面：

| 页面 | 关键组件 |
| --- | --- |
| Dashboard | 指标卡、队列列表、风险提示、最近成果 |
| Creation Studio | 模式切换、Prompt 输入、模板库、模型参数、生成历史 |
| Workflow Canvas | 节点面板、画布、运行日志、节点详情、审核卡点 |
| Deliverables | 成果表、状态筛选、版本抽屉、审核面板、渠道打包 |
| Access Control | 成员表、角色矩阵、项目权限、审计日志 |
| Observability | 成本趋势、任务耗时、Provider 成功率、错误分布 |

UI 原则：

- 后台式高密度布局，优先提高工作效率。
- 卡片只用于指标、重复项和局部面板，不做装饰性堆叠。
- 使用清晰状态色：成功、运行中、待审核、返修、风险。
- 按角色隐藏不可用功能，避免只禁用不解释。
- 移动端优先支持查看、审核和状态确认，不承担复杂画布编辑。

## 10. 设计自审

| 检查项 | 结论 |
| --- | --- |
| 是否覆盖 PRD P0 模块 | 通过 |
| 是否明确数据模型 | 通过 |
| 是否明确 API 边界 | 通过 |
| 是否隔离 AI Provider | 通过 |
| 是否支持长任务队列和重试 | 通过 |
| 是否支持权限和审计 | 通过 |
| 是否支持多端扩展 | 通过 |
| 是否符合后台式 UI 定位 | 通过 |

## 11. 设计确认

确认记录：2026-05-21 16:14，CEO 赵遵凯授权 Lisen 自行审批。Lisen 按 PRD v1.0 完成设计自审，阶段二设计通过，可进入阶段三开发任务拆解。
