# -*- coding: utf-8 -*-
"""术语表十条 + 站点资料五篇 + 六个栏目首页的导语。"""

WIKI = [
    dict(
        slug="teamai-repo", title="团队仓库（teamai repo）", nav="团队仓库", minutes=3, order=1,
        desc="一个 Git 仓库，装着团队所有可分发的 Agent 资源；整套系统的唯一事实来源。",
        body=r"""
## 一句话

装团队的 skills、rules、agents、hooks、mcp、env、models 的那个 Git 仓库。

## 打个比方

它像一个团队的**工具房**。以前每个人家里囤自己的螺丝刀，现在工具挂在墙上，谁要谁来取，新的挂上去要登记。

## 在这个项目里

默认是独立仓库（名字常叫 `<团队名>-teamai`）；也可以让业务仓库自己当团队仓库（`teamai init .`，资源写进 `.teamai/`）。

## 常见误区

- **以为它只是个备份。** 它是源：工具目录里的东西是它的投影，方向是「仓库 → 工具」。
- **以为可以随便 `rm`。** 删本地副本没用，下一次 `pull` 会装回来；要删请 `teamai remove`。
""",
    ),
    dict(
        slug="teamai-yaml", title="teamai.yaml（团队配置）", nav="teamai.yaml", minutes=3, order=2,
        desc="仓库根目录的团队配置文件：名字、评审人、强制规则、开关，都在这里。",
        body=r"""
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
""",
    ),
    dict(
        slug="scope", title="安装范围（scope）", nav="安装范围", minutes=3, order=3,
        desc="workspace 还是 user：资源装进当前项目，还是装进整台机器。",
        body=r"""
## 一句话

决定团队资源落在「这个项目」还是「这台机器的所有项目」。

## 打个比方

workspace 是把工具放进这个项目的抽屉；user 是把工具挂在你家的车库墙上。

## 在这个项目里

```bash
teamai init <repo>                 # workspace（默认）
teamai init <repo> --scope user    # user
```

两者可以共存，但 workspace 默认**隔离**：当前目录有 workspace 配置时，它生效，user scope 被跳过。
想组合，用 `--inherit-user-scope` 初始化 workspace（MCP 和密钥仍然只走 workspace）。

## 常见误区

- **以为 workspace 更安全。** 它只是范围更小，不是权限更严。
- **以为可以给不同子目录分别配。** 在 Git 仓库里，`init` 一律用仓库根；嵌套仓库和 worktree 各自独立。
""",
    ),
    dict(
        slug="hook", title="会话钩子（hook）", nav="会话钩子", minutes=3, order=4,
        desc="团队能分发的「事件发生时跑什么」，也是自动同步发生的地方。",
        body=r"""
## 一句话

AI 工具在特定时刻（开会话、调工具、结束）会执行的命令，团队可以统一分发。

## 打个比方

像公司门禁：刷卡进门（SessionStart）自动开灯，离开（Stop）自动关。

## 在这个项目里

`init` 会装四个内置钩子，其中一个就是 `SessionStart` → `teamai pull`，这就是"每次开会话自动同步"的来源。

团队自己写的钩子放在 `hooks/hooks.yaml` 或 `hooks/<id>/HOOK.yaml`：

```yaml
description: 提交前扫密钥
event: PreToolUse
matcher: Bash
command: bash "${TEAMAI_HOOK_DIR}/scan.sh"
timeout: 15
```

## 常见误区

- **以为钩子是只读的提醒。** 它会真的执行命令，`exit 2` 能拦下工具调用。
- **把 `${TEAMAI_HOOK_DIR}` 写进 `hooks.yaml`。** 那个变量只在目录型 hook 里有效，写在单文件里会让全部团队 hook 停掉。
""",
    ),
    dict(
        slug="pull", title="pull（同步）", nav="pull 同步", minutes=3, order=5,
        desc="把仓库里的事实，投影到你这台机器的各个工具目录；它保留你的改动。",
        body=r"""
## 一句话

`teamai pull` 是「仓库 → 你的机器」这一步。

## 打个比方

像把共享文档的最新版下载到本地——但你本地批注过的段落，它会留着并提醒你。

## 在这个项目里

会话启动时自动跑（靠 `SessionStart` 钩子）；也可以手动：

```bash
teamai pull
teamai pull --dry-run
teamai pull --force
teamai pull --team-ref v2.3.0
```

## 常见误区

- **以为它是一键覆盖。** 你改过的副本会保留并提示；同名冲突它两边都不投。
- **以为它能创建工具目录。** 缺失的工具根目录不会自动建，要用 `init --agent <id>` 补。
""",
    ),
    dict(
        slug="namespace", title="命名空间（namespace）", nav="命名空间", minutes=3, order=6,
        desc="子目录即命名空间：把资源分组，只发给声明了它的角色或项目。",
        body=r"""
## 一句话

仓库里的子目录名就是命名空间，例如 `skills/frontend/xxx/` 里的 `frontend`。

## 打个比方

像仓库的**分区**：A 区是给前端的，B 区是给收银台的，门口那个公共货架谁都能拿。

## 在这个项目里

- `skills/xxx/`：共享根，所有人
- `skills/frontend/xxx/`：只给 `resources.skills: [frontend]` 的角色或项目
- 同名技能只落一处：活跃命名空间取代共享根

## 常见误区

- **以为建了命名空间就自动限定。** 只有设了角色的成员才被限定；没设角色的人照旧收全部。
- **以为可以两层嵌套。** 只支持一级命名空间。
""",
    ),
    dict(
        slug="role", title="角色（role）", nav="角色", minutes=3, order=7,
        desc="成员的分工，决定他收到哪些命名空间的资源。",
        body=r"""
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
""",
    ),
    dict(
        slug="project", title="项目（project）", nav="项目", minutes=3, order=8,
        desc="正在做的服务，决定这个目录额外收到哪些 env、mcp、learnings、docs。",
        body=r"""
## 一句话

写在 `manifest/projects.yaml` 里的一条服务线，例如 `checkout`。

## 打个比方

像工位：你走到收银台那个工位，桌上是收银台的工具，不是账单系统的。

## 在这个项目里

```bash
teamai projects set checkout
teamai projects set            # 清除
teamai projects list
```

项目可以单独声明 `skills`、`env`、`hooks`、`mcp`、`models`、`docs`、`learnings`、`wiki`。

## 常见误区

- **以为和角色二选一。** 正交，两个都收。
- **以为换目录会自动换。** 要在那个目录里 `projects set`，选择存在该目录的配置里。
""",
    ),
    dict(
        slug="learning", title="经验（learning / recall）", nav="经验 recall", minutes=3, order=9,
        desc="团队踩过的坑写成可检索的条目；开了 recall，Agent 做任务前会先搜。",
        body=r"""
## 一句话

`learnings/` 里的团队经验条目，用 `teamai recall` 检索。

## 打个比方

像团队的**踩坑笔记本**，只不过它会在你动手前主动翻给你看。

## 在这个项目里

```bash
teamai recall enable           # 默认关
teamai recall "port conflict"
teamai recall --check "改支付回调"   # 只做相关性预检
teamai recall maintenance --prune --dry-run
```

开了之后，会话里反复纠正或重试，结束时会提示把经验分享给团队。

## 常见误区

- **以为它会自动变多。** 需要人（或 `teamai contribute` / `import`）写进去。
- **以为开了就一定会搜。** 还有相关性预检，不相关就不打扰。
""",
    ),
    dict(
        slug="scorer", title="评分器（scorer）", nav="评分器", minutes=3, order=10,
        desc="判断一次工作流或一次会话「做得好不好」的标准文件。",
        body=r"""
## 一句话

`scorers/<名字>.md` 里的评判标准，judge 按它给标签。

## 打个比方

像验收单：不是"看着还行"，而是逐条打勾。

## 在这个项目里

```bash
teamai score --session <id> --scorer code-quality
teamai score --run <run-id> --step lint --scorer code-quality
teamai digest        # 一段时间内的团队周报
```

它既是 Team Improvement 的入口，也是 `self-improvement` 的燃料：反复失败的场景会被变成一个改进 harness 的 PR。

## 常见误区

- **以为免费。** judge 要调模型，团队可以设每日上限。
- **以为评了就一定改进。** 标签只是信号，改不改还是人的决定。
""",
    ),
]

