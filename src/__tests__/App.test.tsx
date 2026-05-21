import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'

describe('Workflow AI shell', () => {
  it('renders the core product modules', () => {
    render(<App />)

    expect(screen.getByText('AI 对话中枢')).toBeInTheDocument()
    expect(screen.getByText('AI 生图工坊')).toBeInTheDocument()
    expect(screen.getByText('AI 生视频流水线')).toBeInTheDocument()
    expect(screen.getAllByText('画布工作流').length).toBeGreaterThan(0)
  })

  it('shows governance and packaging surfaces', () => {
    render(<App />)

    expect(screen.getAllByText('RBAC 最小权限').length).toBeGreaterThan(0)
    expect(screen.getAllByText('交付、审核、返修').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Web 优先，多端扩展').length).toBeGreaterThan(0)
  })
})
