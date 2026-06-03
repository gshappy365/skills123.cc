# 什么是 Claude Code

Claude Code 是 Anthropic 推出的命令行 AI 编程助手（agentic CLI coding tool）。与传统的代码补全工具不同，Claude Code 能理解自然语言指令，自主规划执行步骤，调用各种工具完成复杂的开发任务。

## 核心定位

Claude Code 定位为开发者的"AI 结对程序员"——它运行在终端中，直接与你的代码库、Git 仓库和开发工具交互。它是**代理式（agentic）**的，意味着给定一个目标，它能自主决定需要做什么、按什么顺序做、用什么工具做。

## 关键特性

| 特性 | 说明 |
|---|---|
| 终端原生 | 直接在命令行中运行，与现有开发工作流无缝集成 |
| 代理式执行 | 理解目标，自主规划步骤，调用工具完成 |
| Skills 系统 | 通过 SKILL.md 文件扩展领域知识 |
| MCP 集成 | 通过 Model Context Protocol 连接外部工具 |
| 插件市场 | 支持安装社区和官方插件 |

## Skills 系统

Claude Code 首创了 **SKILL.md** 标准——用 Markdown 文件编码特定领域的知识和操作流程。当对话触及相关上下文时，Claude 自动加载对应的 Skill。这个标准已被 OpenAI Codex 等平台采纳，成为 AI 编程助手的通用扩展方式。

一个 Skill 就是一个目录，包含：
```
skill-name/
├── SKILL.md          # 核心：领域知识 + 操作指令
├── references/       # 详细参考文档（按需加载）
├── examples/         # 示例代码
└── scripts/          # 辅助脚本
```

## 与 Codex 的关系

Claude Code 和 OpenAI Codex 是目前两个主流的 AI 编程助手。两者都采用代理式架构，都支持 Skills/Plugins 扩展。Claude Code 的优势在于更成熟的 Skills 生态和 MCP 协议支持；Codex 的优势在于 OpenAI 的模型能力和更广泛的非开发者用户覆盖。

## 对开发者的意义

Claude Code 改变了开发者的工作方式。代码审查、调试、架构设计、文档编写——这些原本需要手动完成的任务，现在可以用自然语言描述，由 Claude Code 辅助完成。它不是一个替代品，而是一个放大器，让开发者能专注于更高层次的决策和设计。