REFERENCE = [
    dict(
        slug="flow", title="概念全景图", nav="概念全景图", minutes=6, order=1,
        desc="一张图看懂：谁写、谁审、谁收，以及每一层失败时你会看到什么。",
        body=r"""
## 全景

```text
【团队仓库】Git
  teamai.yaml            团队配置
  skills/ rules/ agents/ 资源
  hooks/ mcp/ env/       运行时接入
  models/                模型网关
  manifest/              角色、项目、成员
  learnings/ teamwiki/   beta：上下文
  workflows/ scorers/    beta：改进
        │
        │  push（分支 + PR）↑  评审合并
        ↓  pull（自动 / 手动）
【你的机器】
  ~/.teamai/             配置、projects 分区、按 scope 的缓存
  各 AI 工具目录          skills/ rules/ agents/ hooks/ mcp 配置
  shell                   env 变量（按目录切换）
```

## 两个方向的规则不一样

| 方向 | 触发 | 会不会覆盖你 |
| --- | --- | --- |
| 仓库 → 机器（`pull`） | 会话启动钩子、手动 | 不覆盖你改过的副本 |
| 机器 → 仓库（`push`） | 你手动 | 要覆盖队友改动会先停下问你 |

## 每一层失败，你会看到什么

| 层 | 失败的样子 | 第一件事 |
| --- | --- | --- |
| 配置 | `teamai` 不认识你的团队 | `teamai doctor` |
| 仓库权限 | `push` 推不上去 | `--provider git` 或配 token |
| 同步 | 开会话没反应 | `teamai hooks list` |
| 落地 | 列表有、工具里没有 | `init --agent <id> --force` |
| 冲突 | Skipped / Held | 看 [同名冲突](/howto/name-conflict/) |

## 决定「谁收到什么」的三把尺

1. **命名空间**（目录名）——资源怎么分组；
2. **角色 / 项目**——成员怎么声明自己要什么；
3. **标签**——成员自愿额外订阅。

前两个是减法，第三个是加法。混着用是大部分"我为什么没收到"的来源。

## 三层能力分别要什么

| 层 | 要什么 | 能不能不用 |
| --- | --- | --- |
| Team Execution | 一个仓库 + 成员 `init` | 不能，这是本体 |
| Team Context | 打开 recall，有人写 learnings | 能，默认关 |
| Team Improvement | 评分器、工作流、模型额度 | 能，beta |
""",
    ),
    dict(
        slug="pitfalls", title="10 个常见的坑", nav="10 个坑", minutes=7, order=2,
        desc="每一个都真实发生过：从「没设角色反而收全部」到「删本地副本它又回来」。",
        body=r"""
## 1. 没设角色，收了一堆用不上的技能

命名空间只对**设了角色**的成员生效。没设角色 = 全同步。
→ 要么设角色，要么让团队用 `manifest/members.yaml` 分配。

## 2. 设了角色，共享根的还在

角色是减法，但减的是"命名空间之外的"，不是"共享根之外的"。
共享根（`skills/xxx/`）永远所有人可见。想彻底分开，就得把共享根的东西分流到命名空间。

## 3. 用 `rm` 删本地副本，下次开会话它又回来了

删副本不是删除资源。→ `teamai remove skills <名字>`。

## 4. `push` 之后同事还是旧的，以为坏了

`push` 只开 PR，==合并之后才对别人生效==。合并前 `teamai list skills --source repo` 已经能看到，但不会装到工具里。

## 5. 项目的 `.claude/` 目录压根没生成

非交互环境里 `init` 没带 `--agent`，它不会猜你要哪个工具。
→ `teamai init --agent claude --force`。

## 6. 把 `scope` 写进 teamai.yaml，发现没用

装到哪由成员执行 `init --scope` 决定，团队配置里的 `scope` 会被忽略。

## 7. 密钥写进了仓库

`env/secrets.yaml` 只声明 key；`models` 的 `api_key` 必须写 `${API_KEY}`。
团队仓库常常是全员可见的，一次误提交就是一次轮换。

## 8. 两个仓库给了同名资源，`pull` 说 Held

workspace 里 `svc-a` 和 `svc-b` 都提供了 `skills/lint` 但内容不同，它会暂缓并点名。
→ 在仓库里让两份一致，或给其中一个改名。

## 9. 把团队 hook 写进 `hooks.yaml` 却引用了 `${TEAMAI_HOOK_DIR}`

那个变量只在目录型 hook（`hooks/<id>/HOOK.yaml`）里有效。写在单文件里会**停掉全部团队 hook**，而且不报错。

## 10. 卸载前没看 `--dry-run`

`teamai uninstall --dry-run` 会逐条列出将移除的路径，且不改任何东西。
直接 `--force` 卸掉，会有一种"我的 dotfiles 怎么少了一段"的惊喜。

## 还有一条，算不上坑但值得记住

**`teamai doctor` 报告的是它所在目录的情况。** 换个目录再跑，可能是另一套配置——特别是你同时用 workspace 和 user scope 时。
""",
    ),
    dict(
        slug="commands", title="命令速查", nav="命令速查", minutes=8, order=3,
        desc="按「接入 / 日常 / 分发 / 资源 / 诊断」分组，只列最常用的那些。",
        body=r"""
## 接入

| 命令 | 用途 |
| --- | --- |
| `teamai init <repo>` | 项目级接入（默认） |
| `teamai init <repo> --scope user` | 整机级接入 |
| `teamai init . --agent claude,codex` | 业务仓库自托管，指定工具 |
| `teamai init --http <url> --token <key>` | 只读接入，不用 Git |
| `teamai init <repo> --provider git` | 用现有 Git 凭据，PR 自己开 |
| `teamai init <repo> --force` | 已初始化时覆盖 |
| `teamai bind-project` | HTTP 接入的工作区绑定到项目 |

## 日常

| 命令 | 用途 |
| --- | --- |
| `teamai pull` | 立即同步 |
| `teamai pull --dry-run` | 预览，不改文件 |
| `teamai pull --force` | 全量重算 |
| `teamai pull --team-ref <ref>` | 固定到团队某个版本 |
| `teamai push` | 推送本地资源（开 PR） |
| `teamai push --skill <path>` | 指定技能 |
| `teamai status` | 本地与仓库的差异 |
| `teamai status --all` | 所有项目分区 |
| `teamai list [type]` | 列资源（skills / rules / docs / env / agents / hooks / mcp / workflows） |
| `teamai list skills --source repo` | 只看仓库里的 |

## 分发治理

| 命令 | 用途 |
| --- | --- |
| `teamai roles list` / `roles set <id>` | 看 / 设角色 |
| `teamai roles add\|update\|remove` | 管理员改 `roles.yaml` |
| `teamai projects list` / `projects set <ids>` | 看 / 设项目 |
| `teamai projects add\|update\|remove` | 管理员改 `projects.yaml` |
| `teamai tags list` / `subscribe` / `unsubscribe` | 标签 |
| `teamai tags add\|remove` | 管理员打标 |

## 资源

| 命令 | 用途 |
| --- | --- |
| `teamai remove <type> <name…>` | 从仓库和所有工具移除 |
| `teamai env list` / `env set <KEY>` | 环境变量与密钥 |
| `teamai env exec -- <cmd>` | 带着团队 env 跑命令 |
| `teamai mcp list` / `inject` / `remove` | MCP server |
| `teamai hooks list` / `inject` / `remove` | 钩子 |
| `teamai models list` / `switch` / `restore` | 模型网关 |
| `teamai packages` | 装 `teamai.yaml` 声明的 npm 包与插件 |
| `teamai skill list` / `show` / `exclude` | 技能查看与个人排除 |

## 上下文与改进（beta）

| 命令 | 用途 |
| --- | --- |
| `teamai recall "查询"` | 搜团队经验 |
| `teamai recall enable` / `disable` / `status` | 开关自动召回 |
| `teamai contribute` | 贡献一份经验 |
| `teamai import --dir .` / `--from-repo <url>` | 导入代码知识 |
| `teamai dashboard` | 本地看板 |
| `teamai session save` / `migrate` / `search` | 会话归档与迁移 |
| `teamai digest` | 团队周报 |
| `teamai workflow start <wf>` | 创建工作流运行 |
| `teamai benchmark run <suite>` | 跑基准套件 |
| `teamai score --session <id> --scorer <name>` | 给会话打分 |

## 诊断与维护

| 命令 | 用途 |
| --- | --- |
| `teamai doctor` | 诊断 |
| `teamai doctor --json` | 机器可读 |
| `teamai doctor --fix` | 清理能安全清理的 |
| `teamai update --check` / `update` | 升级 |
| `teamai uninstall --dry-run` | 预览卸载 |
| `teamai uninstall [--force] [--agent <id>]` | 卸载 |
| `teamai --help` / `teamai <命令> --help` | 查当前版本的真实参数 |

++参数以 `--help` 为准++。上面这张表按 `0.30.0` 整理，beta 命令加得快，
用之前先 `teamai <命令> --help` 对一眼。
""",
    ),
    dict(
        slug="fit", title="适不适合你", nav="适不适合你", minutes=4, order=4,
        desc="四个问题判断要不要上；以及三种「其实不需要它」的情况。",
        body=r"""
## 四个问题

**1. 团队里有几个人在用 AI 写代码？**

一个人 → 收益接近 0，你的配置本来就一致。三个人以上 → 开始有价值。

**2. 你们有共享的 Git 仓库，并且有人做评审吗？**

没有评审习惯 → 先建习惯。TeamAI 的价值一半在"改动能被看见"，没有评审就只有另一半。

**3. 现在最大的痛是「不一致」还是「不会用」？**

- 不一致（每人一套、新人重配、规则漂移）→ 对症。
- 不会用（不知道该让 AI 干什么）→ 不对症。它不教你怎么用 AI，只负责把写好的东西发下去。

**4. 愿意维护一个仓库吗？**

角色、项目、标签设乱了会出现"他收到了我没收到"。这需要一个负责人，哪怕每周只看十分钟。

四条里三条是肯定，就可以开始了。

## 三种其实不需要它的团队

| 情况 | 为什么不需要 |
| --- | --- |
| 单人项目 | 自己记得住，`pull/push` 全是额外动作 |
| 团队只有一套技能、从不改 | 发一次压缩包就够了；等它开始变再上 |
| 只想统一模型网关 | 直接配工具自己的 settings 更快，不必为此引入整套分发 |

## 三种它帮不上的事

- **替你想清团队规范。** 它分发你写的东西，不生成规范。
- **强制所有人遵守。** 规则能进工具，人还是可以不听。
- **给你一个网页后台管人。** 中心是 Git，权限就是 Git 权限。

## 如果决定上，最小路径

1. 建一个空仓库，`teamai init`；
2. 先只放**一条**规则（比如代码评审规范），`push`、合并；
3. 让两个同事 `init`，确认他们收到了；
4. 一周之后再考虑第二个资源。

==一次只加一样东西==。这是唯一能避免"仓库变成垃圾场"的节奏。

## 相关

- 代价与前提：[它能帮你什么](/start/1-why/)
- 具体执行：[完整教程](/guide/0-what/)
""",
    ),
    dict(
        slug="about", title="关于与致谢", nav="关于与致谢", minutes=3, order=5,
        desc="这份教程依据什么写的、和官方文档什么关系、哪些是原创。",
        body=r"""
## 这是什么

一份**非官方**的中文入门教程，讲 [Tencent/teamai-cli](https://github.com/Tencent/teamai-cli)
（TeamAI）：把团队的 skills、rules、agents、hooks、MCP、env、models 放进一个 Git 仓库，同步到每个人的 AI 工具。

## 内容依据

- 官方 `README.md` / `README.zh-CN.md`（产品概览、能力表、快速开始）
- `docs/usage-guide.zh-CN.md`（接入与使用指南目录）
- `docs/product-overview.zh-CN.md`（三层能力、仓库结构）
- `docs/guide/zh-CN/`：`getting-started`、`distribution`、`sharing`、`member-guide`、
  `skill`、`faq`、`reference`、`windows`、`providers`
- `skill-data/core/references/commands.md`（完整命令参考）

本文核对到 CLI `0.30.0`（2026-11）。命令、参数与行为==以官方仓库为准==；
版本更新后如有出入，请提 Issue 或直接以 `teamai --help` 的输出为准。

## 信息架构参考

站点的三栏骨架、双轨（新手 / 完整教程）、每页一句话、术语悬停、全站搜索、亮暗主题，
参考了 [nevertoday/xxd-pstack](https://github.com/nevertoday/xxd-pstack) 的公开做法。
那是另一份教程站，讲的是别的东西；本站只借用信息组织方式，没有复制它的教程正文、文案或插画。

界面用小小东 UI Kit（`public/xxd/`），构建产物遵循它自带的许可（非商用免费，商用需授权），
不在本站 MIT 范围内。

## 本站原创的部分

- 全部中文讲解、类比、表格与阅读顺序
- 每一篇里的「你应该看到什么 / 不对怎么办」
- [10 个常见的坑](/reference/pitfalls/) 与 [适不适合你](/reference/fit/) 的判断框架
- 首页的对比表、流程图与分流结构

## 反馈

发现哪里没写清楚、照做不成功：欢迎到官方仓库提 Issue（内容是官方的问题），
或在本站仓库提 Issue（讲法的问题）。

## 许可

本站原创文字与站点代码：MIT。上游 `Tencent/teamai-cli`：MIT，版权归腾讯及贡献者。
""",
    ),
]

