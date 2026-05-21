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
  Clock3,
  Command,
  Download,
  Eye,
  Layers3,
  LockKeyhole,
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
  deliverables,
  metrics,
  modules,
  nav,
  platforms,
  roles,
  workflowEdges,
  workflowNodes,
} from './data'
import './App.css'

const stateClass = {
  已发布: 'success',
  待审核: 'pending',
  生成中: 'running',
  需返修: 'danger',
}

function App() {
  const [activeMode, setActiveMode] = useState('视频短剧')
  const [nodes] = useState<Node[]>(workflowNodes)
  const [edges] = useState<Edge[]>(workflowEdges)
  const modes = ['视频短剧', '公众号', '小红书', '产品图', '知识库']

  const currentRun = useMemo(
    () => ({
      title: `${activeMode} · 自动创作链路`,
      prompt: '参考 LibTV 的连续内容玩法，将脚本、分镜、素材、生成和发布组合成可复用流水线。',
      progress: activeMode === '视频短剧' ? 68 : 42,
    }),
    [activeMode],
  )

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
              {modes.map((mode) => (
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
                <p>生成一套适合 {activeMode} 的内容方案，包含脚本、视觉风格、模型参数、审核规则和发布渠道。</p>
              </div>
              <button className="send-button" type="button" aria-label="发送">
                <Send size={18} />
              </button>
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
                  <p>{role.permissions.join(' / ')}</p>
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
              {deliverables.map((item) => (
                <article key={item.title}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.channel} · {item.owner}</span>
                  </div>
                  <div className="deliverable-state">
                    <span className={stateClass[item.state]}>{item.state}</span>
                    <b>{item.quality}</b>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="studio-panel">
            <div className="section-heading">
              <div>
                <span>多平台打包</span>
                <h2>Web 优先，多端扩展</h2>
              </div>
              <ChevronDown size={18} />
            </div>
            <div className="platform-list">
              {platforms.map((platform) => (
                <article key={platform.name}>
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>{platform.name}</strong>
                    <span>{platform.target}</span>
                  </div>
                  <em>{platform.status}</em>
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
