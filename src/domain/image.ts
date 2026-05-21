export type ImageGenerationStatus = 'queued' | 'generating' | 'review_pending' | 'approved' | 'rework_required'

export type ImageStyleTemplate = {
  id: string
  name: string
  scene: string
  providerRoute: string
  aspectRatio: '1:1' | '3:4' | '9:16' | '16:9'
}

export type ReferenceImage = {
  id: string
  name: string
  source: string
  usage: 'character' | 'product' | 'style' | 'layout'
}

export type ImageVariant = {
  id: string
  label: string
  status: ImageGenerationStatus
  qualityScore: number
  riskFlags: string[]
}

export type ImageGenerationBatch = {
  id: string
  title: string
  project: string
  owner: string
  prompt: string
  styleTemplateId: string
  references: ReferenceImage[]
  variants: ImageVariant[]
  reviewTarget: string
}

export const imageStatusLabels: Record<ImageGenerationStatus, string> = {
  queued: '排队中',
  generating: '生成中',
  review_pending: '待审核',
  approved: '已通过',
  rework_required: '需返修',
}

export const imageStyleTemplates: ImageStyleTemplate[] = [
  {
    id: 'style-short-drama-poster',
    name: '短剧海报',
    scene: '人物冲突、强标题区、竖版封面',
    providerRoute: 'OpenAI Image -> ReviewGate',
    aspectRatio: '9:16',
  },
  {
    id: 'style-product-scene',
    name: '产品场景',
    scene: '真实材质、品牌色、可商用背景',
    providerRoute: 'OpenAI Image -> AssetTransform',
    aspectRatio: '1:1',
  },
  {
    id: 'style-xhs-gallery',
    name: '小红书九宫格',
    scene: '封面钩子、多图叙事、统一视觉',
    providerRoute: 'PromptTemplate -> ImageBatch -> ReviewGate',
    aspectRatio: '3:4',
  },
]

export const imageGenerationBatches: ImageGenerationBatch[] = [
  {
    id: 'img-batch-001',
    title: 'LibTV 风格短剧海报 A/B',
    project: '连续短剧生产线',
    owner: 'Producer',
    prompt: '主角对峙、强烈戏剧冲突、适合短视频封面的高识别度海报。',
    styleTemplateId: 'style-short-drama-poster',
    references: [
      { id: 'ref-character', name: '主角设定 v2', source: '素材库 / 人物', usage: 'character' },
      { id: 'ref-layout', name: '竖版标题安全区', source: '渠道规则 / 抖音', usage: 'layout' },
    ],
    variants: [
      { id: 'variant-a', label: 'A 版', status: 'review_pending', qualityScore: 92, riskFlags: ['肖像一致性待复核'] },
      { id: 'variant-b', label: 'B 版', status: 'generating', qualityScore: 86, riskFlags: [] },
      { id: 'variant-c', label: 'C 版', status: 'rework_required', qualityScore: 74, riskFlags: ['标题区遮挡'] },
    ],
    reviewTarget: '成果库 / 短剧海报 / v4',
  },
  {
    id: 'img-batch-002',
    title: '社区首页视觉素材批处理',
    project: '产品增长素材',
    owner: '小笼包UI',
    prompt: '生成一组高密度后台产品场景图，用于 Web 首屏和功能模块图。',
    styleTemplateId: 'style-product-scene',
    references: [
      { id: 'ref-brand', name: '品牌色板', source: '设计系统', usage: 'style' },
      { id: 'ref-product', name: '现有 UI 截图', source: 'Web Console', usage: 'product' },
    ],
    variants: [
      { id: 'variant-a', label: 'A 版', status: 'approved', qualityScore: 95, riskFlags: [] },
      { id: 'variant-b', label: 'B 版', status: 'queued', qualityScore: 0, riskFlags: [] },
    ],
    reviewTarget: '图片资产 / 首页素材 / v2',
  },
]

export function getStyleTemplateById(templateId: string) {
  return imageStyleTemplates.find((template) => template.id === templateId)
}

export function getImageBatchSummary(batch: ImageGenerationBatch) {
  const template = getStyleTemplateById(batch.styleTemplateId)
  const reviewReadyCount = batch.variants.filter((variant) => variant.status === 'review_pending').length
  const blockedCount = batch.variants.filter((variant) => variant.status === 'rework_required').length
  const bestVariant = batch.variants.reduce<ImageVariant | undefined>((best, variant) => {
    if (!best || variant.qualityScore > best.qualityScore) {
      return variant
    }

    return best
  }, undefined)

  return {
    templateName: template?.name ?? '未绑定风格',
    aspectRatio: template?.aspectRatio ?? '1:1',
    referenceCount: batch.references.length,
    variantCount: batch.variants.length,
    reviewReadyCount,
    blockedCount,
    bestVariantLabel: bestVariant?.label ?? '暂无版本',
  }
}
