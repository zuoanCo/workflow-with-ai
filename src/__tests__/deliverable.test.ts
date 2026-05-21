import { describe, expect, it } from 'vitest'
import {
  canReviewDeliverable,
  channelPackageStatusLabels,
  deliverableAssets,
  deliverableStatusLabels,
  getDeliverableSummary,
} from '../domain/deliverable'

describe('deliverable domain', () => {
  it('summarizes versions, rework records, and channel package state', () => {
    const summary = getDeliverableSummary(deliverableAssets[0])

    expect(summary.latestVersionLabel).toBe('v4')
    expect(summary.latestQualityScore).toBe(92)
    expect(summary.versionCount).toBe(2)
    expect(summary.openReworkCount).toBe(0)
    expect(summary.readyChannelCount).toBe(1)
    expect(summary.blockedChannelCount).toBe(1)
  })

  it('only exposes review entry for generated or review pending deliverables', () => {
    expect(canReviewDeliverable(deliverableAssets[0])).toBe(true)
    expect(canReviewDeliverable(deliverableAssets[1])).toBe(true)
    expect(canReviewDeliverable(deliverableAssets[2])).toBe(false)
    expect(canReviewDeliverable(deliverableAssets[3])).toBe(false)
  })

  it('uses explicit labels for deliverable and channel states', () => {
    expect(deliverableStatusLabels.rework_required).toBe('需返修')
    expect(deliverableStatusLabels.packaged).toBe('已打包')
    expect(channelPackageStatusLabels.delivered).toBe('已交付')
    expect(channelPackageStatusLabels.blocked).toBe('阻塞')
  })
})
