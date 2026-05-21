import { BookOpenText, FileText, MessageSquareText, type LucideIcon } from 'lucide-react'

export type ChatSessionStatus = 'draft' | 'running' | 'asset_ready' | 'needs_review'

export type ChatAssetType = 'script' | 'outline' | 'knowledge_note'

export type ChatModelRoute = {
  primary: string
  fallback: string
  guardrail: string
}

export type ChatPromptTemplate = {
  id: string
  name: string
  scenario: string
  outputAsset: ChatAssetType
  icon: LucideIcon
}

export type ChatSession = {
  id: string
  title: string
  project: string
  owner: string
  status: ChatSessionStatus
  templateId: string
  modelRoute: ChatModelRoute
  contextAssets: string[]
  resultAsset: {
    type: ChatAssetType
    target: string
    version: string
  }
}

export const chatStatusLabels: Record<ChatSessionStatus, string> = {
  draft: '草稿',
  running: '对话中',
  asset_ready: '已资产化',
  needs_review: '待复核',
}

export const chatAssetLabels: Record<ChatAssetType, string> = {
  script: '脚本资产',
  outline: '大纲资产',
  knowledge_note: '知识条目',
}

export const chatPromptTemplates: ChatPromptTemplate[] = [
  {
    id: 'tpl-script-beats',
    name: '短剧节奏拆解',
    scenario: '把 Brief 转为人物目标、冲突节拍和分镜提示词。',
    outputAsset: 'script',
    icon: MessageSquareText,
  },
  {
    id: 'tpl-article-outline',
    name: '图文大纲生成',
    scenario: '生成标题、大纲、论点、摘要和封面 Brief。',
    outputAsset: 'outline',
    icon: FileText,
  },
  {
    id: 'tpl-review-memory',
    name: '复盘知识沉淀',
    scenario: '把审核结论和返修原因转成可复用知识条目。',
    outputAsset: 'knowledge_note',
    icon: BookOpenText,
  },
]

export const chatSessions: ChatSession[] = [
  {
    id: 'chat-001',
    title: '空性对战张无忌 · 剧情节奏',
    project: '连续短剧生产线',
    owner: 'Producer',
    status: 'running',
    templateId: 'tpl-script-beats',
    modelRoute: {
      primary: 'OpenAI / text-large',
      fallback: 'LibTV Script Adapter',
      guardrail: '事实与敏感词审核',
    },
    contextAssets: ['人物设定 v2', '上一集分镜', '平台时长规则'],
    resultAsset: {
      type: 'script',
      target: '脚本库 / 第 12 集',
      version: 'v3',
    },
  },
  {
    id: 'chat-002',
    title: 'AI 工作流创业观察 · 图文长稿',
    project: '知道咖啡馆内容组',
    owner: 'Producer',
    status: 'asset_ready',
    templateId: 'tpl-article-outline',
    modelRoute: {
      primary: 'OpenAI / reasoning',
      fallback: 'OpenAI / text-fast',
      guardrail: '引用来源检查',
    },
    contextAssets: ['PRD 摘要', '竞品观察', '历史公众号风格'],
    resultAsset: {
      type: 'outline',
      target: '公众号草稿',
      version: 'v1',
    },
  },
]

export function getTemplateById(templateId: string) {
  return chatPromptTemplates.find((template) => template.id === templateId)
}

export function getAssetReadySessions(sessions: ChatSession[] = chatSessions) {
  return sessions.filter((session) => session.status === 'asset_ready')
}

export function describeChatAssetBoundary(session: ChatSession) {
  const template = getTemplateById(session.templateId)
  const assetLabel = chatAssetLabels[session.resultAsset.type]

  return {
    templateName: template?.name ?? '未绑定模板',
    assetLabel,
    target: `${session.resultAsset.target} / ${session.resultAsset.version}`,
    contextCount: session.contextAssets.length,
  }
}
