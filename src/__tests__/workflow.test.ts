import { describe, expect, it } from 'vitest'
import {
  canRetryWorkflowNode,
  getWorkflowExecutionPlan,
  getWorkflowRunSummary,
  workflowRun,
  workflowNodeStatusLabels,
  type WorkflowRun,
} from '../domain/workflow'

describe('workflow domain', () => {
  it('builds a topological execution plan for DAG nodes', () => {
    expect(getWorkflowExecutionPlan(workflowRun)).toEqual([
      'brief',
      'prompt',
      'chat',
      'image',
      'video',
      'review',
      'asset',
      'publish',
    ])
  })

  it('summarizes cost, duration, review gates, and blocked downstream nodes', () => {
    const summary = getWorkflowRunSummary(workflowRun)

    expect(summary.nodeCount).toBe(8)
    expect(summary.edgeCount).toBe(8)
    expect(summary.totalCostCents).toBe(556)
    expect(summary.totalDurationSeconds).toBe(837)
    expect(summary.waitingReviewCount).toBe(1)
    expect(summary.blockedCount).toBe(2)
    expect(summary.failedCount).toBe(0)
  })

  it('allows failed retryable nodes to retry while budget remains', () => {
    const failedRun: WorkflowRun = {
      ...workflowRun,
      nodeRuns: workflowRun.nodeRuns.map((nodeRun) =>
        nodeRun.nodeId === 'image'
          ? { ...nodeRun, status: 'failed', retryCount: 1, maxRetries: 3 }
          : nodeRun,
      ),
    }

    expect(canRetryWorkflowNode(failedRun, 'image')).toBe(true)
    expect(canRetryWorkflowNode(failedRun, 'review')).toBe(false)
  })

  it('uses explicit labels for execution and review states', () => {
    expect(workflowNodeStatusLabels.waiting_review).toBe('待人工审核')
    expect(workflowNodeStatusLabels.blocked).toBe('被阻塞')
  })
})
