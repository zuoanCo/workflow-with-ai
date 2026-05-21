import { describe, expect, it } from 'vitest'
import { getCreationPlan, getHistoryForMode, getTemplatesForMode } from '../domain/creation'

describe('creation studio domain', () => {
  it('returns mode specific plan details', () => {
    const plan = getCreationPlan('公众号')

    expect(plan.title).toContain('公众号')
    expect(plan.modelRoute).toContain('ChatGenerate')
    expect(plan.outputTarget).toBe('公众号草稿素材包')
  })

  it('keeps templates and history scoped to the active creation mode', () => {
    const templates = getTemplatesForMode('视频短剧')
    const history = getHistoryForMode('视频短剧')

    expect(templates).toHaveLength(1)
    expect(templates[0].name).toBe('脚本与分镜')
    expect(history.length).toBeGreaterThan(0)
    expect(history.every((item) => item.mode === '视频短剧')).toBe(true)
  })
})
