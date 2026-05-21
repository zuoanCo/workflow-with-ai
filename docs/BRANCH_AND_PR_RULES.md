# Workflow AI 仓库分支策略与 PR 规则 v1.0

状态：阶段三开发准备输出物。  
适用范围：Workflow AI 正式开发阶段的全部代码、文档和配置变更。  
审批依据：阶段一 PRD 与阶段二设计已通过门禁；CEO 赵遵凯已授权 Lisen 代审批阶段门禁；2026-05-21 16:50，Lisen 按 `docs/ENGINEERING_PROCESS.md`、`docs/TODO.md`、`docs/PRD.md` 与 `docs/DESIGN.md` 确认本规则属于阶段三第一个未完成开发准备任务，可执行。

## 1. 分支策略

| 分支 | 用途 | 规则 |
| --- | --- | --- |
| `main` | 受保护主分支，代表已通过评审与验证的可交付状态 | 禁止直接提交；只能通过 PR 合入 |
| `feature/<scope>-<summary>` | 新功能切片 | 必须关联 `docs/TODO.md` 当前阶段任务 |
| `fix/<scope>-<summary>` | 缺陷修复 | 必须描述影响范围、复现方式和验证结果 |
| `chore/<scope>-<summary>` | 工程配置、文档、构建脚本等治理变更 | 不得夹带业务功能 |
| `release/<version>` | 发布候选分支 | 仅用于上线阶段，经上线审批后创建 |
| `hotfix/<scope>-<summary>` | P0/P1 紧急修复 | 按 Hotfix 流程执行，48 小时内补复盘记录 |

分支命名要求：

- 使用小写英文、数字和连字符。
- `scope` 对应模块名，例如 `rbac`、`workflow`、`assets`、`packaging`、`docs`。
- 每个分支只处理一个可验证切片。

## 2. PR 必填内容

每个 PR 必须包含：

- 关联阶段与 TODO 项。
- 需求或设计依据。
- 变更摘要。
- 验证结果。
- 风险与回滚说明。
- 截图或录屏，仅 UI 变更需要。

`.github/PULL_REQUEST_TEMPLATE.md` 为标准模板。提交 PR 时不得删除其中的门禁检查项。

## 3. 合入门禁

正式合入 `main` 前必须满足：

- PR 至少获得 1 个 review approval。
- `npm run lint` 通过。
- `npm run build` 通过。
- `npm run test` 通过。
- 变更不得绕过当前阶段门禁。
- 涉及阶段切换时，必须在相关文档中记录审批依据。

若任一验证失败，当前切片不得标记完成，也不得推进下一项。

## 4. 评审要求

Reviewer 重点检查：

- 是否符合 `docs/PRD.md` 与 `docs/DESIGN.md`。
- 是否只处理当前阶段允许的任务。
- 是否有必要测试覆盖。
- 是否没有泄露密钥、令牌或敏感素材。
- 是否保持模块边界，避免页面组件堆业务逻辑。

## 5. 回滚规则

- 文档或配置类变更优先通过反向 PR 回滚。
- 功能代码回滚必须说明影响用户、数据和接口的范围。
- 涉及数据迁移、密钥、发布配置的变更，必须先给出回滚步骤再合入。

## 6. 本轮验证口径

本任务是工程治理文档与 PR 模板落地，不修改运行时代码。完成后运行：

```bash
npm run lint
npm run build
npm run test
```
