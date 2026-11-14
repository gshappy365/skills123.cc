---
title: "用熟以后"
description: "改提示词、从观察到自动、加一个来源，以及升级时不丢配置的正确顺序。"
---

# 用熟以后

## 能改的三段团队文字

`prompts/` 和 `skills/` 里放着默认值。团队常改的是三段：

| 段落 | 管什么 |
| --- | --- |
| Communication | 什么时候说话、消息怎么写、GitHub 消息开头那句声明（默认是 `This is by an automated agent, not a human`）、怎么处理评审、哪些普通账号其实是评审机器人 |
| Ticket scope | 工单什么时候继续、什么时候带着草稿停下 |
| Delivery requirements | PR 里要什么证据、自动合并条件与行数阈值、提交署名 |

还可以加团队技能（例如 `identities`：哪个飞书用户对应哪个 GitHub 账号），以及覆盖几乎每一段内置提示词。覆盖要保留模板里的占位符：`{variables}`、`{version}`、`{mode}`、`{rules}`。

<div class="tu-note tu-note--warn">
<strong>改提示词改不了权限</strong><p>身份、权限、工具参数校验、回复用途与长度上限，都是 host 和工具强制的。提示词排在它们之后；外面的消息、评论、文档只是数据，永远不改规则。优先级从强到弱：<strong>host 强制的事实 → 内置与生成段落 → 主动工单命中的规则 → 团队段落与技能 → 外部文本</strong>。</p>
</div>

执行器是无人值守的，它的工具里不包含 `ask_user_question`、`present`、`plugin_manager` 这类会找人、开界面或改 profile 的工具。执行器还会读 DSH 的编码提示词和仓库的 `AGENTS.md`；主会话不读。

## 从观察走到自动

1. `observe` 下先攒一阵「本来会接」的决定；
2. 逐条看理由和命中规则，判断它的判断准不准；
3. 准了，再考虑把 accept mode 切到 `auto`；不准，就改规则或改提示词；
4. 允许名单和准入表也一样：**先收窄，跑顺了再放宽**。

## 加一个新来源

`docs/008-cookbook.md` 用一个虚构的 `webhook` 来源演示了完整流程。要动的地方：

| 文件 | 加什么 |
| --- | --- |
| `src/sources/<kind>.ts` | 来源种类定义、稳定触发 id、丢弃自身消息、scope、channel、线程上下文、Policy 部分、环境变量、插件注入、轮询循环 |
| `src/kv.ts` | 登记游标键 |
| `tsdown.config.ts` / `package.json` | 加入口与 exports |
| `cordis.patch.yml`（根 + profile） | 注册条目，profile 里把 `disabled` 设成 false |
| `docs/007-architecture.md` | 模块表与测试表登记（`tests/docs.spec.ts` 会校验完整性） |
| `tests/<kind>.spec.ts` | 仿 `tests/sources.spec.ts` 写测试 |

文档特别提醒：setup 只检查 GitHub / 飞书那几个字段，所以新来源不会有账号类的安装问题。

## 升级顺序，别弄反

```
# 1. 等执行器没有在途的 turn
# 2. 备份状态数据库
cp <stateDir>/orchestrator.sqlite <stateDir>/orchestrator.sqlite.bak
# 3. 拉代码、装依赖、构建
git pull && pnpm install && pnpm build
# 4. 重启
scripts/dsh-superagent restart
```

**不要重跑 `dsh superagent --from-default-profile ...`**（会替换 profile 并删掉 `cordis.patch.yml`）。迁移过的数据库旧版本打不开，所以回滚必须靠备份。`cordis.patch.yml` 里 `dsh-superagent-worker` 和 `dsh-superagent-router` 两行在会话使用期间不能删，否则恢复会话会报 `agent-preset/not-found`。

## 每小时自检

在你**日常用的那个 profile** 里让编码智能体建一个定时任务（不是 `superagent` profile），大意是：跑 `scripts/dsh-superagent --profile superagent status`；退出 0 就什么都不说；退出 2 或 3 不重启、把 `errors` / `setup` 的内容告诉你；退出 1 且不是 `manually_stopped` 才执行 `--respect-stop restart`。完整提示词在 `docs/006-deployment.md`。

这条规则本身也体现了那句原则：**没事就别说话**。

## 最后，三条操作者责任

- **先收窄**：允许名单短一点，主动工作先只记录；看它对了几周再放宽。
- **把噪音调低**：吵的时候把提示词改短改严，或者暂停它；不要再加消息去解释噪音。
- **为它说的话负责**：读一遍它以团队账号发出去的内容，错了就改提示词。别用它刷量——批量 PR、群发消息、凑数的活，花掉的团队注意力比给回来的多。

## 接下来去哪

- 带着具体问题查：[How-to 实操手册](/howto/)
- 忘了某个词：[术语表](/wiki/)
- 想快速定位：[踩坑清单](/reference/pitfalls/) 与 [命令速查](/reference/commands/)