START_HOME = r"""
不会写代码也能走完的三课，20 分钟。

1. [它能帮你什么](/start/1-why/)：四分钟判断值不值得做。
2. [装上它](/start/2-install/)：一句话让你的 AI 工具装好，或者自己 `npm install`。
3. [第一次接入](/start/3-join/)：加入团队，三个检查点确认资源真的到了。

每课都写了「你应该看到什么」，不对也有地方查。走完这三课，你就能和团队用同一套东西；
想管更多，再去 [完整教程](/guide/)。
"""

GUIDE_HOME = r"""
九步，从「它是什么」到「怎么维护」。会配环境的人可以直接按顺序走。

前四步是必经之路（准备 → 安装 → init → 理解 pull 的落点）；
中间三步开始有选择（push 分享、角色项目、beta 的工作流）；
最后一步是收尾（诊断、升级、卸载）。

如果你只想解决眼前一件事，不用按顺序读，去 [How-to 实操](/howto/) 更快。
"""

HOWTO_HOME = r"""
一篇只讲一件事，每篇都给可照抄的命令。按你现在要干的事挑：

- 刚加入团队 → [加入一个已有团队](/howto/join-team/)
- 想共享东西 → [分享一个 skill](/howto/share-skill/)
- 拉不下来 → [拉不下来怎么办](/howto/nothing-synced/)
- 要写资源 → [写 skill](/howto/write-skill/) / [写规则](/howto/write-rule/)
- 要限定范围 → [设角色](/howto/set-role/) / [设项目](/howto/set-project/)
- 出问题了 → [doctor 怎么读](/howto/doctor/)

只想抄命令，直接看 [场景清单](/howto/recipes/)。
"""

WIKI_HOME = r"""
十个概念，每个按同一套结构讲：**一句话 → 打个比方 → 在这个项目里 → 常见误区**。

不用按顺序读。看到正文里带虚线的词，鼠标悬停就有一句话解释；想系统看一遍，
从 [团队仓库](/wiki/teamai-repo/) 开始，它是其他九个的地基。

术语表只解释「这个词指什么」，不解释「怎么用」。怎么用请看 [完整教程](/guide/) 或 [How-to](/howto/)。
"""

REFERENCE_HOME = r"""
站点的资料区，不是教程，是查阅用的：

- [概念全景图](/reference/flow/)：一张图看懂谁写、谁审、谁收
- [10 个常见的坑](/reference/pitfalls/)：每一个都真实发生过
- [命令速查](/reference/commands/)：按场景分组，附一句「以 `--help` 为准」
- [适不适合你](/reference/fit/)：四个问题给结论
- [关于与致谢](/reference/about/)：依据什么写的、和官方文档什么关系
"""
