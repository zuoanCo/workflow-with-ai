import { useMemo, useState, type CSSProperties } from 'react'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  Activity,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clapperboard,
  Clock3,
  Command,
  Download,
  Eye,
  FileText,
  Images,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  PackageCheck,
  Play,
  Plus,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from 'lucide-react'
import {
  architecture,
  metrics,
  modules,
  nav,
  roles,
  workflowEdges,
  workflowNodes,
} from './data'
import {
  creationModes,
  getCreationPlan,
  getHistoryForMode,
  getTemplatesForMode,
  statusLabels,
  type CreationMode,
} from './domain/creation'
import {
  chatPromptTemplates,
  chatSessions,
  chatStatusLabels,
  describeChatAssetBoundary,
} from './domain/chat'
import {
  getImageBatchSummary,
  imageGenerationBatches,
  imageStatusLabels,
  imageStyleTemplates,
} from './domain/image'
import {
  getVideoJobSummary,
  videoRenderJobs,
  videoStatusLabels,
} from './domain/video'
import {
  getWorkflowNodeRun,
  getWorkflowRunSummary,
  workflowNodeStatusLabels,
  workflowRun,
} from './domain/workflow'
import {
  canReviewDeliverable,
  channelPackageStatusLabels,
  deliverableAssets,
  deliverableStatusLabels,
  getDeliverableSummary,
} from './domain/deliverable'
import {
  formatMetricValue,
  getObservabilitySummary,
  observabilityHealthLabels,
  observabilitySnapshot,
  trendLabels,
} from './domain/observability'
import {
  getPackagingSummary,
  packagingAdapters,
  packagingStatusLabels,
} from './domain/packaging'
import { actionLabels, auditEntries, permissionLabels, projectAccess } from './domain/rbac'
import './App.css'

const generationStateClass = {
  draft: 'info',
  queued: 'pending',
  running: 'running',
  review_pending: 'pending',
  archived: 'success',
}

const chatStateClass = {
  draft: 'info',
  running: 'running',
  asset_ready: 'success',
  needs_review: 'pending',
}

const imageStateClass = {
  queued: 'pending',
  generating: 'running',
  review_pending: 'pending',
  approved: 'success',
  rework_required: 'danger',
}

const videoStateClass = {
  queued: 'pending',
  rendering: 'running',
  failed: 'danger',
  retry_ready: 'danger',
  review_pending: 'pending',
  approved: 'success',
}

const workflowNodeRunStateClass = {
  pending: 'info',
  running: 'running',
  waiting_review: 'pending',
  succeeded: 'success',
  failed: 'danger',
  blocked: 'danger',
}

const deliverableStateClass = {
  draft: 'info',
  generated: 'running',
  review_pending: 'pending',
  approved: 'success',
  rejected: 'danger',
  rework_required: 'danger',
  packaged: 'success',
}

const channelPackageStateClass = {
  not_started: 'info',
  ready: 'pending',
  blocked: 'danger',
  delivered: 'success',
}

const observabilityStateClass = {
  healthy: 'success',
  warning: 'pending',
  critical: 'danger',
}

const packagingStateClass = {
  configured: 'info',
  ready: 'pending',
  blocked: 'danger',
  delivered: 'success',
}

