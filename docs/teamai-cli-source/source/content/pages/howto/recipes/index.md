---
title: "照抄就能用的场景清单"
description: "八个最常见的场景，每个给一句可以直接发出去的话，或一条命令。"
---

# 照抄就能用的场景清单

## 怎么用这页

把尖括号里的内容换掉，原样发出去。AI 工具里的用 `/teamai` 开头，终端里的用命令。

## 1. 从零搭建团队

```text
/teamai 帮我从零搭建团队的 TeamAI
```

它会问你仓库地址、要装到哪、给哪些工具装。

## 2. 加入已有团队

```text
/teamai 帮我加入团队的 TeamAI，仓库地址是 <repo-url>
```

## 3. 把本地 skill 分享出去

```text
/teamai 帮我把 <skill 名字> 分享给团队
```

## 4. 看看团队的资源

```bash
teamai list
teamai list skills --source repo
teamai list rules
```

## 5. 排查"我这边没有"

```bash
teamai doctor
teamai pull --dry-run
teamai pull --force
```

## 6. 团队网关统一模型

```text
/teamai 帮我把团队的模型网关切到 <配置名>
```

或者：

```bash
teamai models list
teamai models switch <配置名> --dry-run
teamai models switch <配置名>
```

## 7. 加一条所有人都躲不开的规则

```text
/teamai 帮我把 <规则名> 设成强制规则，成员不能删除
```

背后是 `teamai.yaml` 里的：

```yaml
sharing:
  rules:
    enforced: [<规则名>]
```

## 8. 打开本地看板

```text
/teamai 帮我打开 TeamAI 看板
```

或 `teamai dashboard`。

## 写法提醒

一句好指令通常包括三样：**要做什么 · 涉及哪个资源或哪个仓库 · 做完怎么算成功**。
最少也要有前两样，否则它会反问你，来回一轮反而更慢。
