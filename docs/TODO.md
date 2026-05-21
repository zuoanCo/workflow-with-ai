# Workflow AI 五阶段任务清单

当前正式阶段：阶段三 开发准备。  
当前代码状态：`src/` 中已有内容仅作为技术预研原型，正式开发需按 `docs/DESIGN.md` 拆解任务后执行。CEO 已授权 Lisen 代审批阶段门禁。

## 阶段一：需求（常威PM主导）

- [x] 收集 CEO 原始需求。
- [x] 提炼产品目标：可管理 AI 创作系统，支持多平台打包与 Web 端。
- [x] 提炼核心能力：账户管理、权限设置、数据监控、成果管理、AI 对话、AI 生图、AI 生视频、画布工作流。
- [x] 明确工程质量要求：高可维护性、高可测试性、高可扩展性、精美 UI。
- [x] 完成正式 PRD v1.0。
- [x] PRD 内审：检查背景、目标、用户故事、功能列表、非功能需求、优先级、风险。
- [x] CEO 审批 PRD：2026-05-21 16:14，CEO 授权 Lisen 代审批，PRD v1.0 通过。

阶段门禁：已通过，可进入阶段二设计。

## 阶段二：设计（农夫TA + 小笼包UI主导）

- [x] 技术架构方案 v1.0。
- [x] 数据模型设计。
- [x] API 接口设计。
- [x] AI Provider Adapter 设计。
- [x] 工作流引擎设计。
- [x] 多端打包方案设计。
- [x] 技术方案自审。
- [x] UI 信息架构与关键页面设计稿。
- [x] UI 自审。
- [x] CEO 或产品确认设计：2026-05-21 16:14，CEO 授权 Lisen 代审批，设计通过。

阶段门禁：已通过，可进入阶段三开发。

## 阶段三：开发（海飞丝FS主导）

