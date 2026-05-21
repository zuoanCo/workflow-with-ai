export type VideoRenderStatus = 'queued' | 'rendering' | 'failed' | 'retry_ready' | 'review_pending' | 'approved'

export type StoryboardShot = {
  id: string
  label: string
  prompt: string
  durationSeconds: number
  camera: string
}

export type VideoFrameReference = {
  id: string
  label: string
  source: string
  kind: 'first_frame' | 'last_frame' | 'character' | 'style'
}

export type VideoRenderJob = {
  id: string
  title: string
  project: string
  owner: string
  status: VideoRenderStatus
  providerRoute: string
  queuePosition: number
  retryCount: number
  maxRetries: number
  failureReason?: string
  shots: StoryboardShot[]
  frameReferences: VideoFrameReference[]
  reviewTarget: string
}

export const videoStatusLabels: Record<VideoRenderStatus, string> = {
  queued: '排队中',
  rendering: '渲染中',
  failed: '渲染失败',
  retry_ready: '可重试',
  review_pending: '待审核',
  approved: '已通过',
}

export const videoRenderJobs: VideoRenderJob[] = [
  {
    id: 'video-job-001',
    title: '空性对战张无忌 · 15 秒分镜',
    project: '连续短剧生产线',
    owner: 'Producer',
    status: 'rendering',
    providerRoute: 'ChatGenerate -> VideoGenerate -> ReviewGate',
    queuePosition: 2,
    retryCount: 0,
    maxRetries: 3,
    shots: [
      {
        id: 'shot-001',
        label: '开场压迫',
        prompt: '寺门前低机位推进，空性缓慢抬手，强风压迫衣袖。',
        durationSeconds: 5,
        camera: '低机位推进',
      },
      {
        id: 'shot-002',
        label: '反击转折',
        prompt: '张无忌侧身闪避，首帧延续角色姿态，尾帧停在掌风碰撞。',
        durationSeconds: 6,
        camera: '横移跟拍',
      },
      {
        id: 'shot-003',
        label: '悬念收束',
        prompt: '尘土散开后露出两人背影，保留下一集悬念。',
        durationSeconds: 4,
        camera: '远景拉开',
      },
    ],
    frameReferences: [
      { id: 'frame-first', label: '首帧人物站位', source: '图片资产 / 海报 A 版', kind: 'first_frame' },
      { id: 'frame-last', label: '尾帧冲突定格', source: '分镜库 / 第 12 集', kind: 'last_frame' },
      { id: 'frame-style', label: '武侠短剧光影', source: '风格模板 / 暗场高反差', kind: 'style' },
    ],
    reviewTarget: '视频成果 / 第 12 集 / v3',
  },
  {
    id: 'video-job-002',
    title: 'AI 工作流创业报告 · 动态封面',
    project: '知道咖啡馆内容组',
    owner: 'Lisen',
    status: 'retry_ready',
    providerRoute: 'ImageGenerate -> VideoGenerate -> AssetTransform',
    queuePosition: 0,
    retryCount: 1,
    maxRetries: 3,
    failureReason: 'Provider 超时，已保留幂等键，可从失败节点重试。',
    shots: [
      {
        id: 'shot-004',
        label: '界面流转',
        prompt: '工作流节点从 Brief 到发布依次亮起，镜头保持后台工具质感。',
        durationSeconds: 4,
        camera: '平滑推近',
      },
      {
        id: 'shot-005',
        label: '指标聚焦',
        prompt: '成本、队列、审核风险三个指标以轻量动效进入画面。',
        durationSeconds: 4,
        camera: '定机位局部变焦',
      },
    ],
    frameReferences: [
      { id: 'frame-dashboard', label: '首帧 Dashboard', source: 'Web Console 截图', kind: 'first_frame' },
      { id: 'frame-cover', label: '尾帧公众号封面', source: '图片资产 / 封面 v2', kind: 'last_frame' },
    ],
    reviewTarget: '视频资产 / 公众号动态封面 / v1',
  },
]

export function canRetryVideoJob(job: VideoRenderJob) {
  return job.status === 'failed' || (job.status === 'retry_ready' && job.retryCount < job.maxRetries)
}

export function getVideoJobSummary(job: VideoRenderJob) {
  const totalDurationSeconds = job.shots.reduce((total, shot) => total + shot.durationSeconds, 0)
  const firstFrame = job.frameReferences.find((frame) => frame.kind === 'first_frame')
  const lastFrame = job.frameReferences.find((frame) => frame.kind === 'last_frame')

  return {
    shotCount: job.shots.length,
    totalDurationSeconds,
    frameReferenceCount: job.frameReferences.length,
    hasFirstAndLastFrame: Boolean(firstFrame && lastFrame),
    retryLabel: `${job.retryCount}/${job.maxRetries}`,
    canRetry: canRetryVideoJob(job),
  }
}
