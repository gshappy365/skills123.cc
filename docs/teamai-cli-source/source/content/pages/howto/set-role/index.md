---
title: "按分工限定谁能收到什么"
description: "roles.yaml 怎么写、成员怎么设、以及为什么只写 roles.yaml 限定不了任何人。"
---

# 按分工限定谁能收到什么

## 先理解一件事

命名空间**只对设了角色的人生效**。没设角色的人会同步全部资源。所以：

```text
只写 roles.yaml  →  限定不了任何人
roles.yaml + 大家都设了角色  →  才开始限定
roles.yaml + manifest/members.yaml  →  真正收窄
```

## 管理员：定义角色

```yaml
# manifest/roles.yaml
version: 1
roles:
  - id: frontend
    description: Web 工程师
    resources:
      knowledge: [common, frontend]
      skills: [common, frontend]
      agents: [common, frontend]
  - id: backend
    description: 服务端
    resources:
      knowledge: [common, backend]
      skills: [common, backend]
```

资源按目录放：`skills/frontend/xxx/SKILL.md`、`rules/frontend/xxx.md`。

## 成员：设一次

```bash
teamai roles list
teamai roles set frontend
teamai pull
```

## 团队强制分配（可选但推荐）

```yaml
# manifest/members.yaml
version: 1
members:
  alice: [frontend]
  bob: [backend, ki]
default: []
```

这个文件存在后：

- 角色由文件决定，`teamai roles set` 被拒绝；
- 没列出的成员只收共享资源；
- 改角色要提 PR 评审——==角色变更从此有记录==。

## 收回资源会发生什么

`pull` 会收回新命名空间之外、由 teamai 下发的副本。**你本地改过的会保留**，并提示出来。

## 应该看到什么

```bash
teamai roles list --json
```

`source` 字段告诉你角色从哪来：`assigned`（members.yaml）、`default`、`local`（自己设的）、`none`。

`source: local` 但团队有 `members.yaml`，说明你还没被列进去。

## 注意

- 角色是**减法**，项目也是减法，标签是加法。三样别混着用。
- 角色不是安全边界：agent 以你的身份运行，你能改配置文件。它给你的是"经过评审的约定"，不是强制执法。
