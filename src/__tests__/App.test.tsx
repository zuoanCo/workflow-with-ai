import { fireEvent, render, screen, within } from '@testing-library/react'
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

  it('shows multi-platform packaging adapter boundaries and readiness', () => {
    render(<App />)

    expect(screen.getByLabelText('打包能力摘要')).toBeInTheDocument()
    expect(screen.getByText(/公众号图文素材包/)).toBeInTheDocument()
    expect(screen.getByText(/短视频竖版交付包/)).toBeInTheDocument()
    expect(screen.getByText(/9:16 MP4 \/ 封面图 \/ 字幕 SRT \/ 风险审核记录/)).toBeInTheDocument()
    expect(screen.getAllByText('阻塞').length).toBeGreaterThan(0)
  })

  it('shows image generation batches, references, and review state', () => {
    render(<App />)

    expect(screen.getByText('参考图、批量生成与审核')).toBeInTheDocument()
    expect(screen.getByText('短剧海报')).toBeInTheDocument()
    expect(screen.getAllByText(/LibTV 风格短剧海报 A\/B/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/2 张参考图/).length).toBeGreaterThan(0)
    expect(screen.getByText(/待审 1 · 返修 1/)).toBeInTheDocument()
  })

  it('shows video storyboard, first-last frames, render queue, and retry entry', () => {
    render(<App />)

    expect(screen.getByText('分镜、首尾帧与渲染队列')).toBeInTheDocument()
    expect(screen.getByText('空性对战张无忌 · 15 秒分镜')).toBeInTheDocument()
    expect(screen.getByText('3 个分镜')).toBeInTheDocument()
    expect(screen.getAllByText(/首尾帧 完整/).length).toBeGreaterThan(0)
    expect(screen.getByText('失败节点可重试')).toBeInTheDocument()
  })

  it('shows deliverable versions, review entry, rework, and channel packages', () => {
    render(<App />)

    expect(screen.getByText('交付、审核、返修')).toBeInTheDocument()
    expect(screen.getAllByText('审核入口').length).toBeGreaterThan(0)
    expect(screen.getByText('v4')).toBeInTheDocument()
    expect(screen.getByText(/返修 0 · 可交付 1 · 阻塞 1/)).toBeInTheDocument()
    expect(screen.getByText('小红书 · 可打包')).toBeInTheDocument()
    expect(screen.getByText('微信公众号 · 已交付')).toBeInTheDocument()
  })

  it('shows observability metrics, provider health, queue pressure, and risks', () => {
    render(<App />)

    expect(screen.getByText('成本、耗时、成功率与风险')).toBeInTheDocument()
    expect(screen.getByText('今日模型成本')).toBeInTheDocument()
    expect(screen.getByText('¥238.60')).toBeInTheDocument()
    expect(screen.getByText('Seedance 视频路由')).toBeInTheDocument()
    expect(screen.getByText(/video · P95 12m · 失败 5/)).toBeInTheDocument()
    expect(screen.getByText('video-render')).toBeInTheDocument()
    expect(screen.getByText(/等待 7 · 运行 3 · 可重试 2/)).toBeInTheDocument()
    expect(screen.getByText('标题安全区')).toBeInTheDocument()
  })

  it('switches creation studio mode and refreshes plan details', () => {
    render(<App />)

    fireEvent.click(within(screen.getByRole('tablist', { name: '创作模式' })).getByRole('button', { name: '公众号' }))

    expect(screen.getByText('图文长稿')).toBeInTheDocument()
    expect(screen.getByText('公众号草稿素材包')).toBeInTheDocument()
    expect(screen.getByText('AI 工作流创业观察')).toBeInTheDocument()
  })
})
