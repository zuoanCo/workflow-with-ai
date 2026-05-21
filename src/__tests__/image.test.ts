import { describe, expect, it } from 'vitest'
import {
  getImageBatchSummary,
  getStyleTemplateById,
  imageGenerationBatches,
  imageStatusLabels,
} from '../domain/image'

describe('AI image domain', () => {
  it('summarizes batch references, variants, and review state', () => {
    const summary = getImageBatchSummary(imageGenerationBatches[0])

    expect(summary.templateName).toBe('短剧海报')
    expect(summary.aspectRatio).toBe('9:16')
    expect(summary.referenceCount).toBe(2)
    expect(summary.variantCount).toBe(3)
    expect(summary.reviewReadyCount).toBe(1)
    expect(summary.blockedCount).toBe(1)
    expect(summary.bestVariantLabel).toBe('A 版')
  })

  it('keeps style templates queryable for image provider routing', () => {
    const template = getStyleTemplateById('style-xhs-gallery')

    expect(template?.providerRoute).toContain('ImageBatch')
    expect(template?.aspectRatio).toBe('3:4')
  })

  it('uses explicit labels for image task review flow statuses', () => {
    expect(imageStatusLabels.review_pending).toBe('待审核')
    expect(imageStatusLabels.rework_required).toBe('需返修')
  })
})
