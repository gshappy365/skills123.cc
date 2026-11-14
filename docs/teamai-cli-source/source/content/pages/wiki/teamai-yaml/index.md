---
title: "teamai.yaml（团队配置）"
description: "仓库根目录的团队配置文件：名字、评审人、强制规则、开关，都在这里。"
---

# teamai.yaml（团队配置）

## 一句话

团队仓库根目录的 YAML，描述「这个团队是谁、怎么分发」。

## 打个比方

像小区的**业主公约**：谁能进、哪些规矩不能改、快递放哪。

## 在这个项目里

```yaml
team: my-team
description: 团队 AI 资源仓库
repo: https://github.com/your-org/your-repo.git
provider: github
reviewers: [reviewer1]
packages:
  npm:
    - name: typescript
      version: "*"
sharing:
  rules:
    enforced: [code-review-guide]
  recall:
    enabled: false
  gitExclude:
    enabled: true
```

业务仓库自托管时它在 `.teamai/teamai.yaml`，并带 `mode: self`。

## 常见误区

- **把 `scope` 写进去。** 它写在这里会被忽略——装到哪由成员执行 `init --scope` 决定。
- **把密钥写进去。** 这里只放声明，不放值。
