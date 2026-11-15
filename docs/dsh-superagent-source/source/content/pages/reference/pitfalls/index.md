---
title: "新手最容易踩的 12 个坑"
description: "按现象排列的排查清单，每条给一句能马上做的动作。"
---

# 新手最容易踩的 12 个坑

## 配置与安装

**1 · 允许名单没加人。**默认准入表下，名单为空时没人能发起明确请求。→ Settings → Eval → On each Source，先把自己的登录名加进去；想让某个群人人可用，把那一行的「名单外 · 点名」改成 `explicit`。

**2 · 编辑 Issue 正文补 @。**来源不接收这种编辑，等于没发。→ 发一条**新评论**。

**3 · 升级时重跑 `--from-default-profile`。**这个命令只在全新安装跑一次，重跑会替换 profile 并删掉 `cordis.patch.yml`。→ 已有 profile 直接改文件。

**4 · 升级前没备份数据库。**迁移过的 `orchestrator.sqlite` 旧版本打不开，回滚不了。→ 先 `cp` 一份再 `git pull`。

**5 · 删了 `cordis.patch.yml` 里 worker / router 两行，或给个人会话选了这两个 preset。**恢复会话会报 `agent-preset/not-found`。→ 保持两行，别手动选。

## 判断与行为

**6 · 以为 `observe` 坏了。**默认模式下推断出来的工作只记「本来会接」，不真的接单。→ 去 Eval 页看决定；确认判断准了再考虑切 `auto`。

**7 · 指望机器人或普通账号的自动评审能派活。**机器人只能产生推断候选，不能 explicit、不能 stop；用普通账号跑的自动评审反而会被 host 当成「人」。→ 在团队提示词的 review bots 里点名。

**8 · 以为自动合并默认开着、审批由系统强制。**默认从不以智能体账号启用，host 也没有合并决策逻辑。→ 人工合并 + GitHub 分支保护并开启「新提交作废旧审批」。

**9 · 把 CLI 包装 / git 配置当安全沙箱。**执行器和主会话都以 `danger-full-access`、以操作者系统用户运行，能按绝对路径执行程序、读家目录。→ 用只含智能体凭证的专用系统账号。

## 看日志才懂的报错

| 日志里出现 | 意思与处理 |
| --- | --- |
| `… was not written by dsh-superagent` | `worker-bin` / `worker-gitconfig` 里混进了外部文件；移出去，或换一个 `stateDir` |
| `git does not read the github.com credential configuration dsh-superagent writes` | git 太旧；装 2.32+ |
| `The bot lark-cli allows user identities` | 飞书 CLI 配置太宽；换成只允许机器人身份的 strict mode |
| `The GitHub Source names no repository` | GitHub 卡片没填 `owner/name` |
| `The prepare command failed: …` | 输出里就是原因，常见是克隆路径错；改好后用 `Retry` |
| `… timed out after 90 s` / `… exited with code …` | CLI 失败但没打原因；用操作者账号手动跑那个程序，看它自己的报错 |
| `dsh-superagent configuration has keys it does not use` | 配置里有旧键；删掉被点名的那项（消息会告诉你它搬去哪了） |
| `Failed to load plugins`（DSH 升级后） | 重启正在运行的实例 |

## 日常使用

**10 · @ 了没动静就乱改设置。**正确顺序是：新评论？→ 名单？→ Source 开关？→ `Pause processing`？→ Trigger 有没有？→ Eval 的决定？→ 工单是否 failed。见 [@ 了没反应](/howto/no-response/)。

**11 · prepare 命令失败（多半是克隆路径写错）。**工单直接 `failed`。→ 看输出修命令，再用面板的 `Retry`。

**12 · 消息太吵，于是再发一条消息解释为什么吵。**每一条消息都在花同事的注意力，包括解释的那条。→ 把 Communication 改短、把交付标准改严、或者 `Pause processing`，别加消息。

<div class="tu-note tu-note--tip">
<strong>还有一条元规则</strong><p>想用提示词改权限、改身份、改工具参数校验，都是徒劳：那些由 host 和工具强制，提示词排在它们之后。要改行为，改设置和请求。</p>
</div>

## 相关

[命令与配置速查](/reference/commands/) · [常见问题](/faq/) · [把噪音调低](/howto/less-noise/)
