---
title: "项目（project）"
description: "正在做的服务，决定这个目录额外收到哪些 env、mcp、learnings、docs。"
---

# 项目（project）

## 一句话

写在 `manifest/projects.yaml` 里的一条服务线，例如 `checkout`。

## 打个比方

像工位：你走到收银台那个工位，桌上是收银台的工具，不是账单系统的。

## 在这个项目里

```bash
teamai projects set checkout
teamai projects set            # 清除
teamai projects list
```

项目可以单独声明 `skills`、`env`、`hooks`、`mcp`、`models`、`docs`、`learnings`、`wiki`。

## 常见误区

- **以为和角色二选一。** 正交，两个都收。
- **以为换目录会自动换。** 要在那个目录里 `projects set`，选择存在该目录的配置里。
