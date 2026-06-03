# 什么是 Claude Code

Claude Code 是 Anthropic 推出的命令行 AI 编码代理工具（Agentic CLI Coding Tool）。与传统的代码补全工具不同，Claude Code 能理解自然语言指令，自主规划执行步骤，调用各种工具完成从代码编写到项目部署的完整开发任务。

## 核心定位

Claude Code 定位为开发者的"AI 结对程序员"——它运行在终端中，直接与你的代码库、Git 仓库和开发工具交互。它是代理式（agentic）的，意味着给定一个目标，它能自主决定需要做什么、按什么顺序做、用什么工具做。

## 关键特性

| 特性 | 说明 |
|------|------|
| 终端原生 | 直接在命令行中运行，与现有开发工作流无缝集成 |
| 代理式执行 | 理解目标，自主规划步骤，调用工具完成 |
| Skills 系统 | 通过 SKILL.md 文件扩展领域知识 |
| MCP 集成 | 通过 Model Context Protocol 连接外部工具 |
| 多环境支持 | 终端、VS Code、JetBrains、桌面应用、Web 均可使用 |

## Skills 技能系统

Claude Code 首创了 SKILL.md 标准——用 Markdown 文件编码特定领域的知识和操作流程。当对话触及相关上下文时，Claude 自动加载对应的 Skill。这个标准已被 OpenAI Codex 等平台采纳，成为 AI 编程助手的通用扩展方式。

一个 Skill 就是一个目录，包含以下结构：

```
skill-name/
├── SKILL.md          # 核心：领域知识 + 操作指令
├── references/       # 详细参考文档（按需加载）
├── examples/         # 示例代码
└── scripts/          # 辅助脚本
```

## MCP 集成

通过 Model Context Protocol (MCP)，Claude Code 可以连接外部数据源和工具。这意味着它可以读取 Google Drive 中的设计文档、更新 Jira 中的任务状态、从 Slack 中获取信息，或使用自定义的内部工具。MCP 是 Anthropic 推动的开放标准，旨在统一 AI 工具与外部系统的连接方式。

## 与 Cowork 的定位差异

Claude Code 专注于终端和 IDE 环境，服务于需要深度编码能力的开发者；Cowork 则提供图形界面，面向更广泛的职场用户。两者可以互补使用，覆盖从技术开发到业务协作的完整工作场景。

## 对开发者的意义

Claude Code 改变了开发者的工作方式。代码审查、调试、架构设计、文档编写——这些原本需要手动完成的任务，现在可以用自然语言描述，由 Claude Code 辅助完成。它不是一个替代品，而是一个放大器，让开发者能专注于更高层次的决策和设计。
