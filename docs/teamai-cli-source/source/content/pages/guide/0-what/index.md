---
title: "它到底是什么"
description: "三层能力、仓库里有什么、和「每个人自己配」的差别，以及它明确不是什么。"
---

# 它到底是什么

## 一个仓库，三种用途

官方的说法是「基于 Git 打造三层能力」。翻成人话：

| 层 | 干什么 | 你什么时候会碰到 |
| --- | --- | --- |
| **Team Execution**（正式） | 让每个 Agent 按团队的方式工作：skills、rules、culture、agents、hooks、mcp、workflows、env、models | 日常，90% 的时间都在这层 |
| **Team Context**（beta） | 让 Agent 知道团队已经踩过什么坑：learnings、代码知识图谱、teamwiki | 你想让它"先查一下别人怎么做的"时 |
| **Team Improvement**（beta） | 把每次干的活沉淀回团队：usage、sessions、scorers、benchmarks | 想量化"用了之后到底好了多少"时 |

新手只看第一层就够。后两层是加了会更强的部分，没开也能正常用。

## 团队仓库里有什么

仓库按「资源类型」分目录，一个目录一类东西：

```text
teamai.yaml         团队自己的配置（名字、仓库地址、评审人、包、开关）
skills/             技能：<名字>/SKILL.md
rules/              规则：<名字>.md
claudemd/           共享指令（用 AGENTS.md 约定的团队可以叫 agentsmd/）
agents/             智能体：<名字>.yaml
culture.md          团队文化与做事方式
env/env.yaml        环境变量（密钥只写 key，不写值）
hooks/hooks.yaml    钩子
mcp/mcp.yaml        MCP server
models/models.yaml  模型网关配置
docs/               团队文档（pull 会同步）
learnings/          beta：团队经验
teamwiki/           beta：代码知识图谱
workflows/          beta：工作流
scorers/            beta：评分标准
manifest/           角色、项目、成员分配
```

==目录名就是协议。== 你把 `SKILL.md` 放对位置，它就知道这是技能；放错地方，它就不认。

## 它怎么把东西送到你手上

```text
管理员 push → 分支 + PR → 评审合并
                              ↓
        你的 AI 工具开会话 → SessionStart 钩子 → teamai pull
                              ↓
              skills/ rules/ agents/ hooks/ mcp/ 落到各工具目录
```

两个关键点：

- **中心只有 Git。** 没有数据库、没有服务端；权限就是 Git 权限。
- **落地是"投影"。** 仓库是源，工具目录是投影。你改投影，`pull` 不会粗暴覆盖，会保留并提示；要贡献回去就 `push`。

## 它明确不是什么

<div class="tu-note tu-note--warn">
<strong>三个常见误解</strong>
<p><strong>不是提示词仓库。</strong>它不生成内容，只负责把已有内容分发到正确位置。</p>
<p><strong>不是 SaaSS 后台。</strong>没有中心服务器，团队仓库就是全部事实来源。</p>
<p><strong>不是沙箱。</strong>被分发的 hooks 会真的在你的机器上跑命令，这也是为什么审批要严。</p>
</div>

## 你已经知道和它还差什么

- 你知道「skills、rules 该长什么样」——差的是"怎么统一"。→ 第 5 步 [pull 之后文件落在哪](/guide/4-pull/)
- 你知道「团队该有规范」——差的是"谁收到哪一份"。→ 第 6 步 [角色、项目、标签](/guide/6-scope/)
- 你知道「这东西得有人维护」——差的是"出问题怎么查"。→ 第 9 步 [诊断与维护](/guide/8-maintain/)

## 下一步

[动手前先准备好四样东西](/guide/1-prepare/)。
