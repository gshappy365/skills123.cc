---
title: "用标签做自愿订阅"
description: "不想为少数人的资源建角色时，用标签：不订阅就没有，订阅了才额外拉。"
---

# 用标签做自愿订阅

## 标签和角色的区别

| | 角色 | 标签 |
| --- | --- | --- |
| 方向 | 减法（只收声明的） | 加法（额外收订阅的） |
| 谁定 | 团队定义，成员选 | 团队打标，成员订阅 |
| 用途 | 分工边界 | 兴趣 / 专项 |

## 管理员：打标签

```yaml
# tags.yaml
skills:
  hai-deploy: [hai, infra]
rules:
  code-style: [coding]
```

```bash
teamai tags add skills hai-deploy hai infra
teamai tags add rules code-style coding
```

## 成员：订阅

```bash
teamai tags list
teamai tags subscribe infra
teamai pull
```

取消：

```bash
teamai tags unsubscribe infra
teamai pull
```

## 语义边界

- 没订阅任何标签时，标签**完全不参与**分发。
- 订阅之后，带这些标签的 skill 和 rule 也会拉下来。
- **没打标签的仍按角色和项目发**——标签永远不会排除东西。

## 注意

- 标签从来不用于限制。想限定，用命名空间 + 角色。
- 标签存在团队仓库的 `tags.yaml` 里，改它要走 PR。
