# Skill vs Plugin：有什么区别

在 Anthropic 的插件生态中，Skill（技能）和 Plugin（插件）是两个核心概念，但它们处于不同的抽象层级。简单来说：**Skill 是知识的原子单元，Plugin 是能力的交付包**。理解这个区别，能帮你更好地组织自己的 AI 工作流。

## Skill：领域知识的最小单位

Skill 是一个 **SKILL.md** 文件，用 Markdown 编写，包含特定任务的领域知识、操作步骤和最佳实践。它不需要任何代码或配置文件。

```yaml
# 一个典型的 Skill 文件结构
skill-name/
├── SKILL.md          # 核心：领域知识 + 操作指令
└── examples/         # 可选：示例输入输出
    └── example-1.md
```

Skill 的核心特征是 **自动激活（auto-activation）**。当你在对话中提及相关上下文时，Claude 会自动识别并加载对应的 Skill。例如，当你粘贴一段 Python 代码时，Claude 会自动激活"Python 代码审查"Skill，无需手动指定。

Skill 能包含的内容：
- 特定编程语言的编码规范
- 数据库查询的最佳实践
- 文档写作的风格指南
- 某个框架的常见问题排查步骤
- 领域特定的术语表和规则

## Plugin：打包好的能力单元

Plugin（插件）是 Skill 的升级版——它把多个 Skill、命令（commands）、连接器（connectors）和清单文件（manifest）打包成一个可分发、可安装的单元。

```
# 一个 Plugin 的典型结构
my-plugin/
├── manifest.json        # 插件元数据：名称、版本、描述、作者
├── skills/
│   ├── code-review/     # Skill 1
│   │   └── SKILL.md
│   └── git-log/        # Skill 2
│       └── SKILL.md
├── commands/
│   ├── review-pr.sh     # 命令：拉取 PR diff
│   └── commit-lint.sh   # 命令：检查提交信息
└── connectors/
    └── github-mcp.json  # MCP 连接器配置
```

Plugin 的核心特征是 **显式安装（explicit installation）**。用户需要主动安装一个 Plugin 来获取其能力，安装后所有包含的 Skill 和命令都会注册到环境中。

## 关键区别对比

| 维度 | Skill | Plugin |
|------|-------|--------|
| 本质 | 知识文档 | 功能包 |
| 文件格式 | 单个 SKILL.md | 多文件结构 + manifest |
| 激活方式 | 自动（上下文触发） | 手动（用户安装） |
| 包含内容 | 领域知识 + 指令 | Skills + 命令 + 连接器 + 配置 |
| 是否需要代码 | 不需要 | 可能包含可执行命令 |
| 分发方式 | 复制文件即可 | 通过注册表或 Git 仓库 |
| 可发现性 | 由 AI 自动发现 | 需用户主动查找 |
| 典型用途 | 语言规范、风格指南 | 完整的工作流自动化 |

## 类比：积木 vs 乐高套装

- **Skill 是积木**：一块积木就是一个独立的知识单元。你可以在任何对话中用它，也可以把它塞进不同的套装里。
- **Plugin 是乐高套装**：套装包含多块积木、搭建图纸（命令）和连接件（连接器）。你买一个套装，就能搭出一个完整的场景。

## Codex 中的对应概念

Anthropic 的 Codex 项目采用了类似的设计哲学，但术语略有不同：

- Codex 中的 **Directive** 对应 Skill——它是纯文本指令，告诉 AI 如何执行特定任务
- Codex 中的 **Module** 对应 Plugin——它打包了多个 Directives 和工具绑定

这种分层设计并非 Anthropic 独有。OpenAI 的 GPTs 中，Instructions 类似 Skill，而完整的 GPT（含 Knowledge 和 Actions）类似 Plugin。LangChain 的 Chains 和 Tools 组合也是同样的思路。

## 什么时候用什么

**用 Skill 的场景：**
- 你只想给 AI 一套特定的知识或规则
- 不需要外部工具或可执行命令
- 希望知识自动激活，无需用户操作
- 快速原型或个人使用

**用 Plugin 的场景：**
- 需要组合多个 Skill 完成复杂工作流
- 需要连接外部工具（GitHub、数据库等）
- 需要包含可执行命令或脚本
- 需要分发和共享给他人使用

理解 Skill 和 Plugin 的区别，本质上是理解"知识"和"能力"的区别。Skill 告诉 AI "知道什么"，Plugin 告诉 AI "能做什么"。两者结合，才是完整的 AI 增强工作流。