- [x] 开发任务拆解：2026-05-21 16:40，按 PRD v1.0 与 DESIGN v1.0 输出 `docs/DEVELOPMENT_PLAN.md`，Lisen 基于 CEO 已授权阶段门禁代审批记录确认可执行。
- [x] 仓库分支策略与 PR 规则：2026-05-21 16:50，新增 `docs/BRANCH_AND_PR_RULES.md` 与 `.github/PULL_REQUEST_TEMPLATE.md`；Lisen 基于 CEO 已授权阶段门禁代审批记录确认该治理规则属于阶段三开发准备首项，可执行。
- [x] 账户与权限模块开发：2026-05-21 17:01，新增 `src/domain/rbac.ts` 领域规则、RBAC 单元测试和账户权限 UI 展示；Lisen 基于 CEO 已授权阶段三执行门禁确认该切片符合 `docs/DESIGN.md` 的 Auth/RBAC、项目授权与审计入口设计。
- [x] 创作工作台开发：2026-05-21 17:17，新增 `src/domain/creation.ts` 创作模式、模板、生成历史领域模型，扩展工作台 UI 的模式切换、Prompt 编排、模型路由、审核策略、资产目标、模板入口和生成历史；Lisen 基于 CEO 已授权阶段三执行门禁确认该切片符合 `docs/DESIGN.md` 的 Creation Studio、Prompt 输入、模板库、模型参数与生成历史结构设计。
- [x] AI 对话模块开发：2026-05-21 17:25，新增 `src/domain/chat.ts` 会话模型、提示词模板、模型路由与结果资产化边界，扩展工作台 AI 对话面板并补充单元测试；Lisen 基于 CEO 已授权阶段三执行门禁确认该切片符合 `docs/DESIGN.md` 的 AI 对话、Provider Adapter 边界和会话资产化设计。
- [x] AI 生图模块开发：2026-05-21 17:36，新增 `src/domain/image.ts` 生图批次、参考图、风格模板、版本状态与审核摘要模型，扩展工作台 AI 生图面板并补充单元测试；Lisen 基于 CEO 已授权阶段三执行门禁确认该切片符合 `docs/DESIGN.md` 的 ImageGenerate、参考图、风格模板、批量生成、版本对比和 ReviewGate 审核流转设计。
- [x] AI 生视频模块开发：2026-05-21 17:45，新增 `src/domain/video.ts` 生视频分镜、首尾帧、渲染队列、失败重试入口与审核目标模型，扩展工作台 AI 生视频面板并补充单元测试；Lisen 基于 CEO 已授权阶段三执行门禁确认该切片符合 `docs/DESIGN.md` 的 VideoGenerate、分镜、首尾帧、渲染队列、失败重试和 ReviewGate 审核流转设计。
- [x] 画布工作流模块开发：2026-05-21 17:58，新增 `src/domain/workflow.ts` 工作流 DAG、拓扑执行顺序、ReviewGate 阻塞、节点重试与运行摘要领域模型，扩展画布 UI 展示节点运行记录、成本、耗时、审核与阻塞状态，并补充单元测试；Lisen 基于 CEO 已授权阶段三执行门禁确认该切片符合 `docs/DESIGN.md` 的 Workflow Canvas、DAG 节点、ReviewGate、失败重试、成本耗时追踪和成果归档前置设计。
- [x] 成果管理模块开发：2026-05-21 18:09，新增 `src/domain/deliverable.ts` 成果状态、版本、返修记录、渠道交付包与审核入口领域模型，扩展成果管理 UI 展示版本、评分、审核人、返修计数和渠道包状态，并补充单元测试；Lisen 基于 CEO 已授权阶段三执行门禁确认该切片符合 `docs/DESIGN.md` 的 Deliverable、成果状态、版本、审核、返修和渠道打包记录设计。
- [x] 数据监控模块开发：2026-05-21 18:14，新增 `src/domain/observability.ts` 成本、耗时、Provider 成功率、队列状态与审核风险领域模型，扩展总览数据监控 UI 并补充单元测试；Lisen 基于 CEO 已授权阶段三执行门禁确认该切片符合 `docs/DESIGN.md` 的 Observability、成本、耗时、成功率、风险命中和队列状态设计。
- [x] 多平台打包能力开发：2026-05-21 18:26，新增 `src/domain/packaging.ts` 多平台打包适配器边界、渠道产物要求、阻塞原因与可打包判断，扩展多平台打包 UI 展示 Web、公众号、短视频、小红书、下载包状态，并补充单元与组件测试；Lisen 基于 CEO 已授权阶段三执行门禁确认该切片符合 `docs/DESIGN.md` 的多端打包、Channel Packaging Adapter、成果交付包与审核前置设计。
- [x] 单元测试：2026-05-21 18:33，完成阶段三测试收口验证，覆盖领域逻辑与工作台关键组件交互，共 10 个测试文件、36 个用例通过；同步通过 `npm run lint` 与 `npm run build`。Lisen 基于 CEO 已授权阶段三执行门禁确认该测试收口符合 `docs/DEVELOPMENT_PLAN.md` 的“领域逻辑、组件、关键交互测试”验收口径。
- [ ] PR 提交：2026-05-21 18:44，Lisen 基于 CEO 已授权阶段三执行门禁确认当前任务为阶段三第一个未完成项；已完成提交前验证 `npm run lint`、`npm run build`、`npm run test`，并已在本地分支 `feature/stage-three-workbench` 形成阶段三工作台提交。2026-05-21 18:53 自动巡检再次确认 `npm run lint`、`npm run build`、`npm run test` 通过，本地工作区干净；`main` 仍显示 `[origin/main: gone]`，当前环境仍无可用 GitHub 凭证/CLI，PR 提交阻塞于 GitHub 凭证。2026-05-21 19:02 自动巡检按阶段三门禁再次完成本地核查：本轮开始时分支 `feature/stage-three-workbench` 指向 `990b76a docs: record PR credential blocker checkpoint`，随后已提交本轮巡检记录；`main` 仍显示 `[origin/main: gone]`，`npm run lint`、`npm run build`、`npm run test` 均通过（10 个测试文件、36 个用例）。2026-05-21 19:13 自动巡检再次确认当前分支 `feature/stage-three-workbench` 指向 `3a40f2c docs: record 19:02 PR blocker checkpoint`；`main` 仍显示 `[origin/main: gone]`，远端为 `https://github.com/zuoanCo/workflow-with-ai.git`；`npm run lint`、`npm run build`、`npm run test` 均通过（10 个测试文件、36 个用例），本地工作区干净。未调用 `gh auth status`，未尝试 GitHub push/PR。下一小步：在具备 GitHub CLI 或等效凭证后推送阶段三 feature 分支并创建 PR。
- [ ] 代码评审 approval。

阶段门禁：PR 未获得 review approval，不得合入主分支。

## 阶段四：测试（特仑苏TE主导）

- [ ] 测试用例设计。
- [ ] 测试环境准备。
- [ ] 功能测试。
- [ ] 权限与安全测试。
- [ ] 工作流稳定性测试。
- [ ] 多端兼容性测试。
- [ ] 缺陷报告。
- [ ] 缺陷修复验证。
- [ ] 回归测试。
- [ ] 测试报告。

阶段门禁：P0/P1 缺陷未修复不得上线，测试用例覆盖率目标不低于 90%。

## 阶段五：上线（海飞丝FS + 农夫TA主导）

- [ ] 上线计划。
- [ ] 回滚方案。
- [ ] 上线评审。
- [ ] 生产部署。
- [ ] 功能验证。
- [ ] 监控检查。
- [ ] 上线报告。
- [ ] CEO 上线审批。

阶段门禁：未经 CEO 审批，不得上线。
