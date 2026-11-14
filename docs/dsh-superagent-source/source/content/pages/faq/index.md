---
title: "常见问题"
description: "要钱吗、是官方产品吗、安全吗、为什么 @ 了没反应、升级会不会丢配置。"
---

# 常见问题

## 先把最重要的一条说在前面

<div class="tu-note tu-note--warn">
<strong>本站是非官方的中文入门教程</strong><p>项目本身是 DeepSeek 团队公开的研究原型，仓库 README 明确写着「不是 DeepSeek 官方产品」。本站由第三方整理，内容依据公开仓库的 <code>docs/</code> 编号文档写成；命令、版本与行为请以<a href="https://github.com/deepseek-ai/dsh-superagent-prototype">官方仓库</a>为准。</p>
</div>

## 它是免费的吗？要钱吗？

仓库是 MIT 许可，代码本身免费。但它跑在 DeepSeek Harness 上，要配模型提供方，模型调用、机器和你的时间都是成本。而且它会自己评估、自己检查、可能同时跑几份工作，==比一次普通对话更费 token==。小改动用它不划算。

## 是 DeepSeek 官方产品吗？能用在生产环境吗？

都不是。README 写得很清楚：研究原型、仅供参考、可能有 bug、工程实践也不一致，发布版本与内部版本、与论文《Exploring Super-agent Design》里描述的实现都不完全相同；论文里谈到的一些设计只是未来方向，这个原型没实现。请在自己的环境里先审一遍再改着用。

## 不会写代码能用吗？

看你想做什么。[新手入门三课](/start/) 是给不写代码、只和 AI 聊过天的人写的，学会 @ 它、看面板、合并 PR 就够。但要把它装起来、长期维护，需要有命令行基础，或者有一个能读 `SETUP.md` 的编码智能体带你做。

## 能接几个仓库？支持 GitHub Enterprise 吗？

一个实例对着**一个** GitHub 仓库。文档明确不支持 GitHub Enterprise Server（GHES），只支持 github.com。想多仓库，得各跑一份实例。

## 必须用飞书吗？

不用。飞书是可选来源，只接 GitHub 完全能跑，也是本站推荐的第一步。见 [只接 GitHub](/howto/github-only/)。

## 它会乱改我的代码、自己合并吗？

默认不会自己合并。自动合并在安装时就推荐选「不要」，而且默认从不以智能体账号启用；真要开还得在 `Delivery requirements` 里点名另一个账号的 CLI，并满足一串条件（工单自己的 PR、就绪、审批覆盖 head commit、增删合计小于 200 行）。要强制人工审，用 GitHub 分支保护并开启「新提交作废旧审批」。

至于改代码范围：执行器会自己判断范围，所以**把「不能碰的地方」写进请求**很重要；跑偏了在原对话回一句就能拉回。见 [圈住改动范围](/howto/scope/)。

## 它安全吗？

要如实说：执行器和主会话都以 `danger-full-access`、以操作者的系统用户运行。配置里的 CLI 包装和 git 配置只是「默认选哪套凭证」，**不是安全边界**——它仍能按绝对路径执行程序、读到操作者的家目录。文档给的隔离做法是：用只放智能体凭证的专用操作系统账号。另外允许名单、准入表、工具参数校验由 host 强制，提示词改不了这些。

## 为什么我 @ 了没反应？

按这张顺序查：是不是发成了新评论（编辑正文补 @ 无效）→ 发的人在不在允许名单 → Source 开没开 → 是不是 `Pause processing` → Trigger 页有没有触发 → Eval 页的决定是什么。完整表在 [@ 了没反应](/howto/no-response/)。最常见的两个答案是「名单没加人」和 `observe` 模式下只记「本来会接」。

## 为什么它说「本来会接」却什么都没做？

因为默认是 `observe` 模式：推断出来的工作照常评估，但只记录、不真的开工单。明确点名的请求不受影响。先去 Eval 页看这些判断准不准，再决定要不要切 `auto`。见 [只记录不动手](/howto/observe/)。

## 能让它 24 小时自己跑吗？

可以，但要给「能判断过或不过的完成标准」而不是「做四小时」，留一个遇到卡住就问的逃生口，并让它记决定日志。第二天先读需要注意的地方、审决定。另外建议配一个每小时自检的定时任务（在你日常用的 profile 里），并且用 `--respect-stop`，别把人工暂停的活又拉起来。见 [一次较大的改动](/howto/big-change/) 与 [用熟以后](/guide/8-tune/)。

## 消息太多、太吵怎么办？

顺序是：把 Communication 写短 → 把 Ticket scope / Delivery requirements 写严 → `Pause processing` → 收窄允许名单。**不要再加一条消息去解释为什么发太多消息**，那条本身也是噪音。见 [把噪音调低](/howto/less-noise/)。

## 升级会不会把我的配置弄丢？

会，如果你重跑了 `dsh superagent --from-default-profile ...`。这个命令只在全新安装时跑一次，重跑会替换 profile 并删掉 `cordis.patch.yml`。正确顺序是：备份 `orchestrator.sqlite` → `git pull && pnpm install && pnpm build` → `restart`。见 [升级不丢配置](/howto/upgrade/)。

## 我在哪看日志和排错？

启动日志在 `.artifacts/`（保留最近 20 个）；`scripts/dsh-superagent status` 用退出码 0/1/2/3 告诉你状态；面板 Overview 会列出安装问题并链到对应设置。完整的排查表在官方 `docs/006-deployment.md` 的 Troubleshooting。本站也整理了一份 [踩坑清单](/reference/pitfalls/)。

## 内容过时了怎么办？

本站按公开的 `docs/000`–`008`、`SETUP.md` 与 `README.md` 整理。上游更新后，请对照 [命令与配置速查](/reference/commands/) 逐条核对；发现哪一步照做不成功，欢迎到项目仓库提 Issue。
