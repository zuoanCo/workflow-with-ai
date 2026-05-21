import type { Edge, Node } from '@xyflow/react'
import {
  Bot,
  Brush,
  Clapperboard,
  Database,
  FileBox,
  Gauge,
  GitBranch,
  Globe2,
  Images,
  KeyRound,
  LockKeyhole,
  MessageSquareText,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Workflow,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type Metric = {
  label: string
  value: string
  trend: string
  status: 'good' | 'warn' | 'info'
}

export type Module = {
  name: string
  summary: string
  icon: LucideIcon
  accent: string
}

export type Deliverable = {
  title: string
  channel: string
  owner: string
  state: '已发布' | '待审核' | '生成中' | '需返修'
  quality: number
}

export type Role = {
  name: string
  scope: string
  permissions: string[]
  risk: '低' | '中' | '高'
}

export type Platform = {
  name: string
  target: string
  status: string
  coverage: string
}

export const metrics: Metric[] = [
  { label: '今日创作任务', value: '128', trend: '+23%', status: 'good' },
  { label: '平均生成成本', value: '¥1.86', trend: '-11%', status: 'good' },
  { label: '队列等待', value: '04m', trend: '稳定', status: 'info' },
  { label: '审核命中风险', value: '2.4%', trend: '-0.8%', status: 'warn' },
]

export const modules: Module[] = [
  {
    name: 'AI 对话中枢',
    summary: '角色、知识库、模型路由、上下文资产化和会话复盘。',
    icon: MessageSquareText,
    accent: '#2563eb',
  },
  {
    name: 'AI 生图工坊',
    summary: '提示词模板、参考图、批量生成、版本对比和版权记录。',
    icon: Images,
    accent: '#c2410c',
  },
  {
    name: 'AI 生视频流水线',
    summary: '分镜、首尾帧、镜头提示词、渲染队列和多版本交付。',
    icon: Clapperboard,
    accent: '#7c3aed',
  },
  {
    name: '画布工作流',
    summary: '节点编排、人工审核、分支重试、成果自动归档。',
    icon: Workflow,
    accent: '#059669',
  },
]

export const roles: Role[] = [
  {
    name: 'Owner',
    scope: '组织级',
    permissions: ['账户管理', '密钥管理', '计费与监控', '发布审批'],
    risk: '高',
  },
  {
    name: 'Producer',
    scope: '项目级',
    permissions: ['创建工作流', '提交成果', '查看项目数据'],
    risk: '中',
  },
  {
    name: 'Reviewer',
    scope: '成果级',
    permissions: ['内容审核', '质量评分', '退回返修'],
    risk: '低',
  },
]

export const deliverables: Deliverable[] = [
  { title: 'LibTV 风格短剧海报 A/B', channel: '小红书 / 抖音', owner: '少闲儿', state: '待审核', quality: 92 },
  { title: '空性 vs 张无忌分镜视频', channel: '视频号', owner: '导演 Jime', state: '生成中', quality: 87 },
  { title: 'AI 工作流创业报告封面', channel: '公众号', owner: 'Lisen', state: '已发布', quality: 96 },
  { title: '社区首页导航改版素材', channel: 'Web', owner: '小笼包UI', state: '需返修', quality: 74 },
]

export const platforms: Platform[] = [
  { name: 'Web App', target: 'Vite SPA / SSR 可升级', status: '已实现', coverage: '桌面 + 移动端' },
  { name: 'Desktop', target: 'Tauri / Electron 壳层', status: '预留配置', coverage: 'macOS / Windows / Linux' },
  { name: 'Mobile', target: 'Capacitor / PWA', status: '路线确认', coverage: 'iOS / Android' },
  { name: 'API Worker', target: '队列 + Webhook', status: '架构预留', coverage: '模型与平台适配器' },
]

export const workflowNodes: Node[] = [
  {
    id: 'brief',
    type: 'input',
    position: { x: 0, y: 90 },
    data: { label: '创作 Brief' },
    style: { border: '1px solid #94a3b8', borderRadius: 12, padding: 12, background: '#f8fafc' },
  },
  {
    id: 'chat',
    position: { x: 210, y: 20 },
    data: { label: 'AI 对话策划' },
    style: { border: '1px solid #93c5fd', borderRadius: 12, padding: 12, background: '#eff6ff' },
  },
  {
    id: 'image',
    position: { x: 420, y: 20 },
    data: { label: '生图批处理' },
    style: { border: '1px solid #fdba74', borderRadius: 12, padding: 12, background: '#fff7ed' },
  },
  {
    id: 'video',
    position: { x: 420, y: 160 },
    data: { label: '生视频渲染' },
    style: { border: '1px solid #c4b5fd', borderRadius: 12, padding: 12, background: '#f5f3ff' },
  },
  {
    id: 'review',
    position: { x: 650, y: 90 },
    data: { label: '人工审核' },
    style: { border: '1px solid #86efac', borderRadius: 12, padding: 12, background: '#f0fdf4' },
  },
  {
    id: 'publish',
    type: 'output',
    position: { x: 880, y: 90 },
    data: { label: '多平台打包' },
    style: { border: '1px solid #64748b', borderRadius: 12, padding: 12, background: '#f8fafc' },
  },
]

export const workflowEdges: Edge[] = [
  { id: 'brief-chat', source: 'brief', target: 'chat', animated: true },
  { id: 'chat-image', source: 'chat', target: 'image' },
  { id: 'chat-video', source: 'chat', target: 'video' },
  { id: 'image-review', source: 'image', target: 'review' },
  { id: 'video-review', source: 'video', target: 'review' },
  { id: 'review-publish', source: 'review', target: 'publish', animated: true },
]

export const architecture = [
  { title: '身份与租户', detail: '组织、成员、角色、权限策略、审计日志。', icon: UsersRound },
  { title: '模型适配层', detail: '对话、生图、生视频统一为 Provider Adapter。', icon: Bot },
  { title: '工作流引擎', detail: 'DAG 节点、重试、人工卡点、幂等执行。', icon: GitBranch },
  { title: '资产与成果库', detail: '素材、版本、审核状态、渠道打包元数据。', icon: FileBox },
  { title: '数据监控', detail: '成本、耗时、成功率、队列、质量评分。', icon: Gauge },
  { title: '密钥安全', detail: '平台密钥隔离、最小权限、操作追踪。', icon: KeyRound },
]

export const nav = [
  { label: '总览', icon: Gauge },
  { label: '创作', icon: Sparkles },
  { label: '画布', icon: Brush },
  { label: '成果', icon: FileBox },
  { label: '权限', icon: ShieldCheck },
  { label: '监控', icon: Database },
  { label: '打包', icon: MonitorSmartphone },
  { label: '安全', icon: LockKeyhole },
  { label: '发布', icon: Globe2 },
]
