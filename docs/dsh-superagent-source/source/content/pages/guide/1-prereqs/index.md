---
title: "准备环境"
description: "照着清单核对依赖、版本和三个账号，避免装到一半才发现缺东西。"
---

# 准备环境

## 依赖清单

版本来自 `package.json` 的 `engines` 与 `SETUP.md`。缺哪一个都不会变成追问，而是被列进安装计划里补上。

| 依赖 | 要求 | 检查命令 |
| --- | --- | --- |
| Node.js | `^22.19.0 \|\| >=24.0.0` | `node -v` |
| pnpm | 仓库指定 `pnpm@11.7.0` | `pnpm -v` |
| git | 2.32+（要用到 worktree） | `git --version` |
| tmux | 让服务在后台持续运行 | `tmux -V` |
| Python | 3.8+ | `python3 --version` |
| GitHub CLI | 2.48+ | `gh --version` |
| DSH | `engines.dsh: ^0.2.1-alpha.2` | `dsh --version` |
| 模型提供方 | DSH 至少跑通过一次带模型的会话 | 用一次 DSH 试试 |

可选：仓库用了 Git LFS 就装 `git-lfs`；接飞书需要 `lark-cli`（文档提到测过 1.0.90）。

<div class="tu-note tu-note--warn">
<strong>只支持 github.com</strong><p>文档明确写了不支持 GitHub Enterprise Server。来源的命令行包装必须指向 <code>gh</code> 或 <code>lark-cli</code> 的封装。</p>
</div>

## 一次探测就够了

`SETUP.md` 让智能体在问第一个问题之前只跑一次这条探测，结果自己留着，不拿来问你：

```
node -v; pnpm -v; git --version; tmux -V; python3 --version; gh --version | head -1; dsh --version
gh api user --jq .login
command -v lark-cli
grep -l -E 'id: dsh-superagent\b' "${DSH_HOME:-$HOME/.dsh}"/profiles/*/cordis.patch.yml 2>/dev/null
```

最后一行是在找**以前装过的 profile**：如果已有带 `dsh-superagent` 的配置，安装会问你要不要沿用，而不是重新生成一份把旧配置覆盖掉。

## 三个身份，别混在一起

| 身份 | 用途 | 注意 |
| --- | --- | --- |
| 操作者（你） | 日常用 DSH、审 PR、合并 | `gh api user` 查到的就是它，会被推荐成允许名单里唯一的人 |
| 智能体账号 | 它写评论、开 PR 用的 GitHub 账号 | 一定是单独的账号，别用你自己的；还不存在也没关系，创建是你要做的一步 |
| 自动合并账号（可选） | 若开了自动合并，用另一个有合并权限的账号登录 CLI | 默认不开，不用准备 |

另外，如果开了飞书，还要一个机器人应用和它的密钥——这些都在你自己的终端里完成，不要贴进聊天。

## 安全边界，先想清楚

执行器和主会话都以 `danger-full-access`、以操作者的系统用户运行。配置里的 CLI 包装和 git 配置只是**默认选哪套凭证**，不是安全边界：它仍能按绝对路径执行程序、读到操作者的家目录。

<div class="tu-note tu-note--warn">
<strong>要真隔离，请用专用系统账号</strong><p>给智能体一个只放它自己凭证的操作系统账号，是文档里给出的做法。不要指望包装脚本挡住什么。</p>
</div>

## 你应该看到什么

探测结果里，Node、pnpm、git、tmux、Python、gh、dsh 都有版本号，`gh api user` 能返回你的登录名。缺的项被列进计划，而不是让你一个个去猜。

## 下一步

[第 2 步：安装与第一次启动](/guide/2-install/)。
