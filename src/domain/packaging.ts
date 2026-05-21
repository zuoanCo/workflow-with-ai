import type { DeliverableAsset, DeliverableChannel } from './deliverable'

export type RuntimeSurface = 'Web' | 'PWA' | 'Desktop' | 'Mobile' | 'API Worker'

export type PackagingStatus = 'configured' | 'ready' | 'blocked' | 'delivered'

export type PackagingArtifact = {
  name: string
  format: string
  required: boolean
}

export type PackagingAdapter = {
  id: string
  channel: DeliverableChannel
  runtimeSurface: RuntimeSurface
  target: string
  status: PackagingStatus
  requirements: string[]
  artifacts: PackagingArtifact[]
  guardrails: string[]
}

export const packagingStatusLabels: Record<PackagingStatus, string> = {
  configured: '已配置',
  ready: '可打包',
  blocked: '阻塞',
  delivered: '已交付',
}

export const packagingAdapters: PackagingAdapter[] = [
  {
    id: 'web-preview-pack',
    channel: 'Web',
    runtimeSurface: 'Web',
    target: 'Web Console / PWA 预览',
    status: 'ready',
    requirements: ['HLS 或静态预览地址', '缩略图', '成果元数据 JSON'],
    artifacts: [
      { name: 'preview', format: 'responsive web route', required: true },
      { name: 'thumbnail', format: 'webp/png', required: true },
      { name: 'metadata', format: 'json', required: true },
    ],
    guardrails: ['成果需通过审核或明确处于内部预览'],
  },
  {
    id: 'wechat-article-pack',
    channel: '微信公众号',
    runtimeSurface: 'API Worker',
    target: '公众号图文素材包',
    status: 'delivered',
    requirements: ['头图 2.35:1', '正文图片 CDN URI', '标题与摘要'],
    artifacts: [
      { name: 'cover', format: 'jpg/png', required: true },
      { name: 'article-assets', format: 'zip', required: true },
      { name: 'draft-meta', format: 'json', required: true },
    ],
    guardrails: ['标题、摘要和封面需通过审核'],
  },
  {
    id: 'short-video-pack',
    channel: '短视频',
    runtimeSurface: 'Mobile',
    target: '短视频竖版交付包',
    status: 'blocked',
    requirements: ['9:16 MP4', '封面图', '字幕 SRT', '风险审核记录'],
    artifacts: [
      { name: 'video', format: 'mp4', required: true },
      { name: 'cover', format: 'png', required: true },
      { name: 'subtitle', format: 'srt', required: false },
    ],
    guardrails: ['未通过 ReviewGate 不允许外发'],
  },
  {
    id: 'xiaohongshu-pack',
    channel: '小红书',
    runtimeSurface: 'Mobile',
    target: '小红书图文/封面包',
    status: 'ready',
    requirements: ['3:4 封面', '九宫格图片', '标题标签'],
    artifacts: [
      { name: 'cover', format: 'png', required: true },
      { name: 'gallery', format: 'zip', required: true },
      { name: 'caption', format: 'md/json', required: true },
    ],
    guardrails: ['封面安全区和版权风险需通过'],
  },
  {
    id: 'download-archive-pack',
    channel: '下载包',
    runtimeSurface: 'Desktop',
    target: '桌面端本地归档包',
    status: 'configured',
    requirements: ['原始资产', '导出资产', '版本与审核记录'],
    artifacts: [
      { name: 'source-assets', format: 'zip', required: true },
      { name: 'exports', format: 'zip', required: true },
      { name: 'manifest', format: 'json', required: true },
    ],
    guardrails: ['包含审计与版本来源，便于离线交付追踪'],
  },
]

export function getPackagingSummary(adapters: PackagingAdapter[] = packagingAdapters) {
  return adapters.reduce(
    (summary, adapter) => {
      summary.total += 1
      summary.requiredArtifacts += adapter.artifacts.filter((artifact) => artifact.required).length

      if (adapter.status === 'ready') summary.ready += 1
      if (adapter.status === 'blocked') summary.blocked += 1
      if (adapter.status === 'delivered') summary.delivered += 1

      return summary
    },
    {
      total: 0,
      ready: 0,
      blocked: 0,
      delivered: 0,
      requiredArtifacts: 0,
    },
  )
}

export function findPackagingAdapter(channel: DeliverableChannel) {
  return packagingAdapters.find((adapter) => adapter.channel === channel)
}

export function canPackageDeliverable(deliverable: DeliverableAsset, channel: DeliverableChannel) {
  const adapter = findPackagingAdapter(channel)
  const channelPackage = deliverable.channelPackages.find((item) => item.channel === channel)

  return Boolean(
    adapter &&
      channelPackage &&
      adapter.status !== 'blocked' &&
      channelPackage.status !== 'blocked' &&
      deliverable.status !== 'rejected' &&
      deliverable.status !== 'rework_required',
  )
}

export function getPackagingBlockers(deliverable: DeliverableAsset, channel: DeliverableChannel) {
  const adapter = findPackagingAdapter(channel)
  const channelPackage = deliverable.channelPackages.find((item) => item.channel === channel)
  const blockers: string[] = []

  if (!adapter) blockers.push('缺少渠道适配器')
  if (!channelPackage) blockers.push('成果未配置该渠道包')
  if (adapter?.status === 'blocked') blockers.push('渠道适配器阻塞')
  if (channelPackage?.status === 'blocked') blockers.push(channelPackage.requirement)
  if (deliverable.status === 'rejected' || deliverable.status === 'rework_required') {
    blockers.push('成果审核未通过')
  }

  return blockers
}
