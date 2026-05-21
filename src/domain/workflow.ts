export type WorkflowNodeType =
  | 'BriefInput'
  | 'PromptTemplate'
  | 'ChatGenerate'
  | 'ImageGenerate'
  | 'VideoGenerate'
  | 'ReviewGate'
  | 'AssetTransform'
  | 'PackageChannel'

export type WorkflowNodeRunStatus =
  | 'pending'
  | 'running'
  | 'waiting_review'
  | 'succeeded'
  | 'failed'
  | 'blocked'

export type WorkflowDefinitionNode = {
  id: string
  label: string
  type: WorkflowNodeType
  owner: string
  retryable: boolean
}

export type WorkflowDefinitionEdge = {
  id: string
  source: string
  target: string
}

export type WorkflowNodeRun = {
  nodeId: string
  status: WorkflowNodeRunStatus
  costCents: number
  durationSeconds: number
  retryCount: number
  maxRetries: number
  outputTarget?: string
  error?: string
}

export type WorkflowRun = {
  id: string
  title: string
  project: string
  status: 'pending' | 'running' | 'waiting_review' | 'succeeded' | 'failed' | 'canceled'
  triggerUser: string
  nodes: WorkflowDefinitionNode[]
  edges: WorkflowDefinitionEdge[]
  nodeRuns: WorkflowNodeRun[]
}

export const workflowNodeStatusLabels: Record<WorkflowNodeRunStatus, string> = {
  pending: '待执行',
  running: '执行中',
  waiting_review: '待人工审核',
  succeeded: '已完成',
  failed: '失败',
  blocked: '被阻塞',
}

export const workflowRun: WorkflowRun = {
  id: 'workflow-run-001',
  title: '短剧从 Brief 到交付包',
  project: '连续短剧生产线',
  status: 'waiting_review',
  triggerUser: 'Producer',
  nodes: [
    { id: 'brief', label: '创作 Brief', type: 'BriefInput', owner: 'Producer', retryable: false },
    { id: 'prompt', label: '提示词模板', type: 'PromptTemplate', owner: 'Producer', retryable: false },
    { id: 'chat', label: 'AI 对话策划', type: 'ChatGenerate', owner: 'Producer', retryable: true },
    { id: 'image', label: '生图批处理', type: 'ImageGenerate', owner: 'Producer', retryable: true },
    { id: 'video', label: '生视频渲染', type: 'VideoGenerate', owner: 'Producer', retryable: true },
    { id: 'review', label: '人工审核', type: 'ReviewGate', owner: 'Reviewer', retryable: false },
    { id: 'asset', label: '资产转码归档', type: 'AssetTransform', owner: 'System', retryable: true },
    { id: 'publish', label: '多平台打包', type: 'PackageChannel', owner: 'Owner', retryable: true },
  ],
  edges: [
    { id: 'brief-prompt', source: 'brief', target: 'prompt' },
    { id: 'prompt-chat', source: 'prompt', target: 'chat' },
    { id: 'chat-image', source: 'chat', target: 'image' },
    { id: 'chat-video', source: 'chat', target: 'video' },
    { id: 'image-review', source: 'image', target: 'review' },
    { id: 'video-review', source: 'video', target: 'review' },
    { id: 'review-asset', source: 'review', target: 'asset' },
    { id: 'asset-publish', source: 'asset', target: 'publish' },
  ],
  nodeRuns: [
    {
      nodeId: 'brief',
      status: 'succeeded',
      costCents: 0,
      durationSeconds: 22,
      retryCount: 0,
      maxRetries: 0,
      outputTarget: 'Brief / 第 12 集',
    },
    {
      nodeId: 'prompt',
      status: 'succeeded',
      costCents: 6,
      durationSeconds: 14,
      retryCount: 0,
      maxRetries: 0,
      outputTarget: 'PromptTemplate / 武侠冲突',
    },
    {
      nodeId: 'chat',
      status: 'succeeded',
      costCents: 38,
      durationSeconds: 68,
      retryCount: 0,
      maxRetries: 3,
      outputTarget: '脚本资产 / v3',
    },
    {
      nodeId: 'image',
      status: 'succeeded',
      costCents: 92,
      durationSeconds: 121,
      retryCount: 1,
      maxRetries: 3,
      outputTarget: '图片资产 / 海报 v4',
    },
    {
      nodeId: 'video',
      status: 'succeeded',
      costCents: 420,
      durationSeconds: 612,
      retryCount: 0,
      maxRetries: 3,
      outputTarget: '视频资产 / 分镜 v3',
    },
    {
      nodeId: 'review',
      status: 'waiting_review',
      costCents: 0,
      durationSeconds: 0,
      retryCount: 0,
      maxRetries: 0,
      outputTarget: 'ReviewGate / Reviewer 待处理',
    },
    {
      nodeId: 'asset',
      status: 'blocked',
      costCents: 0,
      durationSeconds: 0,
      retryCount: 0,
      maxRetries: 3,
      outputTarget: '成果库 / 待归档',
    },
    {
      nodeId: 'publish',
      status: 'blocked',
      costCents: 0,
      durationSeconds: 0,
      retryCount: 0,
      maxRetries: 3,
      outputTarget: '短视频渠道交付包',
    },
  ],
}

