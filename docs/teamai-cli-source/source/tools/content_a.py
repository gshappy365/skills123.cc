# -*- coding: utf-8 -*-
"""新手入门三课 + 完整教程九步。

文字为本站原创；事实依据 Tencent/teamai-cli 的 README.zh-CN.md、docs/usage-guide.zh-CN.md、
docs/product-overview.zh-CN.md 与 docs/guide/zh-CN/ 下的 getting-started、distribution、sharing、
member-guide、faq、reference 等页面。
"""

START = [
    dict(
        slug="1-why", title="它能帮你什么", nav="1 · 它能帮你什么", minutes=4, order=1,
        desc="四分钟判断这件事值不值得做，以及要准备什么、要付出什么。",
        body=r"""
## 一句话说清它是什么

把「团队怎么让 AI 干活」写成文件，放进一个 Git 仓库，再同步到每个人的 AI 工具里。

以前这些文件住在各自的笔记本上：你的 `~/.claude/skills`、他的 `.cursor/rules`、第三个人的 CodeBuddy 配置。
TeamAI 把它们搬进一个共享仓库，谁改了都看得见、评得着、回滚得了：

| 资源 | 在仓库里的样子 | 成员机器上变成 |
| --- | --- | --- |
| 技能 | `skills/<名字>/SKILL.md` | 各工具的 skills 目录 |
| 规则 | `rules/<名字>.md` | 各工具的 rules 目录 |
| 智能体 | `agents/<名字>.yaml` | 各工具自己的 agent 格式 |
| 钩子 | `hooks/hooks.yaml` | 各工具的 hook 配置 |
| MCP | `mcp/mcp.yaml` | 各工具的 MCP 配置 |
| 环境变量 | `env/env.yaml`（密钥只声明 key） | shell 里按目录注入 |

==你不需要记住这些路径==。它们只是「团队仓库长什么样」，同步是 `pull` 干的活。

## 装上以后，三个具体变化

1. **新同事第一天就有全套装备。** 他只要跑一次 `teamai init <仓库地址>`，剩下的技能、规则、钩子自己到位。
2. **改规矩变成一次评审。** 想改团队规范，改的是仓库文件，`teamai push` 开分支、开 PR，别人看得见、能拦。
3. **版本终于有历史。** 谁在什么时候改了哪条规则，`git log` 里都有。出问题就回滚。

## 它不做什么

- **不写你的团队规范。** 它只负责把这些文件分发出去；内容得你自己（或让 AI 陪你）写。
- **不替你跑 AI。** 装好之后你还是在自己的 Claude Code、Cursor、CodeBuddy 里干活。
- **不是云端管理后台。** 中心是 Git 仓库；本地看板只是一个查看入口。
- **不保证团队都遵守。** 规则进了工具，但人还是可以不听——它提供的是「一致的分发」，不是「强制执法」。

## 开始前要准备什么

| 要准备的 | 说明 |
| --- | --- |
| 一个 Git 仓库 | GitHub、GitLab、GitCode、CNB、工蜂都行，私有 Git 服务也行 |
| 仓库的写权限 | 管理员要能建分支、开 PR；主干建议开保护 |
| Node.js ≥ 20 | 用 `npm install -g teamai-cli` 装 CLI 时才需要 |
| 一个 AI 工具 | Claude Code、Cursor、CodeBuddy、WorkBuddy、Codex 等几十种都支持 |

没有仓库也想试？可以只读接入：`init --http <地址> --token <key>`，不需要 Git 也能收资源。

## 要付出的代价

- **多一层同步。** 开会话时会拉一次，第一次会多等几秒。
- **多一层评审。** 别人共享的 skill 要合并才生效，急着用会嫌慢（可以先本地 `skill exclude`，不要绕评审）。
- **要有人管。** 角色、项目、标签设乱了，会出现「他收到了我没收到」，得有人负责这份仓库。

## 你应该看到什么

读完这页，你应该能回答三个问题：它替团队解决什么、你手上有哪些前提、你愿意接受多这一层吗。
三条里有一条现在满足不了，先看 [适不适合你](/reference/fit/)，比硬装省时间。

## 不对怎么办

- **团队没有 Git 仓库**：先用只读 HTTP 方式接一次，或者先建一个空仓库——空仓库也能 `init`，第一份资源 push 进去它就有内容了。
- **不知道谁来合并**：这通常是团队没有代码评审习惯，先定一个人，比装工具更重要。

## 下一步

去 [第 2 课：装上它](/start/2-install/)——你其实不用自己敲命令。
""",
    ),
    dict(
        slug="2-install", title="装上它", nav="2 · 装上它", minutes=5, order=2,
        desc="两条安装路径：一句话让你的 AI 工具装好 skill，或者用 npm 装 CLI。",
        body=r"""
## 官方推荐：让 AI 工具自己装

TeamAI 有一个 `teamai` 技能，装进 AI 工具之后，你只要用中文说话，它负责敲命令。
把下面这句原样发过去（Claude Code、Cursor、CodeBuddy、WorkBuddy 都行）：

```text
帮我装好 teamai skill：https://github.com/Tencent/teamai-cli/tree/main/skills/teamai
加载 teamai skill，然后从零搭建团队的 TeamAI。
```

GitHub 打不开时，用国内镜像那句：

```text
请根据 https://skillhub.cn/install/skillhub.md，安装 @user_7be6e993/teamai。
然后加载 teamai skill，并从零初始化我的团队 teamai。
```

==这两句话的区别只是 skill 从哪来==，装完的效果一样。

## 另一条路：自己装 CLI

喜欢命令行就自己装。要求 Node.js ≥ 20：

```bash
npm install -g teamai-cli
teamai --version
```

装出来的 `teamai` 命令就是本体。AI 里的 `teamai` skill 只是「帮你敲命令的嘴」，两者不冲突，
你可以只装 CLI 一直手动敲，也可以两个都装。

## 三条接入路，先认清

| 你想要的 | 命令 | 需要什么 |
| --- | --- | --- |
| 只在当前项目用团队资源 | `teamai init <repo>` | 仓库地址 + Git 登录 |
| 整台机器所有项目都用 | `teamai init <repo> --scope user` | 同上 |
| 不碰 Git，只读收资源 | `teamai init --http <地址> --token <key>` | 管理员给你的地址和 key |

`init` 是后面所有事情的前提：没有它，`pull`、`status`、`push` 都不知道该对哪个仓库说话。

## 装完先跑一次诊断

```bash
teamai doctor
```

++这时候报"未初始化"是正常的++——还没 `init`，它当然不知道你的团队是谁。
这一步只是确认 CLI 本身能跑、Node 版本够、有哪些 AI 工具被认出来了。

## 你应该看到什么

- `teamai --version` 打出版本号（本文核对到 `0.30.0`，2026-11）。
- `teamai doctor` 能列出它检测到的 AI 工具，以及"尚未初始化"这类提示，而不是命令找不到。

## 不对怎么办

- **`teamai: command not found`**：npm 全局目录不在 PATH 上。看 `npm bin -g` 的输出，把它加进 `PATH`，或者用 `npx teamai-cli`。
- **`EBADENGINE` 或版本报错**：Node 低于 20。用 `node -v` 确认，升级后再装。
- **公司镜像装不上**：`npm install -g teamai-cli --registry=<公司源>`。
- **AI 工具说不会装 skill**：换一条路，直接用命令行装 CLI，效果一样。

## 下一步

去 [第 3 课：第一次接入](/start/3-join/)，把仓库连上，然后确认你真的收到了东西。
""",
    ),
    dict(
        slug="3-join", title="第一次接入", nav="3 · 第一次接入", minutes=6, order=3,
        desc="用一句话加入团队，然后按三个检查点确认资源真的到了你机器上。",
        body=r"""
## 先要一样东西：仓库地址

找团队管理员要团队仓库地址，形如 `https://github.com/your-org/your-team-teamai`。
你可能不是管理员，只需要读权限就能接入；要分享资源才需要能推分支。

## 一句话接入

在你要用 AI 的项目目录里打开 AI 工具，说：

```text
/teamai 帮我加入团队的 TeamAI，仓库地址是 https://github.com/your-org/your-team-teamai
```

它背后执行的是这条：

```bash
cd /path/to/my-workspace
teamai init https://github.com/your-org/your-team-teamai
```

==默认是项目级（workspace）==：资源装进当前项目目录，只有这个项目看得见。
想让整台机器都用，加一句：

```bash
teamai init https://github.com/your-org/your-team-teamai --scope user
```

两种范围的取舍见 [安装范围](/wiki/scope/)。

## init 到底做了什么

它不只是"下载一个仓库"，还顺手做了五件事：

1. 认出仓库在哪个 Git 平台，需要登录时带你登录；
2. 把本机登记成团队成员；
3. 给检测到的 AI 工具装上[[会话钩子|SessionStart hook：开会话时自动触发 teamai pull，你什么都不用记]]；
4. 做一次完整的 `pull`，把资源落到各工具目录；
5. 写下配置文件：团队仓库的 `teamai.yaml` 与你本机的 `~/.teamai/…`。

## 三个检查点

**第一，诊断每一行都通过。**

```bash
teamai doctor
```

**第二，刚 init 完，本地差异应该是空的。**

```bash
teamai status
```

**第三，能列出团队的东西。**

```bash
teamai list          # 团队仓库里的 skills、rules、docs、env、agents、hooks、mcp
teamai list skills --source repo
```

三条都对上，说明你已经跟团队在同一个版本上了。

## 以后你不用再管同步

打开 AI 工具，会话启动钩子会做一次 `pull`。Git 团队在 60 秒内会复用刚刷新的仓库，所以连着开几个会话不会反复拉。

想立刻同步（或者你的工具没有钩子支持）：

```bash
teamai pull
teamai pull --dry-run     # 只看看会改什么
```

++`pull` 不会覆盖你改过的副本++。团队成员改过的 skill、rule、agent 会被保留并提示出来，
这是它和「一键覆盖」最大的不同。

## 你应该看到什么

- `teamai list` 里出现团队共享的 skill 名字。
- 你的 AI 工具的 skills 目录里多出对应文件夹（例如 `~/.claude/skills/<名字>/SKILL.md`）。
- 开一个新会话，AI 能说出团队规则里的内容。

## 不对怎么办

- **`teamai list` 是空的**：团队仓库还没有内容。让管理员先 `push` 一份，或者自己去 [分享一个 skill](/howto/share-skill/)。
- **列表有、工具里没有**：`init` 时没选中你的工具。用 `teamai init --agent <工具id> --force` 补，或直接 `teamai pull --force`。
- **每次开会话都提示没同步**：钩子没装上。`teamai hooks list` 看状态，`teamai hooks inject` 重装。Windows 上还要额外配置，见 [让钩子在 Windows 上生效](/howto/windows-hooks/)。
- **拉下来但不是最新**：`teamai pull --force` 强制全量同步一次。

## 下一步

到这里你已经能用了。想搞清楚"为什么这么设计、还能怎么管"，去 [完整教程](/guide/0-what/)；
只想解决眼前一件事，去 [How-to 实操](/howto/)，或者直接看 [10 个常见的坑](/reference/pitfalls/)。
""",
    ),
]

