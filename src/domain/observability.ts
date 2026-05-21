export type MetricTrend = 'up' | 'down' | 'flat'

export type MetricHealth = 'healthy' | 'warning' | 'critical'

export type ObservabilityMetric = {
  id: string
  label: string
  value: number
  unit: string
  target: number
  trend: MetricTrend
  health: MetricHealth
}

export type ProviderHealth = {
  provider: string
  taskType: 'chat' | 'image' | 'video'
  successRate: number
  p95LatencySeconds: number
  costCents: number
  failedTasks: number
}

export type QueueSnapshot = {
  name: string
  waiting: number
  running: number
  oldestWaitingSeconds: number
  retryableFailures: number
}

export type RiskSignal = {
  id: string
  label: string
  severity: MetricHealth
  hitRate: number
  owner: string
}

export type ObservabilitySnapshot = {
  metrics: ObservabilityMetric[]
  providers: ProviderHealth[]
  queues: QueueSnapshot[]
  risks: RiskSignal[]
}

export const observabilityHealthLabels: Record<MetricHealth, string> = {
  healthy: '健康',
  warning: '预警',
  critical: '严重',
}

export const trendLabels: Record<MetricTrend, string> = {
  up: '上升',
  down: '下降',
  flat: '稳定',
}

export const observabilitySnapshot: ObservabilitySnapshot = {
  metrics: [
    {
      id: 'daily-cost',
      label: '今日模型成本',
      value: 23860,
      unit: 'cents',
      target: 30000,
      trend: 'up',
      health: 'healthy',
    },
    {
      id: 'p95-latency',
      label: 'P95 任务耗时',
      value: 742,
      unit: 'seconds',
      target: 900,
      trend: 'flat',
      health: 'healthy',
    },
    {
      id: 'success-rate',
      label: 'Provider 成功率',
      value: 96.8,
      unit: 'percent',
      target: 95,
      trend: 'up',
      health: 'healthy',
    },
    {
      id: 'risk-hit-rate',
      label: '审核风险命中',
      value: 2.4,
      unit: 'percent',
      target: 3,
      trend: 'down',
      health: 'warning',
    },
  ],
  providers: [
    {
      provider: 'OpenAI 文本路由',
      taskType: 'chat',
      successRate: 98.2,
      p95LatencySeconds: 32,
      costCents: 3860,
      failedTasks: 2,
    },
    {
      provider: 'Seedance 视频路由',
      taskType: 'video',
      successRate: 94.6,
      p95LatencySeconds: 742,
      costCents: 16400,
      failedTasks: 5,
    },
    {
      provider: 'MagicAPI 图片路由',
      taskType: 'image',
      successRate: 97.4,
      p95LatencySeconds: 118,
      costCents: 3600,
      failedTasks: 1,
    },
  ],
  queues: [
    {
      name: 'video-render',
      waiting: 7,
      running: 3,
      oldestWaitingSeconds: 244,
      retryableFailures: 2,
    },
    {
      name: 'image-batch',
      waiting: 4,
      running: 5,
      oldestWaitingSeconds: 86,
      retryableFailures: 1,
    },
    {
      name: 'review-gate',
      waiting: 6,
      running: 1,
      oldestWaitingSeconds: 510,
      retryableFailures: 0,
    },
  ],
  risks: [
    {
      id: 'portrait-consistency',
      label: '角色肖像一致性',
      severity: 'warning',
      hitRate: 1.6,
      owner: 'Reviewer',
    },
    {
      id: 'title-safe-area',
      label: '标题安全区',
      severity: 'critical',
      hitRate: 0.8,
      owner: '小笼包UI',
    },
  ],
}

export function formatMetricValue(metric: ObservabilityMetric) {
  if (metric.unit === 'cents') {
    return `¥${(metric.value / 100).toFixed(2)}`
  }

  if (metric.unit === 'seconds') {
    return `${Math.round(metric.value / 60)}m`
  }

  if (metric.unit === 'percent') {
    return `${metric.value.toFixed(1)}%`
  }

  return String(metric.value)
}

export function getObservabilitySummary(snapshot: ObservabilitySnapshot = observabilitySnapshot) {
  const totalCostCents = snapshot.providers.reduce((total, provider) => total + provider.costCents, 0)
  const totalFailedTasks = snapshot.providers.reduce((total, provider) => total + provider.failedTasks, 0)
  const totalWaiting = snapshot.queues.reduce((total, queue) => total + queue.waiting, 0)
  const maxOldestWaitingSeconds = Math.max(...snapshot.queues.map((queue) => queue.oldestWaitingSeconds))
  const criticalRiskCount = snapshot.risks.filter((risk) => risk.severity === 'critical').length
  const lowestProviderSuccessRate = Math.min(...snapshot.providers.map((provider) => provider.successRate))

  return {
    totalCostCents,
    totalFailedTasks,
    totalWaiting,
    maxOldestWaitingSeconds,
    criticalRiskCount,
    lowestProviderSuccessRate,
  }
}
