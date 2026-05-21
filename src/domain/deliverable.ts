export type DeliverableStatus =
  | 'draft'
  | 'generated'
  | 'review_pending'
  | 'approved'
  | 'rejected'
  | 'rework_required'
  | 'packaged'

export type DeliverableChannel = 'Web' | '微信公众号' | '短视频' | '小红书' | '下载包'

export type DeliverableVersion = {
  id: string
  label: string
  status: DeliverableStatus
  qualityScore: number
  reviewer: string
  notes: string
  createdAt: string
}

export type ReworkRecord = {
  id: string
  reason: string
  requestedBy: string
  targetVersion: string
  status: 'open' | 'resolved'
}

export type ChannelPackage = {
  channel: DeliverableChannel
  status: 'not_started' | 'ready' | 'blocked' | 'delivered'
  requirement: string
}

export type DeliverableAsset = {
  id: string
  title: string
  project: string
  owner: string
  assetType: 'text' | 'image' | 'video' | 'package'
  status: DeliverableStatus
  versions: DeliverableVersion[]
  reworkRecords: ReworkRecord[]
  channelPackages: ChannelPackage[]
}

export const deliverableStatusLabels: Record<DeliverableStatus, string> = {
  draft: '草稿',
  generated: '已生成',
  review_pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝',
  rework_required: '需返修',
  packaged: '已打包',
}

export const channelPackageStatusLabels: Record<ChannelPackage['status'], string> = {
  not_started: '未开始',
  ready: '可打包',
  blocked: '阻塞',
  delivered: '已交付',
}

export const deliverableAssets: DeliverableAsset[] = [
  {
    id: 'deliv-short-drama-poster',
    title: 'LibTV 风格短剧海报 A/B',
    project: '连续短剧生产线',
    owner: '少闲儿',
    assetType: 'image',
    status: 'review_pending',
    versions: [
      {
        id: 'poster-v4',
        label: 'v4',
        status: 'review_pending',
        qualityScore: 92,
        reviewer: 'Reviewer',
        notes: '肖像一致性待复核，标题安全区通过。',
        createdAt: '2026-05-21 17:30',
      },
      {
        id: 'poster-v3',
        label: 'v3',
        status: 'rework_required',
        qualityScore: 74,
        reviewer: 'Reviewer',
        notes: '标题区遮挡，需要重新构图。',
        createdAt: '2026-05-21 16:48',
      },
    ],
    reworkRecords: [
      {
        id: 'rework-title-safe-area',
        reason: '标题区遮挡主角手部，短视频封面可读性不足。',
        requestedBy: 'Reviewer',
        targetVersion: 'v3',
        status: 'resolved',
      },
    ],
    channelPackages: [
      { channel: '小红书', status: 'ready', requirement: '3:4 封面与九宫格首图' },
      { channel: '短视频', status: 'blocked', requirement: '9:16 封面需审核通过' },
    ],
  },
  {
    id: 'deliv-kongxing-video',
    title: '空性 vs 张无忌分镜视频',
    project: '连续短剧生产线',
    owner: '导演 Jime',
    assetType: 'video',
    status: 'generated',
    versions: [
      {
        id: 'video-v3',
        label: 'v3',
        status: 'generated',
        qualityScore: 87,
        reviewer: '待分配',
        notes: '镜头节奏完整，等待人工审核。',
        createdAt: '2026-05-21 17:42',
      },
    ],
    reworkRecords: [],
    channelPackages: [
      { channel: '短视频', status: 'not_started', requirement: '15 秒竖版 MP4' },
      { channel: 'Web', status: 'not_started', requirement: 'HLS 预览与缩略图' },
    ],
  },
  {
    id: 'deliv-ai-report-cover',
    title: 'AI 工作流创业报告封面',
    project: '产品增长素材',
    owner: 'Lisen',
    assetType: 'image',
    status: 'packaged',
    versions: [
      {
        id: 'cover-v2',
        label: 'v2',
        status: 'approved',
        qualityScore: 96,
        reviewer: 'Owner',
        notes: '构图、版权风险和渠道规范均通过。',
        createdAt: '2026-05-21 15:20',
      },
    ],
    reworkRecords: [],
    channelPackages: [
      { channel: '微信公众号', status: 'delivered', requirement: '头图 2.35:1' },
      { channel: '下载包', status: 'delivered', requirement: 'PNG + 元数据 JSON' },
    ],
  },
  {
    id: 'deliv-community-home',
    title: '社区首页导航改版素材',
    project: '产品增长素材',
    owner: '小笼包UI',
    assetType: 'package',
    status: 'rework_required',
    versions: [
      {
        id: 'home-v1',
        label: 'v1',
        status: 'rework_required',
        qualityScore: 74,
        reviewer: 'Reviewer',
        notes: '移动端信息密度过高，需要收敛入口。',
        createdAt: '2026-05-21 14:55',
      },
    ],
    reworkRecords: [
      {
        id: 'rework-mobile-density',
        reason: '移动端导航与搜索区拥挤，影响审核和下载操作。',
        requestedBy: 'Reviewer',
        targetVersion: 'v1',
        status: 'open',
      },
    ],
    channelPackages: [
      { channel: 'Web', status: 'blocked', requirement: '桌面与移动端截图' },
      { channel: '下载包', status: 'blocked', requirement: '设计源文件与导出素材' },
    ],
  },
]

export function getLatestDeliverableVersion(deliverable: DeliverableAsset) {
  return deliverable.versions[0]
}

export function getDeliverableSummary(deliverable: DeliverableAsset) {
  const latestVersion = getLatestDeliverableVersion(deliverable)
  const openReworkCount = deliverable.reworkRecords.filter((record) => record.status === 'open').length
  const readyChannelCount = deliverable.channelPackages.filter(
    (channel) => channel.status === 'ready' || channel.status === 'delivered',
  ).length
  const blockedChannelCount = deliverable.channelPackages.filter((channel) => channel.status === 'blocked').length

  return {
    latestVersionLabel: latestVersion?.label ?? '暂无版本',
    latestQualityScore: latestVersion?.qualityScore ?? 0,
    latestReviewer: latestVersion?.reviewer ?? '未分配',
    versionCount: deliverable.versions.length,
    openReworkCount,
    readyChannelCount,
    blockedChannelCount,
  }
}

export function canReviewDeliverable(deliverable: DeliverableAsset) {
  return deliverable.status === 'generated' || deliverable.status === 'review_pending'
}
