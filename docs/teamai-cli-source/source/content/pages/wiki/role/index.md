---
title: "角色（role）"
description: "成员的分工，决定他收到哪些命名空间的资源。"
---

# 角色（role）

## 一句话

写在 `manifest/roles.yaml` 里的分工身份，例如 `frontend`、`backend`、`pm`。

## 打个比方

像工牌颜色：戴蓝牌的进蓝区，戴绿牌的进绿区。

## 在这个项目里

```yaml
roles:
  - id: frontend
    resources:
      skills: [common, frontend]
      knowledge: [common, frontend]
```

成员 `teamai roles set frontend`，或由 `manifest/members.yaml` 分配。

## 常见误区

- **以为它是安全边界。** 不是。agent 以你的身份运行，你能改配置。它带来的是"经过评审的约定"。
- **以为设了就只收自己的。** 角色是减法，但共享根的仍然收，标签订阅的也会额外收。
