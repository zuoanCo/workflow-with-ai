# 上下文连续性与长任务续跑方案

## 问题

AI 开发任务可能因为上下文长度、会话中断、工具超时或模型切换导致执行状态丢失。产品研发必须把状态写入仓库，而不是依赖对话记忆。

## 方案

1. 仓库内固定维护 `docs/TODO.md`，所有阶段、任务、阻塞点都写入文件。
2. 每次开发前先读 `docs/TODO.md`、`docs/PRD.md`、`docs/ARCHITECTURE.md`。
3. 每次完成代码变更后运行最小验证：`npm run build`、`npm run test`。
4. 每次中断前更新任务状态，记录下一步。
5. 需要定时唤醒时，优先用外部任务调度读取本文件并恢复执行。

## 最差兜底：定时唤醒

如果任务很长，设置每 30 分钟一次的开发巡检：

- 拉取仓库状态。
- 读取 `docs/TODO.md`。
- 查找第一个未完成任务。
- 执行一个小步。
- 运行验证。
- 更新 `docs/TODO.md`。
- 向 CEO 汇报阶段性结果或阻塞点。

## 推荐恢复提示词

```text
继续开发 workflow-with-ai。先读取 docs/TODO.md、docs/PRD.md、docs/ARCHITECTURE.md 和 git status，找到第一个未完成任务，完成一个可验证的小步，运行 npm run build 和 npm run test，然后更新 docs/TODO.md 并汇报。
```
