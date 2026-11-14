---
title: "一个目录一套资源"
description: "多服务团队怎么让 checkout 目录只拿到收银台相关的技能、env 和 MCP。"
---

# 一个目录一套资源

## 什么时候用

一个仓库里做好几个服务，或者你同时维护几个仓库，各自的技能、环境变量、MCP 都不一样。

## 管理员：定义项目

```yaml
# manifest/projects.yaml
version: 1
projects:
  - id: checkout
    name: 收银台
    resources:
      knowledge: [checkout]   # rules/checkout/、claudemd/checkout/
      skills: [checkout]
      learnings: [checkout]
      agents: [checkout]
      env: [checkout]         # env/checkout/env.yaml
      hooks: [checkout]
      mcp: [checkout]
      models: [checkout]
      docs: [checkout]
```

## 成员：在当前目录激活

```bash
teamai projects list
teamai projects set checkout
teamai pull
```

取消：

```bash
teamai projects set
```

## 和角色的关系

两者正交：你既是 `frontend`，又在做 `checkout`，两边的资源都收。
角色决定"你这类人需要什么"，项目决定"这个服务需要什么"。

## 应该看到什么

`teamai projects list` 里 `checkout` 标记为当前激活；`pull` 后 `env/checkout` 的变量只在这个目录下的 shell 里生效。

## 注意

- 项目资源激活后会写进本目录的配置，换目录就是另一套。
- workspace 里的多个仓库各自激活各自的项目，`pull` 在 workspace 根目录也能看到它们的名字。
