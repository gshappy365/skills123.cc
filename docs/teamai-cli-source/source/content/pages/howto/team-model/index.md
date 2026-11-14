---
title: "用团队网关统一模型"
description: "团队发一份网关配置，成员 switch 一下，密钥仍留在各自机器上。"
---

# 用团队网关统一模型

## 团队这边：写一份 profile

```yaml
# models/models.yaml
profiles:
  - id: tokenhub
    name: Tencent TokenHub
    base_url: https://tokenhub.tencentmaas.com
    api_key: ${API_KEY}
    model_groups:
      - protocols: [anthropic, openai-chat-completions]
        models:
          - glm-5.3
          - deepseek-v4-flash
```

两条硬规则：

- `api_key` **必须**写成 `${API_KEY}` 这种形式，值不能进仓库。
- `base_url` 不要以 `/v1` 结尾。

第一个模型是默认。

## 成员这边：两步

```bash
teamai models list
teamai models switch tokenhub --dry-run
teamai models switch tokenhub
```

密钥放环境变量，不要写进命令参数：

```bash
teamai models configure tokenhub --from-env TOKENHUB_API_KEY
printf '%s' "$TOKENHUB_API_KEY" | teamai models configure tokenhub --api-key-stdin
```

只想切某一个工具：

```bash
teamai models switch tokenhub --agent claude
teamai models switch --agent claude --model deepseek-v4-flash
```

## 它能改哪些工具

`switch` 写入的是各工具自己的配置：Claude Code 写 `~/.claude/settings.json`，Codex 写 `~/.codex/config.toml`，
CodeBuddy / WorkBuddy 写 `models.json`，其它工具各有落点。协议不匹配的会被跳过——比如配置里没有
`openai-responses`，就不会改 Codex。

## 想还原

```bash
teamai models restore
teamai models restore --agent codex
```

它只还原 teamai 改过的字段。==你自己手动改过的，之后的 switch 和 restore 会跳过==，不会跟你抢。

## 注意

- 换了网关地址要重新 `switch`，否则 agent 还指着旧地址。
- 个人配置用 `teamai models add`，id 不能和团队的撞名，撞了就写 `local:<id>`。
