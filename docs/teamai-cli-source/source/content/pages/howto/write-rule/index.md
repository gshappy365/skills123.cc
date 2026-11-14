---
title: "写一条团队规则（含强制与目录型）"
description: "单文件、目录型、强制三条路，以及 paths 限定和 ${TEAMAI_RULE_DIR} 的用法。"
---

# 写一条团队规则（含强制与目录型）

## 单文件版：一条规矩一个文件

```bash
cat > ~/.claude/rules/api-style.md << 'EOF'
# API 风格

- 所有接口返回 { data, error } 结构
- 不要在 handler 里直接拼 SQL
- 新增接口必须补一条集成测试
EOF

teamai push
```

## 只对某些路径生效

```markdown
---
paths: ["src/api/**"]
---
（规则正文）
```

支持限定路径的工具会只在这些文件上生效；不支持的（比如 Codex 系列）会一直生效。

## 目录型版：规则带附件

```text
rules/api-style/
├─ RULE.md
├─ RULE.zh.md
├─ checklist.md
└─ examples/good-endpoint.ts
```

```markdown
<!-- rules/api-style/RULE.md -->
---
paths: ["src/api/**"]
---
按团队 API 风格写。新增接口前先读 ${TEAMAI_RULE_DIR}/checklist.md 和 ${TEAMAI_RULE_DIR}/examples/good-endpoint.ts。
```

`${TEAMAI_RULE_DIR}` 在 `pull` 时替换成交付目录的真实路径（正斜杠），所以附件能跟着走。

==标记文件名必须完全一致==：`RULE.md` 不是 `rule.md`。大小写在 macOS 上不敏感，但 teamai 是严格匹配的。

## 强制规则：成员删不掉

```yaml
# teamai.yaml
sharing:
  rules:
    enforced: [code-review-guide]
```

适合安全底线、提交规范这类"不接受商量"的。别把还在讨论的东西设成强制——那会让讨论变成对抗。

## 多语言版本

同一目录放 `RULE.zh.md` / `RULE.en.md`，按团队配置的 `language` 取同语言版本。
`RULE.md` 的 frontmatter 对所有语言生效。

## 你应该看到什么

`teamai list rules` 里能列出它；`pull` 后各工具 rules 目录里出现同名 `.md`。

## 注意

- 目录型规则交付到 `.teamai/delivered/rules/<名字>/`，不要在业务代码里 import 那个路径。
- `push` 不会从交付副本里提取改动，改规则要改仓库里的源文件。