export function getWorkflowExecutionPlan(run: WorkflowRun = workflowRun) {
  const incomingCount = new Map(run.nodes.map((node) => [node.id, 0]))
  const outgoing = new Map<string, string[]>()

  run.edges.forEach((edge) => {
    incomingCount.set(edge.target, (incomingCount.get(edge.target) ?? 0) + 1)
    outgoing.set(edge.source, [...(outgoing.get(edge.source) ?? []), edge.target])
  })

  const queue = run.nodes.filter((node) => incomingCount.get(node.id) === 0).map((node) => node.id)
  const sortedIds: string[] = []

  while (queue.length > 0) {
    const nodeId = queue.shift()

    if (!nodeId) {
      continue
    }

    sortedIds.push(nodeId)

    for (const target of outgoing.get(nodeId) ?? []) {
      const nextCount = (incomingCount.get(target) ?? 0) - 1
      incomingCount.set(target, nextCount)

      if (nextCount === 0) {
        queue.push(target)
      }
    }
  }

  return sortedIds
}

export function getWorkflowRunSummary(run: WorkflowRun = workflowRun) {
  const totalCostCents = run.nodeRuns.reduce((total, nodeRun) => total + nodeRun.costCents, 0)
  const totalDurationSeconds = run.nodeRuns.reduce((total, nodeRun) => total + nodeRun.durationSeconds, 0)
  const waitingReviewCount = run.nodeRuns.filter((nodeRun) => nodeRun.status === 'waiting_review').length
  const blockedCount = run.nodeRuns.filter((nodeRun) => nodeRun.status === 'blocked').length
  const failedCount = run.nodeRuns.filter((nodeRun) => nodeRun.status === 'failed').length

  return {
    nodeCount: run.nodes.length,
    edgeCount: run.edges.length,
    executionOrder: getWorkflowExecutionPlan(run),
    totalCostCents,
    totalDurationSeconds,
    waitingReviewCount,
    blockedCount,
    failedCount,
  }
}

export function canRetryWorkflowNode(run: WorkflowRun, nodeId: string) {
  const definition = run.nodes.find((node) => node.id === nodeId)
  const nodeRun = run.nodeRuns.find((item) => item.nodeId === nodeId)

  return Boolean(
    definition?.retryable &&
      nodeRun &&
      nodeRun.status === 'failed' &&
      nodeRun.retryCount < nodeRun.maxRetries,
  )
}

export function getWorkflowNodeRun(run: WorkflowRun, nodeId: string) {
  return run.nodeRuns.find((nodeRun) => nodeRun.nodeId === nodeId)
}