GUIDE = [
    dict(
        slug="0-what", title="它到底是什么", nav="1 · 它到底是什么", minutes=6, order=1,
        desc="三层能力、仓库里有什么、和「每个人自己配」的差别，以及它明确不是什么。",
        body=r"""
## 一个仓库，三种用途

官方的说法是「基于 Git 打造三层能力」。翻成人话：

| 层 | 干什么 | 你什么时候会碰到 |
| --- | --- | --- |
| **Team Execution**（正式） | 让每个 Agent 按团队的方式工作：skills、rules、culture、agents、hooks、mcp、workflows、env、models | 日常，90% 的时间都在这层 |
| **Team Context**（beta） | 让 Agent 知道团队已经踩过什么坑：learnings、代码知识图谱、teamwiki | 你想让它"先查一下别人怎么做的"时 |
| **Team Improvement**（beta） | 把每次干的活沉淀回团队：usage、sessions、scorers、benchmarks | 想量化"用了之后到底好了多少"时 |

新手只看第一层就够。后两层是加了会更强的部分，没开也能正常用。

## 团队仓库里有什么

仓库按「资源类型」分目录，一个目录一类东西：

```text
teamai.yaml         团队自己的配置（名字、仓库地址、评审人、包、开关）
skills/             技能：<名字>/SKILL.md
rules/              规则：<名字>.md
claudemd/           共享指令（用 AGENTS.md 约定的团队可以叫 agentsmd/）
agents/             智能体：<名字>.yaml
culture.md          团队文化与做事方式
env/env.yaml        环境变量（密钥只写 key，不写值）
hooks/hooks.yaml    钩子
mcp/mcp.yaml        MCP server
models/models.yaml  模型网关配置
docs/               团队文档（pull 会同步）
learnings/          beta：团队经验
teamwiki/           beta：代码知识图谱
workflows/          beta：工作流
scorers/            beta：评分标准
manifest/           角色、项目、成员分配
```

==目录名就是协议。== 你把 `SKILL.md` 放对位置，它就知道这是技能；放错地方，它就不认。

## 它怎么把东西送到你手上

```text
管理员 push → 分支 + PR → 评审合并
                              ↓
        你的 AI 工具开会话 → SessionStart 钩子 → teamai pull
                              ↓
              skills/ rules/ agents/ hooks/ mcp/ 落到各工具目录
```

两个关键点：

- **中心只有 Git。** 没有数据库、没有服务端；权限就是 Git 权限。
- **落地是"投影"。** 仓库是源，工具目录是投影。你改投影，`pull` 不会粗暴覆盖，会保留并提示；要贡献回去就 `push`。

## 它明确不是什么

<div class="tu-note tu-note--warn">
<strong>三个常见误解</strong>
<p><strong>不是提示词仓库。</strong>它不生成内容，只负责把已有内容分发到正确位置。</p>
<p><strong>不是 SaaSS 后台。</strong>没有中心服务器，团队仓库就是全部事实来源。</p>
<p><strong>不是沙箱。</strong>被分发的 hooks 会真的在你的机器上跑命令，这也是为什么审批要严。</p>
</div>

## 你已经知道和它还差什么

- 你知道「skills、rules 该长什么样」——差的是"怎么统一"。→ 第 5 步 [pull 之后文件落在哪](/guide/4-pull/)
- 你知道「团队该有规范」——差的是"谁收到哪一份"。→ 第 6 步 [角色、项目、标签](/guide/6-scope/)
- 你知道「这东西得有人维护」——差的是"出问题怎么查"。→ 第 9 步 [诊断与维护](/guide/8-maintain/)

## 下一步

[动手前先准备好四样东西](/guide/1-prepare/)。
""",
    ),
    dict(
        slug="1-prepare", title="动手前先准备好四样东西", nav="2 · 先准备四样东西", minutes=6, order=2,
        desc="仓库、权限、Node 与 AI 工具：缺哪样会卡在哪一步，怎么用最小代价补齐。",
        body=r"""
## 一、一个团队仓库

新建一个空仓库就行，名字用 `<团队名>-teamai` 比较好认。位置随你：

- GitHub / GitLab / GitCode / CNB / 工蜂
- 私有 Git 服务（`--provider git`，只用你现有的 SSH Key 或凭据）
- 或者**业务仓库自己就是团队仓库**（`teamai init .`，资源写进 `.teamai/`）

还没有仓库？官方维护了一个 [teamai-hub](https://github.com/teamai-hub) 组织，里面是带了成套 skills、rules、评审 agents 的模板。
Fork 一个，再对它 `init`，比自己从零写快得多。

## 二、权限：分支能写，主干保护

| 角色 | 需要什么 | 为什么 |
| --- | --- | --- |
| 管理员 | 主干合并权限 | 别人 push 的 PR 得有人合 |
| 成员 | 分支写权限 | `push` 会推一个分支出去 |
| 只读者 | 读权限，或一个 HTTP key | `init --http` 不需要 Git |

主干建议开保护。不是因为工具会乱来，而是因为==这个仓库会往所有人的机器上装东西==，值得一道人工闸门。

## 三、Node.js ≥ 20

只有用 npm 装 CLI 才需要。查一下：

```bash
node -v      # 需要 v20 或更高
npm -v
```

装：

```bash
npm install -g teamai-cli
teamai --version
```

不想装 Node 也可以：让 AI 工具去装 `teamai` skill，skill 走的是工具自己的安装通道。

## 四、一个 AI 工具（其实可以很多个）

同一个团队仓库可以分发给多个工具，各按各的格式落盘。官方支持的范围很宽，常见的有：

Claude Code、Codex、Cursor、CodeBuddy、WorkBuddy、GitHub Copilot CLI、OpenCode、
Pi Coding Agent、Oh My Pi、OpenClaw、Hermes、DeepSeek Harness、Qoder、Kiro、Trae、ZCode、JoyCode、Muse Code、Antigravity。

不用提前纠结选哪个：`init` 会检测已安装的工具，你也可以用 `--agent` 指定。

## 顺便决定三件事

1. **装到哪。** 项目级（默认，只在当前目录生效）还是整机级（`--scope user`）。
2. **谁合并。** 团队仓库的 `teamai.yaml` 里有个 `reviewers` 字段，写上名字，评审时心里有数。
3. **要不要现在开 recall。** beta 能力，默认关。先别开，等第一层跑顺了再说。

## 你应该看到什么

四样都齐：仓库地址有、权限够、`teamai --version` 有输出、至少一个 AI 工具在 `teamai doctor` 的检测列表里。

## 不对怎么办

- **公司 Git 走不通**：用 `--provider git`，它直接用你现有的 Git 凭据推分支，PR 你自己去网页上开。
- **完全没有 Git**：走 HTTP 只读路子，能收资源，但推不了东西。
- **团队用 GitHub Enterprise Server**：官方说明里没有把它列进支持范围，先确认再投入。

## 下一步

[安装：CLI 和 skill](/guide/2-install/)。
""",
    ),
    dict(
        slug="2-install", title="安装：CLI 和 skill", nav="3 · 安装 CLI 和 skill", minutes=4, order=3,
        desc="两种装法各自适合谁，装完怎么确认，以及之后怎么升级。",
        body=r"""
## 装 CLI（本体）

```bash
npm install -g teamai-cli
teamai --version
```

`teamai` 就是全部功能：`init`、`pull`、`push`、`doctor`、`dashboard` 都在它身上。

## 装 skill（省事的嘴）

`skills/teamai` 是官方提供的一个技能，装进 AI 工具之后，你可以用中文说话，它负责敲命令：

```text
安装 teamai skill：https://github.com/Tencent/teamai-cli/tree/main/skills/teamai ，然后加载它。
```

装好之后常用的四句：

```text
/teamai 帮我从零搭建团队的 TeamAI
/teamai 帮我加入团队的 TeamAI，仓库地址是 <repo>
/teamai 帮我把 xxx skill 分享给团队
/teamai 帮我打开 TeamAI 看板
```

==skill 不是必需品。== 它只是把「你记不住的那些命令」换成「你说人话」。CLI 装好，一切都照样能干。

## 装完的诊断

```bash
teamai doctor
```

它会告诉你：Node 版本、已识别的 AI 工具、钩子装没装、配置在哪、有没有遗留锁文件。
`init` 之前看到"未初始化"是正常的。

## 升级

```bash
teamai update --check     # 只看有没有新版
teamai update             # 升级
```

升级不需要重跑 `init`，配置和资源都在原地。

## 你应该看到什么

`teamai --version` 有版本号，`teamai doctor` 能跑完并给出分区报告，而不是报错退出。

## 不对怎么办

- **全局装完命令找不到**：npm 全局 bin 不在 PATH。`npm prefix -g` 看目录，把它加进 PATH。
- **权限错误 `EACCES`**：别用 `sudo npm -g`，改用 nvm 或改 npm 的 prefix。
- **装了两个版本**：`teamai doctor` 会提"其他安装"。团队仓库里可以打开 `updateOtherInstallations` 让它们一起更新。

## 下一步

[init：管理员建团队 / 成员加入](/guide/3-init/)。
""",
    ),
    dict(
        slug="3-init", title="init：管理员建团队 / 成员加入", nav="4 · init 的四种用法", minutes=8, order=4,
        desc="同一个命令的四种场景：建团队、加入、业务仓库自托管、只读接入，以及它会动哪些文件。",
        body=r"""
## 四种场景，一个命令

| 场景 | 命令 | 结果 |
| --- | --- | --- |
| 管理员从零搭建 | `teamai init <repo>` | 在本项目建好配置，收一次资源，之后你负责 push |
| 成员加入 | `teamai init <repo>` 或加 `--scope user` | 只收，不推；想分享再 push |
| 业务仓库自己当团队仓库 | `teamai init . --agent claude,codebuddy` | 资源写进仓库的 `.teamai/` |
| 只读接入，不碰 Git | `teamai init --http <地址> --token <key>` | 只需要一个 key |

## 管理员这一路

1. 建好空仓库，给同事分支写权限，主干开保护。
2. 在你要干活的项目里：

```bash
cd /path/to/my-workspace
teamai init https://github.com/your-org/your-team-teamai
```

3. 先放一个文件进去，免得第一次 `pull` 是空的：

```bash
mkdir -p ~/.claude/skills/team-style
cat > ~/.claude/skills/team-style/SKILL.md << 'EOF'
---
name: team-style
description: 团队代码风格与提交约定
---
# 团队风格
1. 提交前跑 lint 与测试
2. 一次提交只做一件事
EOF

teamai push
```

4. 去平台上合并它开出的 PR。合并之后，所有人下一次开会话就都有了。

## 成员这一路

```bash
cd /path/to/my-workspace
teamai init https://github.com/your-org/your-team-teamai
```

想整台机器都用：

```bash
teamai init https://github.com/your-org/your-team-teamai --scope user
```

==在 Git 仓库里，init 会用仓库根目录==，即使你在子目录执行。普通子文件夹不能单独配置，
`--force` 也覆盖不了父配置。嵌套仓库和 linked worktree 各自用各自的根。

## 常用开关

| 开关 | 用途 |
| --- | --- |
| `--scope user` | 装到 `~/`，所有项目可见 |
| `--agent <ids>` | 只给指定工具装（`claude`、`codex`、`cursor`、`codebuddy`…） |
| `--provider git` | 用现有 Git 凭据，不配平台 token（PR 自己开） |
| `--role <id>` | 非交互指定主角色 |
| `--project <ids>` | 激活一个或多个项目，`all` 表示全部 |
| `--force` | 已初始化时直接覆盖，跳过确认 |
| `--inherit-user-scope` | 项目级安装同时继承整机级的安全资源 |

## init 会动哪些文件

- 团队仓库的 `teamai.yaml`（管理员第一次 init 时写入）
- 本机 `~/.teamai/` 下的配置、仓库克隆、projects 分区
- 各 AI 工具目录里的 hooks 配置（SessionStart 等）
- 团队资源的落地副本（skills / rules / agents / mcp / env 注入）

++它不会复制团队的 skills 到你的项目里当源码。++ 那些是"投影"，被 `.git/info/exclude` 挡在版本控制之外（可以开）。

## 你应该看到什么

`teamai doctor` 每行通过；`teamai status` 是空的；`teamai list` 能列出团队资源。

## 不对怎么办

- **提示"已初始化"**：交互模式输 `y`，或者用 `--force`。
- **成员注册失败 / `teamai-reports` 分支被占用**：本地初始化仍然会完成。修好原因后再跑一次同样的命令即可。
- **`Cannot acquire lock`**：不是等别的进程，而是文件系统问题（权限、磁盘满、父路径是文件）。先修那个。
- **没生成 `.claude/` 目录**：非交互环境下没带 `--agent`，它不会猜。补 `teamai init --agent claude --force`。

## 下一步

[ pull 之后，文件落在哪 ](/guide/4-pull/)。
""",
    ),
    dict(
        slug="4-pull", title="pull 之后，文件落在哪", nav="5 · pull 的落点", minutes=7, order=5,
        desc="每类资源在仓库里长什么样、在你机器上变成什么，以及 pull 什么时候会「保留你的改动」。",
        body=r"""
## 落点总表

| 资源 | 团队仓库 | 你机器上 |
| --- | --- | --- |
| 技能 | `skills/<名字>/SKILL.md` | 各工具 `skills/<名字>/SKILL.md` |
| 规则 | `rules/<名字>.md` | 各工具 `rules/<名字>.md` |
| 目录型规则 | `rules/<名字>/RULE.md` + 附件 | `.teamai/delivered/rules/<名字>/`（或 `~/.teamai/rules/`） |
| 智能体 | `agents/<名字>.yaml` | 各工具格式：`.md` / `.toml` / `.agent.md` / `.json` |
| 钩子 | `hooks/hooks.yaml` | 写进工具 hook 配置，脚本落 `~/.teamai/hooks/<id>.<ver>/` |
| MCP | `mcp/mcp.yaml` | 写进工具 MCP 配置，目录落 `.teamai/delivered/mcp/<名字>.<ver>/` |
| 环境变量 | `env/env.yaml` | shell 启动文件里注入，`cd` 到目录自动切换 |
| 模型 | `models/models.yaml` | 只有 `teamai models switch` 之后才改 agent |
| 文档 | `docs/` | 随 pull 同步到成员仓库 |

==同一个仓库，不同工具拿到不同格式。== 你不用管，`pull` 负责翻译。

## 自动同步是怎么来的

`init` 会给每个检测到的工具装一个 `SessionStart` 钩子。你打开 AI 工具、开始一次会话，钩子就触发一次 `pull`。

- Git 团队：60 秒内复用刚刷新过的仓库，连开几个会话不会重复拉。
- 并发启动：会排队等同一个安装范围的同步锁，再从已经刷新的克隆检查落地。
- 失败了不算刷新：下一次启动会重试。

想立刻同步，或者工具不支持钩子：

```bash
teamai pull
```

## pull 的三种脾气

1. **你改过的副本，它不覆盖。** 会明确告诉你「这个副本你改过，teamai 不再投递，留着还是删掉你自己定」。
2. **同名冲突，它两边都不投。** 比如 `skills/greet.md` 和 `skills/greet/` 同时存在，直接报错而不是猜。
3. **`--force` 才全量重算。** 仓库没变化时它会跳过，强制一次才从头对一遍。

## 手动 pull 的三个用法

```bash
teamai pull --dry-run     # 只预览，不动文件
teamai pull --force       # 忽略"仓库没变化"，全量同步
teamai pull --silent      # 给钩子用的静默模式
```

还有一条容易被忽略的：**把 workspace 固定到团队某个版本**。

```bash
teamai pull --team-ref v2.3.0     # 试团队的新版本
teamai pull --team-ref main       # 解除固定
```

固定期间 `push` 不会发东西，适合"先试试这个分支能不能用"。

## 你应该看到什么

`pull` 结束会打印一份小结：新增几个 skill、更新几个、保留了哪些你改过的、删掉了哪些不再投递的。
认真看"保留"和"删除"这两行，其他都是好消息。

## 不对怎么办

- **拉了但工具里看不到**：工具根目录不存在。`teamai pull` 不会主动创建缺失的工具目录，用 `init --agent <id>` 补。
- **Codex 的技能跑到 `.agents/skills` 了**：正常。Codex 两个目录都读，teamai 把同一团队的技能放一处，好让技能之间能互相引用。
- **rules 目录型资源找不到附件**：用 `${TEAMAI_RULE_DIR}` 引用，pull 时会替换成真实路径。

## 下一步

[把资源分享给团队](/guide/5-push/)。
""",
    ),
    dict(
        slug="5-push", title="把资源分享给团队", nav="6 · push 分享资源", minutes=7, order=6,
        desc="从本地写一个 skill 到同事收到它，中间经历什么，以及命名空间怎么选。",
        body=r"""
## 一条最小路径

你在本地写了个好用的 skill，想让同事也用。

```bash
# 1. 它本来就在你的工具目录里
~/.claude/skills/release-check/SKILL.md

# 2. 推上去
teamai push --skill ~/.claude/skills/release-check

# 3. 它会：补全 frontmatter → 推一个分支 → 在团队仓库开 PR
```

4. 团队仓库的评审人合并这个 PR。
5. 同事下一次开会话就自动拉到了。合并之前，`teamai list skills --source repo` 其实已经能看到它。

`push` 不带参数时，会从它在你的 AI 工具里找到的资源里让你挑。

## push 会顺手做三件事

- **补 frontmatter。** 没有 `name` / `description` 的 `SKILL.md`，它会补上——否则这个技能在工具里没名字、没描述，等于不存在。
- **只发有变化的。** 没有新内容时它会直接说 `no new resources detected`。
- **更新已有的 PR。** 同一个资源再推一次，改的是原来那个 PR，不会撒一地。

## 选目录：三种放置

| 参数 | 放到哪 | 谁收到 |
| --- | --- | --- |
| 不写 | 团队共享根目录 | 所有人 |
| `--role <ns>` | `skills/<ns>/…` | 设了该角色的成员 |
| `--project <id>` | 该项目的命名空间 | 激活了该项目的成员 |
| `--shared true` | 强制放共享根（不能和上面两个同用） | 所有人 |

不确定就放共享根。**加了命名空间就等于开始做分发治理**，得配合 [角色与项目](/guide/6-scope/) 才完整。

## 推一个文件，不是推一个技能

有时候你只想把某个配置文件放进仓库：

```bash
teamai push --file ./ci/template.yml --path rules/ci/template.md
```

逐字节推送，不做任何转换。

## 删除已推送的资源

```bash
teamai remove skills release-check
teamai remove rules ci-style
```

它会同时从团队仓库和所有本地 AI 工具里删掉。==别用 `rm` 手动删本地副本==——那样下一次 `pull` 会把它又装回来。

## 一条团队约定（建议写进仓库）

```text
一个 PR 只改一类资源；改 skill 的 PR 不夹带 rules。
新增资源在 PR 描述里写清「什么时候用」，方便别人判断要不要装。
```

这不是工具强制的，但能省掉大量"这个 skill 干嘛的"追问。

## 你应该看到什么

`push` 结束会打印分支名和 PR 链接。平台上能看到改动预览，评审人合完，别人 `pull` 一次就有了。

## 不对怎么办

- **`no new resources detected`**：本地没有新东西，或者你改的是落地副本而不是源。改完记得保存。
- **提示"将覆盖队友的改动"**：说明有人在你之后改过同一个文件。它会停下来并打印一个值，确认要看那份 diff 再用 `--carried <值>`。
- **没有 PR 权限**：`--provider git` 模式下它只推分支，PR 要你自己去网页上开。
- **同一分支推了两次**：会更新原 PR，不会开第二个。

## 下一步

[角色、项目、标签：谁收到什么](/guide/6-scope/)。
""",
    ),
    dict(
        slug="6-scope", title="角色、项目、标签：谁收到什么", nav="7 · 谁收到什么", minutes=8, order=7,
        desc="三个维度各自解决什么问题，以及「没设角色 = 全同步」这个最容易踩的坑。",
        body=r"""
## 三个维度，别混着用

| 维度 | 回答的问题 | 定义在哪 | 谁来设 |
| --- | --- | --- | --- |
| [[角色\|Role：成员的分工，比如前端、后端、SRE]] | 这个人干什么活 | `manifest/roles.yaml` | 成员自己，或团队分配 |
| [[项目\|Project：正在做的服务，比如 checkout、billing]] | 这个目录在做什么 | `manifest/projects.yaml` | 成员在当前目录设 |
| 标签 | 这份资源属于哪个主题 | `tags.yaml` | 成员订阅 |

- **角色是减法**：设了角色，就只收到角色声明的命名空间。
- **项目也是减法**：设了项目，多收到项目声明的资源。
- **标签是加法**：订阅了才会额外拉，永远不排除任何东西。

## 角色：写一次，成员各取所需

```yaml
# manifest/roles.yaml
version: 1
roles:
  - id: frontend
    description: Web 工程师
    resources:
      knowledge: [common, frontend]   # rules/frontend/、claudemd/frontend/
      skills: [common, frontend]
      agents: [common, frontend]
```

成员这边：

```bash
teamai roles list
teamai roles set frontend
teamai pull
```

## 项目：一个目录，一套资源

```yaml
# manifest/projects.yaml
version: 1
projects:
  - id: checkout
    name: 收银台
    resources:
      knowledge: [checkout]
      skills: [checkout]
      env: [checkout]
      mcp: [checkout]
```

```bash
teamai projects set checkout
teamai pull
```

角色和项目是**正交**的：一个人可以既是 frontend，又在做 checkout，两份资源都收。

## ==最大的坑：没设角色等于全同步==

命名空间只对**设了角色**的成员生效。`primaryRole` 没设的人，会同步**全部**技能。

所以只写 `roles.yaml` 限定不了任何人。要在真正意义上收窄，还得有 `manifest/members.yaml`：

```yaml
# manifest/members.yaml
version: 1
members:
  alice: [frontend]
  bob: [backend, ki]
default: []      # 没列出的成员：只收共享资源
```

这个文件存在时：

- 生效角色由文件决定，`teamai roles set` 会被拒绝；
- 没列出的成员拿到 `default`，只收共享资源；
- 改动要走 PR 评审——==角色变更从此是一次有记录的团队决定==，而不是某人笔记本上的一条命令。

## 标签：自愿加法

```yaml
# tags.yaml
skills:
  hai-deploy: [hai, infra]
rules:
  code-style: [coding]
```

```bash
teamai tags list
teamai tags subscribe infra
teamai pull
```

适合"少数人需要、但不想为它建一个角色"的资源。

## 强制规则：成员删不掉的

```yaml
# teamai.yaml
sharing:
  rules:
    enforced: [code-review-guide]
```

被强制的规则，成员不能通过删除本地副本绕过 `pull`。适合安全底线、提交规范这类"不接受商量"的东西。

## 同名冲突会怎样

同名技能每个只落一个目录，所以只能给你一份。规则是：**活跃命名空间里的副本取代共享根的那份**；
两个命名空间都有时，按名字排序靠前的胜出，`pull` 会逐条说明跳过了哪一份。

真要让所有人同时拿到两份，就**改名**，比如 `skills/dev/release-staging/`。

## 你应该看到什么

`teamai roles list --json` 能看到 `source` 字段：`assigned`（文件分配的）、`default`、`local`（自己设的）、`none`。
`source` 是 `local` 但团队有 `members.yaml` 时，说明你还没被列进去，去找管理员。

## 下一步

[工作流、评分器与 benchmark](/guide/7-workflow/)。
""",
    ),
    dict(
        slug="7-workflow", title="工作流、评分器与 benchmark", nav="8 · 工作流与评分", minutes=7, order=8,
        desc="beta 能力：把一件多步的活写成 yaml，用评分器判断做得好不好，用 benchmark 比较工具和模型。",
        body=r"""
## 先判断要不要读这页

这一层是 beta，而且比前七步重得多。满足下面三条里两条再看：

- 团队已经稳定用 `pull/push` 管资源；
- 有一件事反复做、步骤固定（发布、迁移、评审）；
- 想拿数字回答"换模型到底好没好"。

只想知道"怎么把技能发出去"，直接跳到 [诊断与维护](/guide/8-maintain/)。

## 工作流：把步骤写下来

`workflows/<名字>/WORKFLOW.yaml`，一次运行有明确的步骤和结局：

```yaml
schemaVersion: v1alpha1
name: release-check
description: 发布前把该跑的都跑一遍
steps:
  - id: lint
    command: npm run lint
  - id: test
    command: npm test
  - id: changelog
    command: node scripts/changelog.mjs
```

驱动方式两种：

```bash
teamai workflow start release-check --driver skill    # 当前编码会话驱动，你能看见每一步
teamai workflow start release-check --driver local    # 无头执行，适合 CI
teamai workflow start release-check --describe        # 只看它要什么输入
```

运行中用 `workflow next` 拿下一步、`workflow report` 上报结果、`workflow respond` 回答人工确认、
`workflow cancel` 取消。卡住了用 `workflow resume` 继续，跑完了可以用 `workflow publish` 把状态发到 `teamai-reports` 让 runner 接手。

## 评分器：判断"做得好不好"

`scorers/<名字>.md` 写标准，judge 按它给标签。它不只评工作流，也能评**已结束的 agent 会话**：

```bash
teamai score --session <id> --scorer code-quality
teamai score --run <run-id> --step lint --scorer code-quality
```

`teamai digest` 会把一段时间内的活动汇总成一份团队周报——这是"用了之后到底有没有变好"最省力的入口。

## benchmark：比较工具和模型

`benchmarks/<套件>/SUITE.yaml` 里放自己的任务，跑多个 arm 比较：

```bash
teamai benchmark run my-suite
teamai benchmark run my-suite --fail-on-regression   # 通过率掉了就退出码 1，能挂 CI
teamai benchmark try <task>                          # 单任务试跑，不用 init
```

## self-improvement：让失败变成改动

```bash
teamai self-improvement run code-quality
```

它把评分器反复判失败的场景，变成一个"改 harness + 加回归任务"的 PR，并在每个工具上验证。
这是三层里最"自动"的部分，也最需要人审。

## 代价与边界

<div class="tu-note tu-note--amber">
<strong>先把这三句读完</strong>
<p>工作流会真的执行命令，<code>--sandbox</code> 只是**声明这台机器是沙箱**，不是给你一个沙箱。</p>
<p>评分要用模型 judge，是要花钱的；团队可以设每日上限。</p>
<p>这一层是 beta，yaml 结构可能变。写之前先 <code>--describe</code> 看一眼当前版本的字段。</p>
</div>

## 你应该看到什么

`workflow start --describe` 能打印出工作流的输入 schema，而不是报"未知工作流"。

## 不对怎么办

- **说工作流不存在**：目录里缺 `WORKFLOW.yaml` 标记文件，teamai 就不认为那是个工作流。
- **跑起来立刻失败**：看 `teamai doctor` 的运行模式（attended / unattended），很多步骤在无人值守下行为不同。
- **评分一直跳过**：团队可能关了 `scoring`，或你这台机器的 `~/.teamai/config.yaml` 设了更严的限制。

## 下一步

[诊断、升级、换团队、卸载](/guide/8-maintain/)。
""",
    ),
    dict(
        slug="8-maintain", title="诊断、升级、换团队、卸载", nav="9 · 诊断与维护", minutes=7, order=9,
        desc="出问题先 doctor，升级不用重装，换团队要 force，卸载能预览。四条命令覆盖后半程。",
        body=r"""
## 出问题先做这一步

```bash
teamai doctor
```

它会点名：钩子缺了、工具没识别到、token 没设、配置在哪、有没有遗留锁文件、run 模式是什么。
`--json` 给机器看，`--fix` 清理能安全清理的东西（已死进程的锁、失败的运行分支、过期残留）。

++`doctor --fix` 只删确定没人用的东西++：仍被活进程持有的锁、没记录所有者的锁，它不动。

## 升级

```bash
teamai update --check
teamai update
```

升级不需要重新 `init`。多份全局安装（比如 nvm 下有好几个 Node）可以在配置里打开
`updateOtherInstallations: true` 一起更新。

## 换团队

用新仓库 `init` 并加 `--force`，再 `pull` 一次：

```bash
teamai init https://github.com/your-org/platform-team --agent claude,codex --force
teamai pull
```

这次 pull 会从每个工具里删掉**旧团队发的、你没改过的**技能和规则。你改过的副本会留下，并明确指出来。

Hermes 和 OpenClaw 是例外：它们全机共用一个技能目录，旧团队的技能会留在那儿，需要你自己确认后删除。

## 卸载

```bash
teamai uninstall --dry-run     # 先看会删哪些路径
teamai uninstall               # 交互确认
teamai uninstall --force       # 脚本里用
teamai uninstall --agent claude  # 只卸某一个工具
```

规则很简单：**你自己建的文件留下**；teamai 写进去的部分去掉后如果整份文件空了，才删整份。

整机级（`--scope user`）卸载会保留仍登记的项目数据。想彻底干净：先把各个项目逐个卸载，
再在任何项目之外跑一次 `teamai uninstall`。

## 钩子单独处理

```bash
teamai hooks list
teamai hooks inject --dry-run
teamai hooks inject
teamai hooks remove
```

卸载时如果预览里出现 "Kept for other teamai installs"，说明别的安装还在用这些钩子。
确认没有别的 workspace 还在用，就先在仍配置 TeamAI 的工作区里 `teamai hooks remove`，再卸载。

## 备份什么

真正值得备份的只有两处：

- **团队仓库**（它就是全部资源，Git 本身就是备份）；
- **`~/.teamai/`**（你的本地配置、projects 分区、模型密钥的引用）。

++不要备份各工具目录里 pull 下来的副本++。它们是投影，重新 `pull` 就有了。

## 你应该看到什么

`teamai uninstall --dry-run` 会逐条列出"将移除的受管路径"，并且**不改任何东西**。
确认清单里没有你手写的文件，再真卸。

## 不对怎么办

- **卸载后 `teamai` 命令还在**：那只删了注册，没删 npm 包。`npm uninstall -g teamai-cli`。
- **重装后连不上**：旧配置还在 `~/.teamai/`。`init` 时会问要不要覆盖，或者直接 `--force`。
- **项目分区残留**：`teamai status --all` 能看到所有分区，逐个卸载后再整机清理。

## 看完这九步之后

- 想解决具体一件事：去 [How-to 实操](/howto/)。
- 想避开别人踩过的坑：去 [10 个常见的坑](/reference/pitfalls/)。
- 想查某个参数：去 [命令速查](/reference/commands/)。
""",
    ),
]
