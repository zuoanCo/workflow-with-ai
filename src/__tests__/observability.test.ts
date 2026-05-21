import { describe, expect, it } from 'vitest'
import {
  formatMetricValue,
  getObservabilitySummary,
  observabilitySnapshot,
} from '../domain/observability'

describe('observability domain', () => {
  it('summarizes cost, failures, queue pressure, and risk count', () => {
    const summary = getObservabilitySummary(observabilitySnapshot)

    expect(summary.totalCostCents).toBe(23860)
    expect(summary.totalFailedTasks).toBe(8)
    expect(summary.totalWaiting).toBe(17)
    expect(summary.maxOldestWaitingSeconds).toBe(510)
    expect(summary.criticalRiskCount).toBe(1)
    expect(summary.lowestProviderSuccessRate).toBe(94.6)
  })

  it('formats monitor metric units for UI display', () => {
    expect(formatMetricValue(observabilitySnapshot.metrics[0])).toBe('¥238.60')
    expect(formatMetricValue(observabilitySnapshot.metrics[1])).toBe('12m')
    expect(formatMetricValue(observabilitySnapshot.metrics[2])).toBe('96.8%')
  })
})
