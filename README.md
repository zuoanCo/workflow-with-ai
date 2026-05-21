# Workflow AI

可管理的 AI 创作系统原型，面向 AI 对话、AI 生图、AI 生视频、画布工作流、成果管理、权限控制、数据监控和多平台打包。

## 当前交付

- Web 端运营后台 UI。
- 创作工作台：多场景模式、Prompt 编排入口。
- 画布工作流：基于 `@xyflow/react` 的节点链路。
- 权限管理：RBAC 角色与权限展示。
- 成果管理：状态、渠道、负责人、质量分。
- 数据监控：任务数、成本、队列、风险命中。
- 多平台打包：Web、Desktop、Mobile、API Worker 路线。
- 工程文档：PRD、技术方案、任务清单、上下文续跑方案。
- 自动化验证：TypeScript 构建 + Vitest 组件测试。

## 本地运行

```bash
npm install
npm run dev
```

## 验证

```bash
npm run build
npm run test
```

## 文档

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/TODO.md`
- `docs/CONTINUITY.md`
