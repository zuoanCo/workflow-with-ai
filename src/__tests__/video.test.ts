import { describe, expect, it } from 'vitest'
import {
  canRetryVideoJob,
  getVideoJobSummary,
  videoRenderJobs,
  videoStatusLabels,
} from '../domain/video'

describe('AI video domain', () => {
  it('summarizes storyboard shots, frames, duration, and retry state', () => {
    const summary = getVideoJobSummary(videoRenderJobs[0])

    expect(summary.shotCount).toBe(3)
    expect(summary.totalDurationSeconds).toBe(15)
    expect(summary.frameReferenceCount).toBe(3)
    expect(summary.hasFirstAndLastFrame).toBe(true)
    expect(summary.retryLabel).toBe('0/3')
    expect(summary.canRetry).toBe(false)
  })

  it('marks retry-ready jobs as retryable while retry budget remains', () => {
    const retryJob = videoRenderJobs[1]

    expect(canRetryVideoJob(retryJob)).toBe(true)
    expect(getVideoJobSummary(retryJob).retryLabel).toBe('1/3')
  })

  it('uses explicit labels for video queue and review flow statuses', () => {
    expect(videoStatusLabels.rendering).toBe('渲染中')
    expect(videoStatusLabels.retry_ready).toBe('可重试')
    expect(videoStatusLabels.review_pending).toBe('待审核')
  })
})