function App() {
  const [activeMode, setActiveMode] = useState<CreationMode>('视频短剧')
  const [nodes] = useState<Node[]>(workflowNodes)
  const [edges] = useState<Edge[]>(workflowEdges)

  const currentRun = useMemo(() => getCreationPlan(activeMode), [activeMode])
  const activeTemplates = useMemo(() => getTemplatesForMode(activeMode), [activeMode])
  const activeHistory = useMemo(() => getHistoryForMode(activeMode), [activeMode])
  const workflowSummary = useMemo(() => getWorkflowRunSummary(workflowRun), [])
  const observabilitySummary = useMemo(() => getObservabilitySummary(), [])
  const packagingSummary = useMemo(() => getPackagingSummary(), [])

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Command size={20} />
          </div>
          <div>
            <strong>Workflow AI</strong>
            <span>AI 创作运营系统</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="主导航">
          {nav.map((item, index) => {
            const Icon = item.icon
            return (
              <button className={index === 0 ? 'active' : ''} type="button" key={item.label}>
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <section className="sidebar-panel">
          <div className="panel-kicker">当前组织</div>
          <strong>知道咖啡馆内容组</strong>
          <p>Owner · 9 名成员 · 4 个活跃项目</p>
          <button className="ghost-button" type="button">
            <Settings2 size={16} />
            组织设置
          </button>
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="search">
            <Search size={18} />
            <input aria-label="搜索" placeholder="搜索任务、成果、成员或工作流" />
          </div>
          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="通知">
              <Bell size={18} />
            </button>
            <button className="secondary-button" type="button">
              <UploadCloud size={17} />
              导入资产
            </button>
            <button className="primary-button" type="button">
              <Plus size={17} />
              新建工作流
            </button>
          </div>
        </header>

        <section className="hero-band">
          <div className="hero-copy">
            <div className="eyebrow">
              <CircleDot size={14} />
              LibTV-like AI Creation Ops
            </div>
            <h1>可管理、可观测、可扩展的 AI 创作生产系统</h1>
            <p>
              统一管理 AI 对话、生图、生视频、画布编排、成果审核和多平台打包，让创意从 Brief 到发布形成可追踪流水线。
            </p>
            <div className="hero-actions">
              <button className="primary-button" type="button">
                <Play size={17} />
                运行演示链路
              </button>
              <button className="secondary-button" type="button">
                <Eye size={17} />
                查看工程方案
              </button>
            </div>
          </div>
          <div className="run-card">
            <div className="run-card-header">
              <span>当前任务</span>
              <strong>{currentRun.title}</strong>
            </div>
            <p>{currentRun.prompt}</p>
            <div className="progress">
              <span style={{ width: `${currentRun.progress}%` }} />
            </div>
            <div className="run-meta">
              <span>
                <Clock3 size={15} />
                预计 18 分钟
              </span>
              <span>
                <ShieldCheck size={15} />
                含审核卡点
              </span>
            </div>
          </div>
        </section>

        <section className="metric-grid" aria-label="数据监控">
          {metrics.map((metric) => (
            <article className={`metric ${metric.status}`} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <em>{metric.trend}</em>
            </article>
          ))}
        </section>

        <section className="studio-panel observability-panel wide" aria-label="监控详情">
          <div className="section-heading">
            <div>
              <span>数据监控</span>
              <h2>成本、耗时、成功率与风险</h2>
            </div>
            <Activity size={18} />
          </div>
          <div className="observability-layout">
            <section>
              <div className="subsection-heading">
                <strong>核心指标</strong>
                <span>
                  失败 {observabilitySummary.totalFailedTasks} · 待处理 {observabilitySummary.totalWaiting}
                </span>
              </div>
              <div className="observability-metrics">
                {observabilitySnapshot.metrics.map((metric) => (
                  <article key={metric.id}>
                    <span>{metric.label}</span>
                    <strong>{formatMetricValue(metric)}</strong>
                    <em className={observabilityStateClass[metric.health]}>
                      {observabilityHealthLabels[metric.health]} · {trendLabels[metric.trend]}
                    </em>
                  </article>
                ))}
              </div>
            </section>
            <section>
              <div className="subsection-heading">
                <strong>Provider 成功率</strong>
                <span>最低 {observabilitySummary.lowestProviderSuccessRate.toFixed(1)}%</span>
              </div>
              <div className="provider-health-list">
                {observabilitySnapshot.providers.map((provider) => (
                  <article key={provider.provider}>
                    <div>
                      <strong>{provider.provider}</strong>
                      <span>
                        {provider.taskType} · P95 {Math.round(provider.p95LatencySeconds / 60)}m · 失败 {provider.failedTasks}
                      </span>
                    </div>
                    <em>{provider.successRate.toFixed(1)}%</em>
                  </article>
                ))}
              </div>
            </section>
            <section>
              <div className="subsection-heading">
                <strong>队列状态</strong>
                <span>最长等待 {Math.round(observabilitySummary.maxOldestWaitingSeconds / 60)}m</span>
              </div>
              <div className="queue-list">
                {observabilitySnapshot.queues.map((queue) => (
                  <article key={queue.name}>
                    <strong>{queue.name}</strong>
                    <span>等待 {queue.waiting} · 运行 {queue.running} · 可重试 {queue.retryableFailures}</span>
                  </article>
                ))}
              </div>
            </section>
            <section>
              <div className="subsection-heading">
                <strong>审核风险</strong>
                <span>严重 {observabilitySummary.criticalRiskCount}</span>
              </div>
              <div className="risk-list">
                {observabilitySnapshot.risks.map((risk) => (
                  <article key={risk.id}>
                    <div>
                      <strong>{risk.label}</strong>
                      <span>{risk.owner} · 命中 {risk.hitRate.toFixed(1)}%</span>
                    </div>
                    <em className={observabilityStateClass[risk.severity]}>
                      {observabilityHealthLabels[risk.severity]}
                    </em>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="content-grid">
          <section className="studio-panel wide">
            <div className="section-heading">
              <div>
                <span>创作工作台</span>
                <h2>多模态生产入口</h2>
              </div>
              <button className="ghost-button" type="button">
                <Sparkles size={16} />
                模板库
              </button>
            </div>
            <div className="mode-tabs" role="tablist" aria-label="创作模式">
              {creationModes.map((mode) => (
                <button
                  type="button"
                  className={mode === activeMode ? 'selected' : ''}
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className="composer">
              <div className="composer-input">
                <span>Prompt</span>
                <p>{currentRun.prompt}</p>
              </div>
              <button className="send-button" type="button" aria-label="发送">
                <Send size={18} />
              </button>
            </div>
            <div className="creation-meta" aria-label="创作参数">
              <article>
                <span>模型路由</span>
                <strong>{currentRun.modelRoute}</strong>
              </article>
              <article>
                <span>审核策略</span>
                <strong>{currentRun.riskPolicy}</strong>
              </article>
              <article>
                <span>资产目标</span>
                <strong>{currentRun.outputTarget}</strong>
              </article>
            </div>
            <div className="creation-workspace">
              <section aria-label="模板入口">
                <div className="subsection-heading">
                  <strong>模板入口</strong>
                  <span>{activeTemplates.length} 个可用模板</span>
                </div>
                <div className="template-list">
                  {activeTemplates.map((template) => {
                    const Icon = template.icon
                    return (
                      <article key={template.name}>
                        <Icon size={18} />
                        <div>
                          <strong>{template.name}</strong>
                          <span>{template.purpose}</span>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
              <section aria-label="生成历史">
                <div className="subsection-heading">
                  <strong>生成历史</strong>
                  <span>{activeHistory.length} 条记录</span>
                </div>
                <div className="history-list">
                  {activeHistory.map((item) => (
                    <article key={item.id}>
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.assetTarget}</span>
                      </div>
                      <em className={generationStateClass[item.status]}>{statusLabels[item.status]}</em>
                    </article>
                  ))}
                </div>
              </section>
            </div>
            <div className="module-grid">
              {modules.map((module) => {
                const Icon = module.icon
                return (
                  <article
                    className="module-card"
                    key={module.name}
                    style={{ '--accent': module.accent } as CSSProperties}
                  >
                    <Icon size={22} />
                    <h3>{module.name}</h3>
                    <p>{module.summary}</p>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="studio-panel wide">
            <div className="section-heading">
              <div>
                <span>AI 对话</span>
                <h2>会话、模板与资产化</h2>
              </div>
              <MessageSquareText size={18} />
            </div>
            <div className="chat-module">
              <section aria-label="对话提示词模板">
                <div className="subsection-heading">
                  <strong>提示词模板</strong>
                  <span>{chatPromptTemplates.length} 个模板</span>
                </div>
                <div className="chat-template-list">
                  {chatPromptTemplates.map((template) => {
                    const Icon = template.icon
                    return (
                      <article key={template.id}>
                        <Icon size={18} />
                        <div>
                          <strong>{template.name}</strong>
                          <span>{template.scenario}</span>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
              <section aria-label="对话会话资产化">
                <div className="subsection-heading">
                  <strong>会话资产化</strong>
                  <span>{chatSessions.length} 条会话</span>
                </div>
                <div className="chat-session-list">
                  {chatSessions.map((session) => {
                    const boundary = describeChatAssetBoundary(session)
                    return (
                      <article key={session.id}>
                        <div className="chat-session-main">
                          <div>
                            <strong>{session.title}</strong>
                            <span>{session.project} · {boundary.templateName}</span>
                          </div>
                          <em className={chatStateClass[session.status]}>{chatStatusLabels[session.status]}</em>
                        </div>
                        <div className="chat-route">
                          <span>{session.modelRoute.primary}</span>
                          <span>{session.modelRoute.fallback}</span>
                          <span>{session.modelRoute.guardrail}</span>
                        </div>
                        <div className="chat-asset-target">
                          <FileText size={16} />
                          <span>{boundary.assetLabel}：{boundary.target}</span>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            </div>
          </section>

          <section className="studio-panel wide">
            <div className="section-heading">
              <div>
                <span>AI 生图</span>
                <h2>参考图、批量生成与审核</h2>
              </div>
              <Images size={18} />
            </div>
            <div className="image-module">
              <section aria-label="生图风格模板">
                <div className="subsection-heading">
                  <strong>风格模板</strong>
                  <span>{imageStyleTemplates.length} 个模板</span>
                </div>
                <div className="image-style-list">
                  {imageStyleTemplates.map((template) => (
                    <article key={template.id}>
                      <div>
                        <strong>{template.name}</strong>
                        <span>{template.scene}</span>
                      </div>
                      <em>{template.aspectRatio}</em>
                      <small>{template.providerRoute}</small>
                    </article>
                  ))}
                </div>
              </section>
              <section aria-label="生图批次与版本审核">
                <div className="subsection-heading">
                  <strong>批次与版本</strong>
                  <span>{imageGenerationBatches.length} 个批次</span>
                </div>
                <div className="image-batch-list">
                  {imageGenerationBatches.map((batch) => {
                    const summary = getImageBatchSummary(batch)
                    return (
                      <article key={batch.id}>
                        <div className="image-batch-head">
                          <div>
                            <strong>{batch.title}</strong>
                            <span>{batch.project} · {summary.templateName} · {summary.referenceCount} 张参考图</span>
                          </div>
                          <b>{summary.bestVariantLabel}</b>
                        </div>
                        <p>{batch.prompt}</p>
                        <div className="image-variant-row">
                          {batch.variants.map((variant) => (
                            <span className={imageStateClass[variant.status]} key={variant.id}>
                              {variant.label} · {imageStatusLabels[variant.status]} · {variant.qualityScore || '待评分'}
                            </span>
                          ))}
                        </div>
                        <div className="image-review-target">
                          <ShieldCheck size={16} />
                          <span>{batch.reviewTarget} · 待审 {summary.reviewReadyCount} · 返修 {summary.blockedCount}</span>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            </div>
          </section>

          <section className="studio-panel wide">
            <div className="section-heading">
              <div>
                <span>AI 生视频</span>
                <h2>分镜、首尾帧与渲染队列</h2>
              </div>
              <Clapperboard size={18} />
            </div>
            <div className="video-job-list" aria-label="生视频渲染任务">
              {videoRenderJobs.map((job) => {
                const summary = getVideoJobSummary(job)
                return (
                  <article key={job.id}>
                    <div className="video-job-head">
                      <div>
                        <strong>{job.title}</strong>
                        <span>{job.project} · {job.providerRoute}</span>
                      </div>
                      <em className={videoStateClass[job.status]}>{videoStatusLabels[job.status]}</em>
                    </div>
                    <div className="video-job-meta">
                      <span>{summary.shotCount} 个分镜</span>
                      <span>{summary.totalDurationSeconds} 秒</span>
                      <span>{summary.frameReferenceCount} 个参考帧</span>
                      <span>重试 {summary.retryLabel}</span>
                    </div>
                    <div className="shot-list">
                      {job.shots.map((shot) => (
                        <span key={shot.id}>
                          {shot.label} · {shot.camera} · {shot.durationSeconds}s
                        </span>
                      ))}
                    </div>
                    <div className="video-review-target">
                      <ShieldCheck size={16} />
                      <span>
                        {job.reviewTarget} · 首尾帧 {summary.hasFirstAndLastFrame ? '完整' : '缺失'}
                      </span>
                      {summary.canRetry ? <b>失败节点可重试</b> : null}
                    </div>
                    {job.failureReason ? <p>{job.failureReason}</p> : null}
                  </article>
                )
              })}
            </div>
          </section>

          <section className="studio-panel">
            <div className="section-heading">
              <div>
                <span>账户权限</span>
                <h2>RBAC 最小权限</h2>
              </div>
              <LockKeyhole size={18} />
            </div>
            <div className="role-list">
              {roles.map((role) => (
                <article key={role.name}>
                  <div>
                    <strong>{role.name}</strong>
                    <span>{role.scope} · 风险 {role.risk}</span>
                  </div>
                  <p>{role.permissions.map((permission) => permissionLabels[permission]).join(' / ')}</p>
                </article>
              ))}
            </div>
            <div className="access-grid" aria-label="项目级授权">
              {projectAccess.map((access) => (
                <article key={access.role}>
                  <strong>{access.project}</strong>
                  <span>{access.role}</span>
                  <div>
                    <b className={access.canRunWorkflow ? 'success' : 'danger'}>运行</b>
                    <b className={access.canReview ? 'success' : 'danger'}>审核</b>
                    <b className={access.canReadAudit ? 'success' : 'danger'}>审计</b>
                  </div>
                </article>
              ))}
            </div>
            <div className="audit-list" aria-label="关键操作审计">
              {auditEntries.map((entry) => (
                <article key={`${entry.actor}-${entry.target}`}>
                  <div>
                    <strong>{entry.actor}</strong>
                    <span>{actionLabels[entry.action]} · {entry.target}</span>
                  </div>
                  <em className={entry.result === '允许' ? 'success' : 'danger'}>{entry.result}</em>
                  <p>{entry.reason}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="studio-panel canvas-panel wide">
            <div className="section-heading">
              <div>
                <span>画布工作流</span>
                <h2>节点化创作与审核链路</h2>
              </div>
              <button className="secondary-button" type="button">
                <Layers3 size={16} />
                保存版本
              </button>
            </div>
            <div className="flow-wrap">
              <ReactFlow nodes={nodes} edges={edges} fitView>
                <Background />
                <MiniMap pannable zoomable />
                <Controls />
              </ReactFlow>
            </div>
            <div className="workflow-console" aria-label="工作流运行态">
              <section>
                <div className="subsection-heading">
                  <strong>{workflowRun.title}</strong>
                  <span>{workflowRun.project} · {workflowRun.triggerUser}</span>
                </div>
                <div className="workflow-summary">
                  <article>
                    <span>节点</span>
                    <strong>{workflowSummary.nodeCount}</strong>
                  </article>
                  <article>
                    <span>连线</span>
                    <strong>{workflowSummary.edgeCount}</strong>
                  </article>
                  <article>
                    <span>成本</span>
                    <strong>¥{(workflowSummary.totalCostCents / 100).toFixed(2)}</strong>
                  </article>
                  <article>
                    <span>耗时</span>
                    <strong>{Math.round(workflowSummary.totalDurationSeconds / 60)}m</strong>
                  </article>
                </div>
              </section>
              <section>
                <div className="subsection-heading">
                  <strong>节点运行记录</strong>
                  <span>
                    审核 {workflowSummary.waitingReviewCount} · 阻塞 {workflowSummary.blockedCount} · 失败 {workflowSummary.failedCount}
                  </span>
                </div>
                <div className="workflow-node-list">
                  {workflowRun.nodes.map((node) => {
                    const nodeRun = getWorkflowNodeRun(workflowRun, node.id)

                    return (
                      <article key={node.id}>
                        <div>
                          <strong>{node.label}</strong>
                          <span>{node.type} · {node.owner} · {nodeRun?.outputTarget}</span>
                        </div>
                        {nodeRun ? (
                          <em className={workflowNodeRunStateClass[nodeRun.status]}>
                            {workflowNodeStatusLabels[nodeRun.status]}
                          </em>
                        ) : null}
                      </article>
                    )
                  })}
                </div>
              </section>
            </div>
          </section>

          <section className="studio-panel">
            <div className="section-heading">
              <div>
                <span>成果管理</span>
                <h2>交付、审核、返修</h2>
              </div>
              <button className="icon-button" type="button" aria-label="下载">
                <Download size={17} />
              </button>
            </div>
            <div className="deliverables">
              {deliverableAssets.map((item) => {
                const summary = getDeliverableSummary(item)

                return (
                  <article key={item.id}>
                    <div className="deliverable-head">
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.project} · {item.owner}</span>
                      </div>
                      <em className={deliverableStateClass[item.status]}>
                        {deliverableStatusLabels[item.status]}
                      </em>
                    </div>
                    <div className="deliverable-meta">
                      <span>{summary.latestVersionLabel}</span>
                      <span>评分 {summary.latestQualityScore}</span>
                      <span>审核 {summary.latestReviewer}</span>
                      <span>版本 {summary.versionCount}</span>
                    </div>
                    <div className="deliverable-channels" aria-label={`${item.title} 渠道包`}>
                      {item.channelPackages.map((channel) => (
                        <span className={channelPackageStateClass[channel.status]} key={channel.channel}>
                          {channel.channel} · {channelPackageStatusLabels[channel.status]}
                        </span>
                      ))}
                    </div>
                    <div className="deliverable-review-row">
                      <span>
                        返修 {summary.openReworkCount} · 可交付 {summary.readyChannelCount} · 阻塞 {summary.blockedChannelCount}
                      </span>
                      {canReviewDeliverable(item) ? <b>审核入口</b> : null}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="studio-panel">
            <div className="section-heading">
              <div>
                <span>多平台打包</span>
                <h2>Web 优先，多端扩展</h2>
              </div>
              <PackageCheck size={18} />
            </div>
            <div className="packaging-summary" aria-label="打包能力摘要">
              <article>
                <span>适配器</span>
                <strong>{packagingSummary.total}</strong>
              </article>
              <article>
                <span>可打包</span>
                <strong>{packagingSummary.ready}</strong>
              </article>
              <article>
                <span>阻塞</span>
                <strong>{packagingSummary.blocked}</strong>
              </article>
              <article>
                <span>必需产物</span>
                <strong>{packagingSummary.requiredArtifacts}</strong>
              </article>
            </div>
            <div className="platform-list">
              {packagingAdapters.map((adapter) => (
                <article key={adapter.id}>
                  {adapter.status === 'blocked' ? <ChevronDown size={18} /> : <CheckCircle2 size={18} />}
                  <div>
                    <strong>{adapter.channel}</strong>
                    <span>{adapter.runtimeSurface} · {adapter.target}</span>
                    <small>{adapter.requirements.join(' / ')}</small>
                  </div>
                  <em className={packagingStateClass[adapter.status]}>
                    {packagingStatusLabels[adapter.status]}
                  </em>
                </article>
              ))}
            </div>
          </section>

          <section className="studio-panel">
            <div className="section-heading">
              <div>
                <span>系统架构</span>
                <h2>可维护模块边界</h2>
              </div>
              <Activity size={18} />
            </div>
            <div className="architecture-list">
              {architecture.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.title}>
                    <Icon size={18} />
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.detail}</span>
                    </div>
                    <ArrowRight size={16} />
                  </article>
                )
              })}
            </div>
          </section>
        </section>
      </section>
    </main>
  )
}

export default App
