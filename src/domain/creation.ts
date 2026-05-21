import { Clapperboard, FileText, Images, type LucideIcon, MessageSquareText, PackageCheck } from 'lucide-react'

export type CreationMode = '视频短剧' | '公众号' | '小红书' | '产品图' | '知识库'

export type GenerationStatus = 'draft' | 'queued' | 'running' | 'review_pending' | 'archived'

export type CreationPlan = {
  mode: CreationMode
  title: string
  prompt: string
  progress: number
  modelRoute: string
  riskPolicy: string
  outputTarget: string
}

export type PromptTemplate = {
  name: string
  mode: CreationMode
  purpose: string
  icon: LucideIcon
}

export type GenerationHistoryItem = {
  id: string
  mode: CreationMode
  title: string
  status: GenerationStatus
  assetTarget: string
}

export const creationModes: CreationMode[] = ['视频短剧', '公众号', '小红书', '产品图', '知识库']

export const creationPlans: Record<CreationMode, CreationPlan> = {
  视频短剧: {
    mode: '视频短剧',
    title: '视频短剧 · 自动创作链路',
    prompt: '参考 LibTV 的连续内容玩法，将脚本、分镜、素材、生成和发布组合成可复用流水线。',
    progress: 68,
    modelRoute: 'ChatGenerate -> ImageGenerate -> VideoGenerate',
    riskPolicy: '脚本风险 + 肖像一致性 + 发布审核',
    outputTarget: '短视频渠道交付包',
  },
  公众号: {
    mode: '公众号',
    title: '公众号 · 图文生产链路',
    prompt: '围绕主题生成文章大纲、正文、封面图和摘要，并沉淀为可审核图文资产。',
    progress: 46,
    modelRoute: 'ChatGenerate -> ImageGenerate -> PackageChannel',
    riskPolicy: '事实核验 + 封面版权 + 敏感词',
    outputTarget: '公众号草稿素材包',
  },
  小红书: {
    mode: '小红书',
    title: '小红书 · 种草内容链路',
    prompt: '生成适合小红书的标题、正文、标签、封面图和多图脚本，支持多版本对比。',
    progress: 52,
    modelRoute: 'PromptTemplate -> ImageGenerate -> ReviewGate',
    riskPolicy: '广告合规 + 图片版权 + 评论风险',
    outputTarget: '小红书图文包',
  },
  产品图: {
    mode: '产品图',
    title: '产品图 · 视觉批处理链路',
    prompt: '基于参考图生成多套产品场景、背景、比例和风格变体，并进入版本审核。',
    progress: 38,
    modelRoute: 'ImageGenerate -> AssetTransform -> ReviewGate',
    riskPolicy: '品牌一致性 + 商标完整性 + 版权记录',
    outputTarget: '产品图片资产组',
  },
  知识库: {
    mode: '知识库',
    title: '知识库 · 内容沉淀链路',
    prompt: '把对话、生成结果和审核结论整理为可复用知识条目，供后续工作流调用。',
    progress: 34,
    modelRoute: 'ChatGenerate -> AssetTransform -> PackageChannel',
    riskPolicy: '引用来源 + 权限边界 + 版本留痕',
    outputTarget: '知识库条目',
  },
}

export const promptTemplates: PromptTemplate[] = [
  { name: '脚本与分镜', mode: '视频短剧', purpose: '生成剧情节奏、镜头提示词和首尾帧说明。', icon: Clapperboard },
  { name: '图文长稿', mode: '公众号', purpose: '生成标题、大纲、正文、摘要和封面 Brief。', icon: FileText },
  { name: '种草笔记', mode: '小红书', purpose: '生成标题钩子、正文结构、标签和九宫格图文规划。', icon: MessageSquareText },
  { name: '视觉批量', mode: '产品图', purpose: '生成场景、光线、角度、比例和风格参数组合。', icon: Images },
  { name: '资产归档', mode: '知识库', purpose: '把生成结果沉淀为带来源、版本和权限边界的知识资产。', icon: PackageCheck },
]

export const generationHistory: GenerationHistoryItem[] = [
  { id: 'run-001', mode: '视频短剧', title: '空性对战张无忌 · 分镜链路', status: 'running', assetTarget: '视频资产 / v3' },
  { id: 'run-002', mode: '视频短剧', title: '连续短剧人物设定复用', status: 'review_pending', assetTarget: '脚本资产 / v2' },
  { id: 'run-003', mode: '公众号', title: 'AI 工作流创业观察', status: 'archived', assetTarget: '图文资产 / v1' },
  { id: 'run-004', mode: '小红书', title: '咖啡馆运营种草笔记', status: 'queued', assetTarget: '图文资产 / v1' },
  { id: 'run-005', mode: '产品图', title: '社区首页视觉素材批处理', status: 'draft', assetTarget: '图片资产 / v4' },
  { id: 'run-006', mode: '知识库', title: '审核规则沉淀', status: 'archived', assetTarget: '知识条目 / v6' },
]

export const statusLabels: Record<GenerationStatus, string> = {
  draft: '草稿',
  queued: '排队中',
  running: '生成中',
  review_pending: '待审核',
  archived: '已归档',
}

export function getCreationPlan(mode: CreationMode) {
  return creationPlans[mode]
}

export function getTemplatesForMode(mode: CreationMode) {
  return promptTemplates.filter((template) => template.mode === mode)
}

export function getHistoryForMode(mode: CreationMode) {
  return generationHistory.filter((item) => item.mode === mode)
}
