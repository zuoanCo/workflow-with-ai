import { describe, expect, it } from 'vitest'
import {
  chatSessions,
  describeChatAssetBoundary,
  getAssetReadySessions,
  getTemplateById,
} from '../domain/chat'

describe('AI chat domain', () => {
  it('binds chat sessions to prompt templates and asset targets', () => {
    const session = chatSessions[0]
    const boundary = describeChatAssetBoundary(session)

    expect(boundary.templateName).toBe('短剧节奏拆解')
    expect(boundary.assetLabel).toBe('脚本资产')
    expect(boundary.contextCount).toBe(3)
    expect(boundary.target).toContain(session.resultAsset.version)
  })

  it('keeps asset-ready chat sessions queryable for deliverable ingestion', () => {
    const readySessions = getAssetReadySessions()

    expect(readySessions).toHaveLength(1)
    expect(readySessions[0].status).toBe('asset_ready')
    expect(readySessions[0].resultAsset.target).toBe('公众号草稿')
  })

  it('returns undefined for unknown templates instead of inventing a binding', () => {
    expect(getTemplateById('missing-template')).toBeUndefined()
  })
})
