# 上下文连续性与长任务续跑方案

## 问题

AI 开发任务可能因为上下文长度、会话中断、工具超时或模型切换导致执行状态丢失。产品研发必须把状态写入仓库，而不是依赖对话记忆。

## 方案

1. 仓库内固定维护 `docs/TODO.md`，所有阶段、任务、阻塞点都写入文件。
2. 每次恢复前先读 `docs/ENGINEERING_PROCESS.md`、`docs/TODO.md`、`docs/PRD.md`、`docs/ARCHITECTURE.md`。
3. 严格执行阶段门禁：当前阶段未通过审批，不得处理下一阶段事项。
4. 每次完成代码变更后运行最小验证：`npm run build`、`npm run test`。
5. 每次中断前更新任务状态，记录下一步。
6. 需要定时唤醒时，优先用外部任务调度读取本文件并恢复执行。

## 最差兜底：定时唤醒

如果任务很长，设置每 30 分钟一次的开发巡检：

- 拉取仓库状态。
- 读取 `docs/ENGINEERING_PROCESS.md` 和 `docs/TODO.md`。
- 判断当前阶段和门禁状态。
- 只处理当前阶段的第一个未完成任务。
- 若需要进入下一阶段，必须先汇报并等待 CEO 审批。
- 运行适用验证。
- 更新 `docs/TODO.md`。
- 向 CEO 汇报阶段性结果或阻塞点。

## 续跑记录

- 2026-05-21 19:02 CST：阶段三仍处于 PR 提交/代码评审门禁。已按续跑约束读取工程流程、TODO、PRD、设计、架构与 git 状态；本轮开始时 `feature/stage-three-workbench` 指向 `990b76a docs: record PR credential blocker checkpoint`，随后已提交本轮巡检记录；`main` 仍显示 `[origin/main: gone]`。本地验证 `npm run lint`、`npm run build`、`npm run test` 通过（10 个测试文件、36 个用例）。当前环境未检测和使用 GitHub 凭证，未尝试 push/PR；PR 提交阻塞于 GitHub 凭证。
- 2026-05-21 19:13 CST：阶段三仍处于 PR 提交/代码评审门禁。已按续跑约束读取工程流程、TODO、PRD、设计、架构、连续性文档与 git 状态；当前分支 `feature/stage-three-workbench` 指向 `3a40f2c docs: record 19:02 PR blocker checkpoint`，`main` 仍显示 `[origin/main: gone]`。本地验证 `npm run lint`、`npm run build`、`npm run test` 通过（10 个测试文件、36 个用例），工作区干净。未调用 `gh auth status`，未尝试 push/PR；PR 提交阻塞于 GitHub 凭证。
- 2026-05-21 19:23 CST：阶段三仍处于 PR 提交/代码评审门禁。已按续跑约束读取工程流程、TODO、PRD、设计、架构、连续性文档与 git 状态；当前分支 `feature/stage-three-workbench` 指向 `3401725 docs: record 19:13 PR blocker checkpoint`，`main` 仍显示 `[origin/main: gone]`，远端为 `https://github.com/zuoanCo/workflow-with-ai.git`。本地验证 `npm run lint`、`npm run build`、`npm run test` 通过（10 个测试文件、36 个用例），工作区干净。未调用 `gh auth status`，未尝试 push/PR；PR 提交阻塞于 GitHub 凭证。

## 推荐恢复提示词

```text
继续推进 workflow-with-ai。先读取 docs/ENGINEERING_PROCESS.md、docs/TODO.md、docs/PRD.md、docs/ARCHITECTURE.md 和 git status。严格遵守阶段门禁，只处理当前阶段的第一个未完成任务。若当前阶段未获 CEO 审批，不得进入下一阶段开发。完成后运行适用验证，更新 docs/TODO.md 并汇报。
```
