export type RoleName = 'Owner' | 'Producer' | 'Reviewer' | 'Viewer'

export type PermissionKey =
  | 'org.members.manage'
  | 'org.keys.manage'
  | 'org.metrics.read'
  | 'project.workflow.run'
  | 'project.assets.write'
  | 'project.metrics.read'
  | 'deliverable.review'
  | 'deliverable.rework'
  | 'deliverable.read'
  | 'audit.read'

export type SensitiveAction =
  | 'inviteMember'
  | 'rotateProviderKey'
  | 'runWorkflow'
  | 'approveDeliverable'
  | 'viewAuditLog'

export type RoleDefinition = {
  name: RoleName
  scope: string
  permissions: PermissionKey[]
  risk: '低' | '中' | '高'
}

export type ProjectAccess = {
  project: string
  role: RoleName
  canRunWorkflow: boolean
  canReview: boolean
  canReadAudit: boolean
}

export type AuditEntry = {
  actor: string
  action: SensitiveAction
  target: string
  result: '允许' | '拒绝'
  reason: string
}

export const permissionLabels: Record<PermissionKey, string> = {
  'org.members.manage': '成员管理',
  'org.keys.manage': '密钥管理',
  'org.metrics.read': '组织监控',
  'project.workflow.run': '运行工作流',
  'project.assets.write': '写入资产',
  'project.metrics.read': '项目数据',
  'deliverable.review': '成果审核',
  'deliverable.rework': '退回返修',
  'deliverable.read': '查看成果',
  'audit.read': '审计日志',
}

export const actionLabels: Record<SensitiveAction, string> = {
  inviteMember: '邀请成员',
  rotateProviderKey: '轮换模型密钥',
  runWorkflow: '运行工作流',
  approveDeliverable: '审核通过成果',
  viewAuditLog: '查看审计日志',
}

const actionRequirements: Record<SensitiveAction, PermissionKey> = {
  inviteMember: 'org.members.manage',
  rotateProviderKey: 'org.keys.manage',
  runWorkflow: 'project.workflow.run',
  approveDeliverable: 'deliverable.review',
  viewAuditLog: 'audit.read',
}

export const roleDefinitions: RoleDefinition[] = [
  {
    name: 'Owner',
    scope: '组织级',
    permissions: [
      'org.members.manage',
      'org.keys.manage',
      'org.metrics.read',
      'project.workflow.run',
      'project.assets.write',
      'project.metrics.read',
      'deliverable.review',
      'deliverable.rework',
      'deliverable.read',
      'audit.read',
    ],
    risk: '高',
  },
  {
    name: 'Producer',
    scope: '项目级',
    permissions: ['project.workflow.run', 'project.assets.write', 'project.metrics.read', 'deliverable.read'],
    risk: '中',
  },
  {
    name: 'Reviewer',
    scope: '成果级',
    permissions: ['deliverable.review', 'deliverable.rework', 'deliverable.read', 'project.metrics.read'],
    risk: '低',
  },
  {
    name: 'Viewer',
    scope: '只读',
    permissions: ['deliverable.read', 'project.metrics.read'],
    risk: '低',
  },
]

export function hasPermission(role: RoleName, permission: PermissionKey) {
  return roleDefinitions.find((item) => item.name === role)?.permissions.includes(permission) ?? false
}

export function canPerformAction(role: RoleName, action: SensitiveAction) {
  return hasPermission(role, actionRequirements[action])
}

export function getDeniedReason(role: RoleName, action: SensitiveAction) {
  if (canPerformAction(role, action)) {
    return '已授权'
  }

  return `${role} 缺少「${permissionLabels[actionRequirements[action]]}」权限`
}

export const projectAccess: ProjectAccess[] = roleDefinitions.map((role) => ({
  project: role.name === 'Owner' ? '全部项目' : role.name === 'Producer' ? '短剧流水线' : '成果审核池',
  role: role.name,
  canRunWorkflow: canPerformAction(role.name, 'runWorkflow'),
  canReview: canPerformAction(role.name, 'approveDeliverable'),
  canReadAudit: canPerformAction(role.name, 'viewAuditLog'),
}))

export const auditEntries: AuditEntry[] = [
  {
    actor: 'Owner / Lisen',
    action: 'rotateProviderKey',
    target: 'OpenAI Provider Key',
    result: '允许',
    reason: '组织级密钥管理权限',
  },
  {
    actor: 'Producer / 少闲儿',
    action: 'runWorkflow',
    target: '短剧流水线',
    result: '允许',
    reason: '项目级工作流运行权限',
  },
  {
    actor: 'Viewer / 访客',
    action: 'approveDeliverable',
    target: '公众号封面图',
    result: '拒绝',
    reason: getDeniedReason('Viewer', 'approveDeliverable'),
  },
]
