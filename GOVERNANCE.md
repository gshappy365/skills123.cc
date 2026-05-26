# Harness Eval 治理框架

本项目的治理参考 [Meta_Kim](https://github.com/KimYx0207/Meta_Kim) 治理框架的轻量应用版（方案 A）。

## 核心理念

Meta_Kim 的 8 阶段执行骨架、3 层记忆系统、10 Dealing Cards 在此简化为：

| 原始概念 | 轻量版 |
|---|---|
| 8 阶段执行骨架 | **4 阶段：Clarify → Plan & Dispatch → Execute & Verify → Learn** |
| 3 层记忆系统 | **1 层：Markdown 决策记录** (`.claude/projects/harness-eval/memory/`) |
| 10 Dealing Cards | **5 张：Clarify, Plan, Execute, Review, Learn** |
| 9 Specialist Meta-Agents | **4 角色：Orchestrator, Builder, Guard, Memory** |

## 4 阶段执行骨架

```
Clarify → Plan & Dispatch → Execute & Verify → Learn
```

| 阶段 | 对应实践 |
|---|---|
| **Clarify** | Issue 模板 / PR 模板明确定义变更范围和意图 |
| **Plan & Dispatch** | CI 自动化（YAML 校验、type-check）自动规划质量门禁 |
| **Execute & Verify** | Build + smoke test + base path 校验，确保变更正确 |
| **Learn** | 决策记录（decision log）沉淀每次重要决策 |

## 5 Dealing Cards

| Card | 触发条件 | 对应机制 |
|---|---|---|
| **Clarify** | 新 Issue / 新 PR | Issue 模板 / PR 模板 |
| **Plan** | 提交变更 | CI 自动校验 YAML + TypeScript 类型 |
| **Execute** | CI 校验通过 | Build + smoke test |
| **Review** | PR Review | CODEOWNERS 自动分配 reviewer |
| **Learn** | 重要决策 | 写入 `.claude/projects/harness-eval/memory/decisions.md` |

## 质量门禁

所有 PR 合并前必须通过以下检查：

| 门禁 | 检查内容 | 实现 |
|---|---|---|
| YAML 有效性 | `projects.yaml` / `dimensions.yaml` 解析正确，必需字段完整 | `deploy.yml` validate job |
| TypeScript 类型 | Astro/TS 类型一致 | `npx astro check` |
| Smoke test | 数据完整性校验 | `npm test` (`scripts/smoke-test.mjs`) |
| Build | 站点构建无错误 | `npm run build` |
| 无硬编码路径 | 构建产物中无 `/skills123.cc` | grep 检测 |

## 评分时效性

定性评分应至少每季度 review 一次。每个项目在 `projects.yaml` 中有 `lastReviewed` 字段记录最近 review 日期。

## 角色

| 角色 | 职责 |
|---|---|
| **Orchestrator** | 维护者（`@gshappy365`），协调 PR 合并和治理流程 |
| **Builder** | 贡献者，通过 Issue 模板提交新项目 |
| **Guard** | CI 自动化，执行质量门禁 |
| **Memory** | 决策记录，保持项目知识连续性 |

## 相关文件

- [PR 模板](.github/PULL_REQUEST_TEMPLATE.md)
- [Issue 模板](.github/ISSUE_TEMPLATE/submit-project.yml)
- [决策记录](.claude/projects/harness-eval/memory/decisions.md)
