---
title: "角色、项目、标签：谁收到什么"
description: "三个维度各自解决什么问题，以及「没设角色 = 全同步」这个最容易踩的坑。"
---

# 角色、项目、标签：谁收到什么

## 三个维度，别混着用

| 维度 | 回答的问题 | 定义在哪 | 谁来设 |
| --- | --- | --- | --- |
| [[角色\|Role：成员的分工，比如前端、后端、SRE]] | 这个人干什么活 | `manifest/roles.yaml` | 成员自己，或团队分配 |
| [[项目\|Project：正在做的服务，比如 checkout、billing]] | 这个目录在做什么 | `manifest/projects.yaml` | 成员在当前目录设 |
| 标签 | 这份资源属于哪个主题 | `tags.yaml` | 成员订阅 |

- **角色是减法**：设了角色，就只收到角色声明的命名空间。
- **项目也是减法**：设了项目，多收到项目声明的资源。
- **标签是加法**：订阅了才会额外拉，永远不排除任何东西。

## 角色：写一次，成员各取所需

```yaml
# manifest/roles.yaml
version: 1
roles:
  - id: frontend
    description: Web 工程师
    resources:
      knowledge: [common, frontend]   # rules/frontend/、claudemd/frontend/
      skills: [common, frontend]
      agents: [common, frontend]
```

成员这边：

```bash
teamai roles list
teamai roles set frontend
teamai pull
```

## 项目：一个目录，一套资源

```yaml
# manifest/projects.yaml
version: 1
projects:
  - id: checkout
    name: 收银台
    resources:
      knowledge: [checkout]
      skills: [checkout]
      env: [checkout]
      mcp: [checkout]
```

```bash
teamai projects set checkout
teamai pull
```

角色和项目是**正交**的：一个人可以既是 frontend，又在做 checkout，两份资源都收。

## ==最大的坑：没设角色等于全同步==

命名空间只对**设了角色**的成员生效。`primaryRole` 没设的人，会同步**全部**技能。

所以只写 `roles.yaml` 限定不了任何人。要在真正意义上收窄，还得有 `manifest/members.yaml`：

```yaml
# manifest/members.yaml
version: 1
members:
  alice: [frontend]
  bob: [backend, ki]
default: []      # 没列出的成员：只收共享资源
```

这个文件存在时：

- 生效角色由文件决定，`teamai roles set` 会被拒绝；
- 没列出的成员拿到 `default`，只收共享资源；
- 改动要走 PR 评审——==角色变更从此是一次有记录的团队决定==，而不是某人笔记本上的一条命令。

## 标签：自愿加法

```yaml
# tags.yaml
skills:
  hai-deploy: [hai, infra]
rules:
  code-style: [coding]
```

```bash
teamai tags list
teamai tags subscribe infra
teamai pull
```

适合"少数人需要、但不想为它建一个角色"的资源。

## 强制规则：成员删不掉的

```yaml
# teamai.yaml
sharing:
  rules:
    enforced: [code-review-guide]
```

被强制的规则，成员不能通过删除本地副本绕过 `pull`。适合安全底线、提交规范这类"不接受商量"的东西。

## 同名冲突会怎样

同名技能每个只落一个目录，所以只能给你一份。规则是：**活跃命名空间里的副本取代共享根的那份**；
两个命名空间都有时，按名字排序靠前的胜出，`pull` 会逐条说明跳过了哪一份。

真要让所有人同时拿到两份，就**改名**，比如 `skills/dev/release-staging/`。

## 你应该看到什么

`teamai roles list --json` 能看到 `source` 字段：`assigned`（文件分配的）、`default`、`local`（自己设的）、`none`。
`source` 是 `local` 但团队有 `members.yaml` 时，说明你还没被列进去，去找管理员。

## 下一步

[工作流、评分器与 benchmark](/guide/7-workflow/)。
