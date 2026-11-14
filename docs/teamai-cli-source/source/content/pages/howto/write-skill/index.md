---
title: "写一个团队 skill"
description: "目录型和单文件型两种写法、frontmatter 的最小要求，以及它最后落在哪。"
---

# 写一个团队 skill

## 最小可用

```bash
mkdir -p ~/.claude/skills/my-deploy-helper
cat > ~/.claude/skills/my-deploy-helper/SKILL.md << 'EOF'
---
name: my-deploy-helper
description: 帮助团队部署服务
---
# Deploy Helper

当用户请求部署时：
1. 确认当前分支不是 main
2. 跑 npm test
3. 跑 npm run build
4. 执行 ./deploy.sh
EOF

teamai push --skill ~/.claude/skills/my-deploy-helper
```

`name` 和 `description` 是**必需品**：少了 `description`，工具里的技能列表就是一片空白描述，别人不知道该不该用。
没有 frontmatter 时 `push` 会自动补，但补出来的描述通常很糟，==自己写==。

## 两种形态

| 形态 | 仓库里的样子 | 适合 |
| --- | --- | --- |
| 目录型（推荐） | `skills/<名字>/SKILL.md` + 附件 | 需要模板、示例、脚本 |
| 单文件型 | `skills/<名字>.md`（frontmatter 里必须有 `description`） | 一两段话就说完 |

只有 frontmatter 带 `description` 的单文件才算技能；`README.md` 和随手笔记不会被分发。

## 附件怎么引用

目录型技能里，附件跟着目录一起走，直接用相对路径：

```markdown
模板见 templates/pr.md，按它写 PR 描述。
```

## 交付后长什么样

每个工具都会拿到 `<名字>/SKILL.md`，位置在它自己的 skills 目录里。
Codex 这类会放到 `.agents/skills`，因为它两个目录都读，放一处才能让技能之间互相引用。

## 命名

- 用小写字母和连字符：`release-check`，不要 `Release_Check`。
- 名字即身份。改名字等于新资源，旧的那份会被当作"不再投递"。

## 注意

- 同一位置同时存在 `skills/greet.md` 和 `skills/greet/` → 两边都不投递，直接报错。
- 别在技能里写死绝对路径，别人的机器上不存在。
- 技能里的命令要能重复执行，团队成员会跑很多次。
