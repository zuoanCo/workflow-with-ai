import { describe, expect, it } from 'vitest'
import { canPerformAction, getDeniedReason, hasPermission, projectAccess } from '../domain/rbac'

describe('RBAC domain rules', () => {
  it('allows Owner to manage sensitive organization capabilities', () => {
    expect(canPerformAction('Owner', 'inviteMember')).toBe(true)
    expect(canPerformAction('Owner', 'rotateProviderKey')).toBe(true)
    expect(canPerformAction('Owner', 'viewAuditLog')).toBe(true)
  })

  it('keeps Producer focused on project execution without key or audit access', () => {
    expect(canPerformAction('Producer', 'runWorkflow')).toBe(true)
    expect(canPerformAction('Producer', 'rotateProviderKey')).toBe(false)
    expect(canPerformAction('Producer', 'viewAuditLog')).toBe(false)
  })

  it('separates Reviewer approval rights from Viewer read-only rights', () => {
    expect(canPerformAction('Reviewer', 'approveDeliverable')).toBe(true)
    expect(canPerformAction('Viewer', 'approveDeliverable')).toBe(false)
    expect(hasPermission('Viewer', 'deliverable.read')).toBe(true)
  })

  it('returns clear denial reasons for unauthorized operations', () => {
    expect(getDeniedReason('Viewer', 'approveDeliverable')).toContain('缺少')
    expect(projectAccess.find((item) => item.role === 'Viewer')?.canReview).toBe(false)
  })
})
