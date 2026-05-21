import { describe, expect, it } from 'vitest'
import { deliverableAssets } from '../domain/deliverable'
import {
  canPackageDeliverable,
  getPackagingBlockers,
  getPackagingSummary,
  packagingAdapters,
  packagingStatusLabels,
} from '../domain/packaging'

describe('packaging domain', () => {
  it('summarizes adapter readiness and required artifacts', () => {
    const summary = getPackagingSummary()

    expect(summary.total).toBe(packagingAdapters.length)
    expect(summary.ready).toBe(2)
    expect(summary.blocked).toBe(1)
    expect(summary.delivered).toBe(1)
    expect(summary.requiredArtifacts).toBe(14)
  })

  it('allows packaging only when deliverable and channel adapter are not blocked', () => {
    expect(canPackageDeliverable(deliverableAssets[0], '小红书')).toBe(true)
    expect(canPackageDeliverable(deliverableAssets[0], '短视频')).toBe(false)
    expect(canPackageDeliverable(deliverableAssets[3], 'Web')).toBe(false)
  })

  it('explains blockers from adapter, channel package, and review state', () => {
    expect(getPackagingBlockers(deliverableAssets[0], '短视频')).toEqual([
      '渠道适配器阻塞',
      '9:16 封面需审核通过',
    ])
    expect(getPackagingBlockers(deliverableAssets[3], 'Web')).toEqual([
      '桌面与移动端截图',
      '成果审核未通过',
    ])
  })

  it('uses explicit labels for adapter states', () => {
    expect(packagingStatusLabels.configured).toBe('已配置')
    expect(packagingStatusLabels.ready).toBe('可打包')
    expect(packagingStatusLabels.blocked).toBe('阻塞')
    expect(packagingStatusLabels.delivered).toBe('已交付')
  })
})
