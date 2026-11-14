---
title: "新手最容易踩的 12 个坑"
description: "按现象排列的排查清单，每条给一句能马上做的动作。"
---

# 新手最容易踩的 12 个坑

## 配置与安装

**1 · 允许名单没加人。**名单为空，任何请求都成不了工单。→ Settings → Eval → On each Source，先把自己的登录名加进去。

**2 · 编辑 Issue 正文补 @。**来源不接收这种编辑，等于没发。→ 发一条**新评论**。

**3 · 升级时重跑 `--from-default-profile`。**这个命令只在全新安装跑一次，重跑会替换 profile 并删掉 `cordis.patch.yml`。→ 已有 profile 直接改文件。

**4 · 升级前没备份数据库。**迁移过的 `orchestrator.sqlite` 旧版本打不开，回滚不了。→ 先 `cp` 一份再 `git pull`。

**5 · 删了 `cordis.patch.yml` 里 worker / router 两行，或给个人会话选了这两个 preset。**恢复会话会报 `agent-preset/not-found`。→ 保持两行，别手动选。

## 判断与行为

**6 · 以为 `observe` 坏了。**默认模式下推断出来的工作只记「本来会接」，不真的接单。→ 去 Eval 页看决定；确认判断准了再考虑切 `auto`。

**7 · 指望机器人或普通账号的自动评审能派活。**机器人只能产生推断候选，不能 explicit、不能 stop；用普通账号跑的自动评审反而会被 host 当成「人」。→ 在团队提示词的 review bots 里点名。

**8 · 以为自动合并默认开着、审批由系统强制。**默认从不以智能体账号启用，host 也没有合并决策逻辑。→ 人工合并 + GitHub 分支保护并开启「新提交作废旧审批」。

**9 · 把 CLI 包装 / git 配置当安全沙箱。**执行器和主会话都以 `danger-full-access`、以操作者系统用户运行，能按绝对路径执行程序、读家目录。→ 用只含智能体凭证的专用系统账号。

## 日常使用

**10 · @ 了没动静就乱改设置。**正确顺序是：新评论？→ 名单？→ Source 开关？→ `Pause processing`？→ Trigger 有没有？→ Eval 的决定？→ 工单是否 failed。见 [@ 了没反应](/howto/no-response/)。

**11 · prepare 命令失败（多半是克隆路径写错）。**工单直接 `failed`。→ 看输出修命令，再用面板的 `Retry`。

**12 · 消息太吵，于是再发一条消息解释为什么吵。**每一条消息都在花同事的注意力，包括解释的那条。→ 把 Communication 改短、把交付标准改严、或者 `Pause processing`，别加消息。

<div class="tu-note tu-note--tip">
<strong>还有一条元规则</strong><p>想用提示词改权限、改身份、改工具参数校验，都是徒劳：那些由 host 和工具强制，提示词排在它们之后。要改行为，改设置和请求。</p>
</div>

## 相关

[命令与配置速查](/reference/commands/) · [常见问题](/faq/) · [把噪音调低](/howto/less-noise/)
