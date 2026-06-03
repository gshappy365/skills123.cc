# 什么是 Claude Cowork

Claude Cowork 是 Anthropic 推出的桌面端 AI 工作站（agentic desktop application），面向知识工作者设计。与 Claude Code 的终端界面不同，Cowork 提供完整的图形界面，让非开发者用户也能充分利用 Claude 的能力。

## 核心定位

Cowork 的目标是成为知识工作者的"AI 同事"——你设定目标，Cowork 交付完成的工作成果。它不只是一个聊天界面，而是一个**能理解你的工作上下文、连接你的工具、按你的工作方式交付结果**的 AI 工作站。

| 维度 | 说明 |
|---|---|
| 目标用户 | 分析师、营销人员、销售、法务、财务、产品经理 |
| 界面 | 桌面 GUI 应用 |
| 核心能力 | 理解上下文、连接工具、交付工作成果 |
| 扩展方式 | Plugins（技能 + 命令 + 连接器） |

## 与 Claude Code 的区别

| 维度 | Claude Cowork | Claude Code |
|---|---|---|
| 界面 | 桌面图形界面 | 命令行终端 |
| 目标用户 | 知识工作者（非开发者为主） | 开发者 |
| 交互方式 | 自然语言对话 + 可视化 | 命令行 + 自然语言 |
| 插件系统 | knowledge-work-plugins | 兼容同一套 Skills |
| 典型场景 | 写报告、分析数据、做 PPT | 写代码、审查 PR、调试 |

两者共享同一套 Skills 和 Plugins 生态——一个为 Cowork 编写的 Plugin 也可以在 Claude Code 中使用。

## Plugin 系统

Cowork 的能力通过 Plugins 扩展。每个 Plugin 打包了特定角色所需的：

- **Skills**：领域知识和最佳实践，Claude 自动在相关时加载
- **Commands**：用户主动触发的斜杠命令（如 `/review`、`/forecast`）
- **Connectors**：通过 MCP 协议连接到外部工具（CRM、数据库、Slack 等）

Anthropic 官方提供了覆盖销售、财务、法务、营销、数据、工程等 22 个角色的 Plugins，第三方合作伙伴（Slack、Zoom、Apollo 等）也在持续加入。

## 为什么重要

Cowork 代表了 AI 从"问答工具"到"工作协作者"的演进方向。它不再只是回答问题，而是理解你的工作目标、调用你的工具、按照你的工作方式交付成果。对于非开发者用户来说，Cowork 是接触 AI Agent 能力最自然的入口。
